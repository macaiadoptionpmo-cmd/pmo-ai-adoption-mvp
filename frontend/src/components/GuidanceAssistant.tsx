import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';

// ── Types ──────────────────────────────────────────────────────────────────

interface ProjectContext {
  project_id: string;
  name: string;
  classification: string | null;
  status: string;
  governance_profile?: string | null;
  description?: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

const SUGGESTIONS = [
  'What governance gates apply to this project?',
  'How do I set up ROI tracking for this classification?',
  'What are the most important compliance steps right now?',
];

// ── Markdown renderer (no external dependency) ─────────────────────────────

function processInline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-gray-800 px-1 rounded text-xs font-mono">$1</code>');
}

function renderMarkdown(raw: string): string {
  const lines = raw.split('\n');
  const out: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (listType) {
      out.push(listType === 'ul' ? '</ul>' : '</ol>');
      listType = null;
    }
  };

  for (const line of lines) {
    const t = line.trim();

    if (t.startsWith('### ')) {
      closeList();
      out.push(`<h3 class="font-semibold text-gray-800 mt-3 mb-0.5 text-sm">${processInline(t.slice(4))}</h3>`);
    } else if (t.startsWith('## ')) {
      closeList();
      out.push(`<h2 class="font-semibold text-gray-900 mt-3 mb-1">${processInline(t.slice(3))}</h2>`);
    } else if (t.startsWith('# ')) {
      closeList();
      out.push(`<h1 class="font-bold text-gray-900 mt-4 mb-1 text-base">${processInline(t.slice(2))}</h1>`);
    } else if (/^[-*] /.test(t)) {
      if (listType !== 'ul') {
        closeList();
        out.push('<ul class="list-disc ml-4 space-y-0.5 my-1.5">');
        listType = 'ul';
      }
      out.push(`<li>${processInline(t.slice(2))}</li>`);
    } else if (/^\d+\. /.test(t)) {
      if (listType !== 'ol') {
        closeList();
        out.push('<ol class="list-decimal ml-4 space-y-0.5 my-1.5">');
        listType = 'ol';
      }
      out.push(`<li>${processInline(t.replace(/^\d+\. /, ''))}</li>`);
    } else if (t === '') {
      closeList();
      out.push('<br>');
    } else {
      closeList();
      out.push(`<p class="leading-relaxed">${processInline(t)}</p>`);
    }
  }

  closeList();
  return out.join('');
}

