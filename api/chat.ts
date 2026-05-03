import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

interface ProjectContext {
  name: string;
  classification: string;
  status: string;
  governance_profile: string;
  maturity_level?: string;
  description?: string;
}

interface RequestBody {
  message: string;
  project_id: string;
  conversation_id: string | null;
  project_context: ProjectContext;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const token = authHeader.slice(7);

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const { message, project_id, conversation_id, project_context } = body;

  if (!message?.trim() || !project_id || !project_context) {
    return new Response('Missing required fields', { status: 400 });
  }

  // ── Knowledge base search ─────────────────────────────────────────────────
  const words = message.trim().split(/\s+/).filter(w => w.length > 2);
  let kbEntries: Array<{ title: string; content: string; source: string; category: string }> = [];

  if (words.length >= 1) {
    const query = words.slice(0, 8).join(' | ');
    const { data: found } = await supabaseAdmin
      .from('knowledge_base')
      .select('title, content, source, category')
      .textSearch('search_vector', query, { type: 'websearch', config: 'english' })
      .limit(4);
    kbEntries = found ?? [];
  }

  // Supplement with category entries when query is short
  if (words.length < 3 && kbEntries.length < 2) {
    const fallbackCategory = project_context.governance_profile.toLowerCase().includes('high')
      ? 'compliance'
      : 'governance';
    const { data: catEntries } = await supabaseAdmin
      .from('knowledge_base')
      .select('title, content, source, category')
      .eq('category', fallbackCategory)
      .limit(2);
    if (catEntries) {
      const seen = new Set(kbEntries.map(e => e.title));
      kbEntries.push(...catEntries.filter(e => !seen.has(e.title)));
    }
  }

  const kbContext =
    kbEntries.length > 0
      ? kbEntries
          .map(e => `## ${e.title}\n${e.content}\n\nSource: ${e.source ?? 'GreenfieldworkAI'}`)
          .join('\n\n---\n\n')
      : 'No specific knowledge base entries matched this query. Provide general PMO AI adoption guidance based on your expertise.';

  // ── System prompt ─────────────────────────────────────────────────────────
  const systemPrompt = `You are an expert PMO AI Adoption Advisor built into GreenfieldworkAI. You have deep expertise in PMI's AI adoption framework, project governance, compliance, maturity assessment, and enterprise AI rollout strategy.

You are currently advising on this specific project:
- Project: ${project_context.name}
- Classification: ${project_context.classification}
- Status: ${project_context.status}
- Governance Profile: ${project_context.governance_profile}${project_context.description ? `\n- Description: ${project_context.description}` : ''}

Relevant knowledge base guidance for this conversation:
${kbContext}

Instructions:
- Give specific, actionable advice. Do not give generic AI responses.
- When governance requirements apply to this project's classification, name them explicitly.
- Keep responses focused and practical — 2–4 paragraphs maximum unless a list genuinely serves the user better.
- If you reference a stage gate, governance tier, or PMI framework element, be precise about the name.
- Do not hallucinate platform features. Only reference capabilities documented in the knowledge base.`;

  // ── Conversation history ──────────────────────────────────────────────────
  let history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  let activeConvId = conversation_id;

  if (activeConvId) {
    const { data: msgs } = await supabaseAdmin
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', activeConvId)
      .order('created_at', { ascending: true })
      .limit(10);
    history = (msgs ?? []) as typeof history;
  }

  // ── Create conversation if new ────────────────────────────────────────────
  let newConvId: string | null = null;
  if (!activeConvId) {
    const { data: conv } = await supabaseAdmin
      .from('ai_conversations')
      .insert({ project_id, user_id: user.id })
      .select('id')
      .single();
    if (conv) {
      newConvId = conv.id;
      activeConvId = conv.id;
    }
  }

  // ── Stream from Anthropic ─────────────────────────────────────────────────
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
  const encoder = new TextEncoder();
  let fullResponse = '';

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (obj: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

      try {
        if (newConvId) {
          emit({ conversationId: newConvId });
        }

        const anthropicStream = anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [...history, { role: 'user', content: message }],
        });

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const text = event.delta.text;
            fullResponse += text;
            emit({ content: text });
          }
        }

        // Persist messages after streaming completes
        if (activeConvId) {
          await supabaseAdmin.from('ai_messages').insert([
            { conversation_id: activeConvId, role: 'user', content: message },
            { conversation_id: activeConvId, role: 'assistant', content: fullResponse },
          ]);
          await supabaseAdmin
            .from('ai_conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', activeConvId);
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch {
        emit({ error: 'AI service temporarily unavailable. Please try again.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Conversation-Id': newConvId ?? activeConvId ?? '',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
