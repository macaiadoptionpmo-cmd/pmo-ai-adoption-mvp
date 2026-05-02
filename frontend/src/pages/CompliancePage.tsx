import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../api/supabaseClient'

interface Policy {
  id: string
  name: string
  category: 'data' | 'model' | 'ethical' | 'regulatory'
  description: string
  checklist_items: string[]
}

interface AuditEntry {
  id: string
  project_name: string
  policy_name: string
  result: 'compliant' | 'needs_review' | 'non_compliant'
  checked_by: string
  created_at: string
  score: number
  total: number
}

interface ComplianceSummary {
  total: number
  compliant: number
  needs_review: number
  non_compliant: number
}

const POLICY_TEMPLATES: Policy[] = [
  {
    id: 'data-governance',
    name: 'Data Governance Policy',
    category: 'data',
    description: 'Ensures AI projects handle data with proper classification, access controls, and retention policies.',
    checklist_items: [
      'Data sources are documented and classified (public, internal, confidential, regulated)',
      'Data access is restricted to authorized personnel only',
      'Data retention and deletion schedules are defined',
      'PII and sensitive data handling procedures are documented',
      'Data quality standards are defined and monitored',
    ],
  },
  {
    id: 'model-governance',
    name: 'Model Governance Policy',
    category: 'model',
    description: 'Governs the selection, validation, monitoring, and retirement of AI models used in projects.',
    checklist_items: [
      'Model selection rationale is documented including alternatives considered',
      'Model performance metrics and acceptance thresholds are defined',
      'Model drift monitoring and retraining triggers are established',
      'Vendor AI ethics assessment has been completed',
      'Model versioning and rollback procedures are documented',
    ],
  },
  {
    id: 'ethical-ai',
    name: 'Ethical AI Policy',
    category: 'ethical',
    description: 'Addresses bias, fairness, transparency, and human oversight requirements for AI initiatives.',
    checklist_items: [
      'Bias assessment has been conducted across relevant demographic dimensions',
      'Human oversight model is defined — who reviews AI outputs before action',
      'Escalation path for low-confidence or flagged AI outputs is documented',
      'Stakeholders impacted by AI decisions have been identified',
      'Explainability requirements are defined and implemented',
    ],
  },
  {
    id: 'regulatory',
    name: 'Regulatory Compliance Policy',
    category: 'regulatory',
    description: 'Ensures AI projects comply with applicable regulations including GDPR, HIPAA, and industry standards.',
    checklist_items: [
      'Applicable regulations have been identified for this project',
      'Legal review has been completed for regulated data domains',
      'Consent and disclosure requirements are met',
      'Cross-border data transfer restrictions are assessed',
      'Audit logging meets regulatory retention requirements',
    ],
  },
]

const CATEGORY_META: Record<Policy['category'], { label: string; color: string; bg: string; icon: string }> = {
  data:       { label: 'Data',       color: '#1a6eb0', bg: '#e8f1fb', icon: '⬡' },
  model:      { label: 'Model',      color: '#1a7a5e', bg: '#e4f5ef', icon: '◈' },
  ethical:    { label: 'Ethical AI', color: '#7a4e1a', bg: '#fdf0e4', icon: '◎' },
  regulatory: { label: 'Regulatory', color: '#6b2d7a', bg: '#f5e8fc', icon: '◉' },
}

const RESULT_META = {
  compliant:      { label: 'Compliant',      color: '#1a7a5e', bg: '#e4f5ef' },
  needs_review:   { label: 'Needs Review',   color: '#8a6000', bg: '#fef9e4' },
  non_compliant:  { label: 'Non-Compliant',  color: '#a0200e', bg: '#fde8e6' },
}

interface Props {
  user: { id: string; email?: string } | null
  onRunCheck?: (projectId?: string) => void
}

