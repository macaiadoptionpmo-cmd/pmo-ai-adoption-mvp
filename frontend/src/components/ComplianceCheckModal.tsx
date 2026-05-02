import { useState } from 'react'
import { supabase } from '../api/supabaseClient'

interface ChecklistItem {
  id: string
  question: string
  answer: 'yes' | 'no' | 'na' | null
}

interface Policy {
  id: string
  name: string
  category: string
  items: string[]
}

const POLICIES: Policy[] = [
  {
    id: 'data-governance',
    name: 'Data Governance Policy',
    category: 'data',
    items: [
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
    items: [
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
    items: [
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
    items: [
      'Applicable regulations have been identified for this project',
      'Legal review has been completed for regulated data domains',
      'Consent and disclosure requirements are met',
      'Cross-border data transfer restrictions are assessed',
      'Audit logging meets regulatory retention requirements',
    ],
  },
]

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  data:       { color: '#1a6eb0', bg: '#e8f1fb' },
  model:      { color: '#1a7a5e', bg: '#e4f5ef' },
  ethical:    { color: '#7a4e1a', bg: '#fdf0e4' },
  regulatory: { color: '#6b2d7a', bg: '#f5e8fc' },
}

interface Props {
  projectId: string
  projectName: string
  user: { id: string; email?: string } | null
  onClose: () => void
  onComplete: () => void
}

export default function ComplianceCheckModal({ projectId, projectName, user, onClose, onComplete }: Props) {
  const [step, setStep] = useState<'select' | 'check' | 'result'>('select')
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<'compliant' | 'needs_review' | 'non_compliant' | null>(null)
  const [score, setScore] = useState({ yes: 0, no: 0, na: 0 })

  function startCheck(policy: Policy) {
    setSelectedPolicy(policy)
    setChecklist(policy.items.map((q, i) => ({ id: `item-${i}`, question: q, answer: null })))
    setStep('check')
  }

  function setAnswer(id: string, answer: ChecklistItem['answer']) {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, answer } : item))
  }

  const allAnswered = checklist.every(item => item.answer !== null)
  const answeredCount = checklist.filter(i => i.answer !== null).length

  function calculateResult(): 'compliant' | 'needs_review' | 'non_compliant' {
    const noCount = checklist.filter(i => i.answer === 'no').length
    const applicableCount = checklist.filter(i => i.answer !== 'na').length
    if (noCount === 0) return 'compliant'
    if (noCount / applicableCount <= 0.3) return 'needs_review'
    return 'non_compliant'
  }

  async function submitCheck() {
    if (!allAnswered || !selectedPolicy || !user) return
    setSaving(true)

    const yesCount = checklist.filter(i => i.answer === 'yes').length
    const noCount = checklist.filter(i => i.answer === 'no').length
    const naCount = checklist.filter(i => i.answer === 'na').length
    const checkResult = calculateResult()

    setScore({ yes: yesCount, no: noCount, na: naCount })
    setResult(checkResult)

    // Save to audit_log
    await supabase.from('audit_log').insert([{
      user_id: user.id,
      project_id: projectId,
      project_name: projectName,
      policy_id: selectedPolicy.id,
      policy_name: selectedPolicy.name,
      result: checkResult,
      score: yesCount,
      total: checklist.filter(i => i.answer !== 'na').length,
      checked_by: user.email || 'Unknown',
      checklist_snapshot: checklist,
    }])

    setSaving(false)
    setStep('result')
  }

  const RESULT_CONFIG = {
    compliant:     { label: 'Compliant',     color: '#1a7a5e', bg: '#e4f5ef', icon: '✓', message: 'This project meets all applicable requirements for the selected policy.' },
    needs_review:  { label: 'Needs Review',  color: '#8a6000', bg: '#fef9e4', icon: '!', message: 'Some items need attention. Review the "No" answers and create action items.' },
    non_compliant: { label: 'Non-Compliant', color: '#a0200e', bg: '#fde8e6', icon: '✕', message: 'This project has significant compliance gaps that must be addressed before proceeding.' },
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
    >
      <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 560, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        {/* Modal header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
              {step === 'select' ? 'Select Policy' : step === 'check' ? selectedPolicy?.name : 'Check Complete'}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{projectName}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#aaa', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Step: select policy */}
        {step === 'select' && (
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <p style={{ fontSize: 13, color: '#666', marginBottom: '1rem' }}>Choose which policy to check this project against.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {POLICIES.map(policy => {
                const c = CATEGORY_COLORS[policy.category]
                return (
                  <button
                    key={policy.id}
                    onClick={() => startCheck(policy)}
                    style={{ background: '#faf9f7', border: '1px solid #e8e6e0', borderRadius: 10, padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: 'border-color .1s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = c.color)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e6e0')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ background: c.bg, color: c.color, fontSize: 11, borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>{policy.category.toUpperCase()}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{policy.name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#aaa' }}>{policy.items.length} items →</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: run checklist */}
        {step === 'check' && selectedPolicy && (
          <div style={{ padding: '1.25rem 1.5rem' }}>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: 4, background: '#f0ede8', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#1a6eb0', borderRadius: 4, width: `${(answeredCount / checklist.length) * 100}%`, transition: 'width .2s' }} />
              </div>
              <span style={{ fontSize: 12, color: '#888', flexShrink: 0 }}>{answeredCount} / {checklist.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {checklist.map((item, i) => (
                <div key={item.id} style={{ padding: '1rem', background: '#faf9f7', borderRadius: 10, border: '1px solid #f0ede8' }}>
                  <div style={{ fontSize: 13, color: '#333', lineHeight: 1.5, marginBottom: 10 }}>
                    <span style={{ fontWeight: 600, color: '#aaa', marginRight: 8 }}>{i + 1}.</span>{item.question}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['yes', 'no', 'na'] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => setAnswer(item.id, opt)}
                        style={{
                          padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid',
                          borderColor: item.answer === opt ? (opt === 'yes' ? '#1a7a5e' : opt === 'no' ? '#a0200e' : '#888') : '#e8e6e0',
                          background: item.answer === opt ? (opt === 'yes' ? '#e4f5ef' : opt === 'no' ? '#fde8e6' : '#f0ede8') : '#fff',
                          color: item.answer === opt ? (opt === 'yes' ? '#1a7a5e' : opt === 'no' ? '#a0200e' : '#555') : '#888',
                          transition: 'all .1s',
                        }}
                      >
                        {opt === 'yes' ? '✓ Yes' : opt === 'no' ? '✕ No' : 'N/A'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
              <button onClick={() => setStep('select')} style={{ flex: 1, padding: '10px', background: '#f5f3f0', border: '1px solid #e8e6e0', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#555' }}>
                ← Back
              </button>
              <button
                onClick={submitCheck}
                disabled={!allAnswered || saving}
                style={{ flex: 2, padding: '10px', background: allAnswered ? '#1a1a1a' : '#e8e6e0', color: allAnswered ? '#fff' : '#aaa', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: allAnswered ? 'pointer' : 'not-allowed', transition: 'background .1s' }}
              >
                {saving ? 'Saving...' : 'Submit Check →'}
              </button>
            </div>
          </div>
        )}

        {/* Step: result */}
        {step === 'result' && result && (
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: RESULT_CONFIG[result].bg, color: RESULT_CONFIG[result].color, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 700 }}>
              {RESULT_CONFIG[result].icon}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: RESULT_CONFIG[result].color, marginBottom: 6 }}>{RESULT_CONFIG[result].label}</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 }}>{RESULT_CONFIG[result].message}</div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: '1.5rem' }}>
              {[{ label: '✓ Yes', value: score.yes, color: '#1a7a5e' }, { label: '✕ No', value: score.no, color: '#a0200e' }, { label: 'N/A', value: score.na, color: '#888' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, color: '#bbb', marginBottom: '1.5rem' }}>
              Logged to audit trail · {new Date().toLocaleDateString()}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setStep('select'); setResult(null); }} style={{ flex: 1, padding: '10px', background: '#f5f3f0', border: '1px solid #e8e6e0', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#555' }}>
                Run Another Check
              </button>
              <button onClick={() => { onComplete(); onClose(); }} style={{ flex: 1, padding: '10px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