// ── Typing indicator ───────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function GuidanceAssistant({ project_id, name, classification, status, governance_profile, description }: ProjectContext) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Check if user has seen the assistant for this project
  useEffect(() => {
    const key = `ai_advisor_seen_${project_id}`;
    if (!localStorage.getItem(key)) {
      setShowPulse(true);
    }
  }, [project_id]);

  // Auto-scroll on new messages or streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Load conversation history when panel opens
  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      setLoadingHistory(true);
      try {
        const { data: conv } = await supabase
          .from('ai_conversations')
          .select('id')
          .eq('project_id', project_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (conv) {
          setConversationId(conv.id);
          const { data: msgs } = await supabase
            .from('ai_messages')
            .select('role, content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          if (msgs && msgs.length > 0) {
            setMessages(msgs as Message[]);
          }
        }
      } finally {
        setLoadingHistory(false);
      }
    };

    if (messages.length === 0 && !conversationId) {
      load();
    }
  }, [isOpen, project_id]);

  const handleOpen = () => {
    const key = `ai_advisor_seen_${project_id}`;
    if (showPulse) {
      localStorage.setItem(key, '1');
      setShowPulse(false);
    }
    setIsOpen(true);
    setTimeout(() => textareaRef.current?.focus(), 300);
  };

  const handleClose = () => {
    setIsOpen(false);
    abortRef.current?.abort();
  };

  const startNewConversation = () => {
    abortRef.current?.abort();
    setMessages([]);
    setConversationId(null);
    setStreamingContent('');
    setInput('');
    setIsLoading(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    const userMsg: Message = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Authentication error. Please refresh and try again.', isError: true }]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: trimmed,
          project_id,
          conversation_id: conversationId,
          project_context: { name, classification, status, governance_profile, description },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assembled = '';
      let receivedConvId = conversationId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            setMessages(prev => [...prev, { role: 'assistant', content: assembled }]);
            setStreamingContent('');
            setConversationId(receivedConvId);
            setIsLoading(false);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              assembled += parsed.content;
              setStreamingContent(assembled);
            }
            if (parsed.conversationId) {
              receivedConvId = parsed.conversationId;
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (parseErr) {
            if ((parseErr as Error).message !== 'Unexpected end of JSON input') {
              throw parseErr;
            }
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      const errMsg = (err as Error).message?.includes('AI service')
        ? (err as Error).message
        : 'Something went wrong. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg, isError: true }]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, conversationId, project_id, name, classification, status, governance_profile, description]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestion = (s: string) => {
    setInput(s);
    sendMessage(s);
  };

  const showSuggestions = messages.length === 0 && !loadingHistory && !isLoading;

  return (
    <>
      {/* ── Floating trigger ───────────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {showPulse && (
            <span className="absolute -top-1 -right-1">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
            </span>
          )}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.6 3.6 0 01-1.64 2.073A2.965 2.965 0 0112 18a2.965 2.965 0 01-1.656-.574 3.6 3.6 0 01-1.64-2.073L8.343 15l-.707-.707z"
            />
          </svg>
          AI Advisor
        </button>
      )}

      {/* ── Mobile backdrop ────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={handleClose}
        />
      )}

      {/* ── Slide-over panel ───────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.6 3.6 0 01-1.64 2.073A2.965 2.965 0 0112 18a2.965 2.965 0 01-1.656-.574 3.6 3.6 0 01-1.64-2.073L8.343 15l-.707-.707z"
                />
              </svg>
              <span className="font-semibold text-gray-900 text-sm">AI Advisor</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[260px]">{name}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={startNewConversation}
              title="Start fresh"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Loading history */}
          {loadingHistory && (
            <div className="flex items-center justify-center py-10">
              <span className="text-sm text-gray-400">Loading conversation...</span>
            </div>
          )}

          {/* Empty state */}
          {!loadingHistory && messages.length === 0 && !streamingContent && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.6 3.6 0 01-1.64 2.073A2.965 2.965 0 0112 18a2.965 2.965 0 01-1.656-.574 3.6 3.6 0 01-1.64-2.073L8.343 15l-.707-.707z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[260px]">
                Ask me anything about this project's governance, compliance requirements, or next steps.
              </p>
            </div>
          )}

          {/* Suggestion chips */}
          {showSuggestions && !loadingHistory && (
            <div className="flex flex-col gap-2 pt-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-left text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl px-4 py-2.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[80%] bg-indigo-600 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 leading-relaxed">
                  {msg.content}
                </div>
              ) : (
                <div
                  className={`max-w-[92%] text-sm text-gray-700 pl-1 ${msg.isError ? 'text-amber-700 bg-amber-50 rounded-xl px-3 py-2 border border-amber-200' : ''}`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              )}
            </div>
          ))}

          {/* Streaming content */}
          {streamingContent && (
            <div className="flex justify-start">
              <div
                className="max-w-[92%] text-sm text-gray-700 pl-1"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingContent) }}
              />
            </div>
          )}

          {/* Typing indicator (shown when loading but before first token) */}
          {isLoading && !streamingContent && (
            <div className="flex justify-start pl-1">
              <TypingDots />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="shrink-0 border-t border-gray-100 px-4 py-3">
          <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-200 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask about governance, compliance, stage gates…"
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-800 resize-none outline-none placeholder-gray-400 max-h-28 overflow-y-auto disabled:opacity-50"
              style={{ lineHeight: '1.5' }}
              onInput={e => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = `${Math.min(t.scrollHeight, 112)}px`;
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4 text-white disabled:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter to send
          </p>
        </div>
      </div>
    </>
  );
}