export default function CompliancePage({ user }: Props) {
  const navigate = useNavigate()
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [summary, setSummary] = useState<ComplianceSummary>({ total: 0, compliant: 0, needs_review: 0, non_compliant: 0 })
  const [loading, setLoading] = useState(true)
  const [activePolicy, setActivePolicy] = useState<Policy | null>(null)

  useEffect(() => {
    if (user) fetchAuditLog()
  }, [user])

  async function fetchAuditLog() {
    setLoading(true)
    const { data } = await supabase
      .from('audit_log')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) {
      setAuditLog(data)
      const s = { total: data.length, compliant: 0, needs_review: 0, non_compliant: 0 }
      data.forEach((e: AuditEntry) => { s[e.result]++ })
      setSummary(s)
    }
    setLoading(false)
  }

  const adherenceRate = summary.total > 0
    ? Math.round((summary.compliant / summary.total) * 100)
    : null

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e6e0', padding: '0 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 13 }}>
              ← Dashboard
            </button>
            <span style={{ color: '#ccc' }}>|</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Compliance</span>
          </div>
          <button
            onClick={() => navigate('/projects')}
            style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
          >
            Run Check on Project →
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '2rem' }}>
          {[
            { label: 'Total Checks', value: summary.total, color: '#444' },
            { label: 'Compliant', value: summary.compliant, color: '#1a7a5e' },
            { label: 'Needs Review', value: summary.needs_review, color: '#8a6000' },
            { label: 'Adherence Rate', value: adherenceRate !== null ? `${adherenceRate}%` : '—', color: adherenceRate !== null && adherenceRate >= 80 ? '#1a7a5e' : '#8a6000' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Policy templates */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: '1rem' }}>Policy Templates</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {POLICY_TEMPLATES.map(policy => {
              const meta = CATEGORY_META[policy.category]
              const isActive = activePolicy?.id === policy.id
              return (
                <div
                  key={policy.id}
                  onClick={() => setActivePolicy(isActive ? null : policy)}
                  style={{
                    background: '#fff', border: `1px solid ${isActive ? meta.color : '#e8e6e0'}`,
                    borderRadius: 10, padding: '1.25rem', cursor: 'pointer',
                    transition: 'border-color .15s, box-shadow .15s',
                    boxShadow: isActive ? `0 0 0 3px ${meta.bg}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ background: meta.bg, color: meta.color, fontSize: 18, width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {meta.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{policy.name}</div>
                      <span style={{ fontSize: 11, background: meta.bg, color: meta.color, borderRadius: 4, padding: '1px 7px', fontWeight: 500 }}>{meta.label}</span>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: '#aaa' }}>{isActive ? '▲' : '▼'}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.5 }}>{policy.description}</p>

                  {isActive && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0ede8' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 6 }}>Checklist items ({policy.checklist_items.length})</div>
                      {policy.checklist_items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                          <span style={{ color: meta.color, fontSize: 11, marginTop: 2, flexShrink: 0 }}>◆</span>
                          <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Audit log */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: '1rem' }}>Audit Trail</h2>
          {loading ? (
            <div style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 10, padding: '3rem', textAlign: 'center', color: '#aaa', fontSize: 14 }}>Loading...</div>
          ) : auditLog.length === 0 ? (
            <div style={{ background: '#fff', border: '1px dashed #e8e6e0', borderRadius: 10, padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#444', marginBottom: 4 }}>No compliance checks yet</div>
              <div style={{ fontSize: 13, color: '#888' }}>Open a project and run your first compliance check to see results here.</div>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f0ede8', background: '#faf9f7' }}>
                    {['Project', 'Policy', 'Result', 'Score', 'Checked by', 'Date'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#888', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((entry, i) => {
                    const rm = RESULT_META[entry.result]
                    return (
                      <tr key={entry.id} style={{ borderBottom: i < auditLog.length - 1 ? '1px solid #f5f3f0' : 'none' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{entry.project_name}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>{entry.policy_name}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 12, background: rm.bg, color: rm.color, borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}>{rm.label}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>{entry.score}/{entry.total}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{entry.checked_by}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: '#aaa' }}>{new Date(entry.created_at).toLocaleDateString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
