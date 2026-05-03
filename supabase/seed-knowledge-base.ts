/**
 * Knowledge base seed script for Story 7: AI Guidance Assistant
 *
 * Run with:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx supabase/seed-knowledge-base.ts
 *
 * Or set the vars in a root-level .env file and run with:
 *   npx tsx supabase/seed-knowledge-base.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const entries = [
  // ── GOVERNANCE ────────────────────────────────────────────────────────────
  {
    category: 'governance',
    title: 'Governance Profile Model',
    source: 'GreenfieldworkAI Spec',
    content: `The Governance Profile Model classifies every AI project into one of three tiers that determine how much formal oversight is required.

**Must-Have (Tier 1):** Projects that process regulated data (HIPAA, GLBA, CCPA, GDPR), make decisions that materially affect customers or employees, involve external-facing AI, or carry high risk levels. These projects must complete all four stage gates with full sign-offs and cannot advance without documented compliance checks. Examples: AI-driven loan approvals, automated medical coding, customer-facing chatbots that access account data.

**Should-Have (Tier 2):** Internal operational projects with moderate risk that affect core business processes but do not involve regulated data or direct customer impact. These projects follow the stage gate process but some sign-offs can be delegated to department-level management rather than requiring executive or CISO approval. Examples: internal helpdesk automation, demand forecasting models, HR sentiment analysis.

**Not Needed (Tier 3):** Exploratory, experimental, or productivity-focused projects with no production deployment and no access to confidential data. These projects are tracked in the portfolio but operate under a lightweight governance plan — a concept brief and initial risk classification are sufficient. Examples: internal writing assistant pilots, code review AI experiments, sandbox NLP prototypes.

When assigning a governance profile, start with the initial risk classification from the Concept Brief and adjust upward if any regulated data is involved. Profiles should be re-evaluated at each stage gate and whenever the project's scope, data access, or deployment context changes significantly.`,
  },
  {
    category: 'governance',
    title: 'AI Work Classification Guide',
    source: 'PMI 2025',
    content: `Classifying an AI project correctly at the outset determines the governance path, ROI methodology, and stakeholder approval chain. GreenfieldworkAI uses four classifications aligned with the PMI AI Adoption Framework.

**Productivity:** AI tools that help individual employees work faster or better without changing the underlying process or making autonomous decisions. These typically operate on a user's own data or publicly available information. Governance burden is lowest. ROI is measured in time saved. Examples: writing assistants, meeting summarizers, code autocomplete, personal search tools.

**Operational:** AI embedded in a core business process where it influences or automates decisions that previously required human judgment. Data access is typically internal and often includes confidential information. Governance requirements are moderate to high depending on the decision stakes. Examples: claims processing automation, fraud detection, quality control inspection, customer service routing.

**Strategic/Product:** AI that is customer-facing, revenue-generating, or represents a core product differentiator. These projects require the highest level of governance, ethics review, and executive oversight because failures are externally visible and carry regulatory or reputational risk. Examples: AI-powered product recommendations, credit scoring, AI-driven healthcare diagnostics, algorithmic trading.

**Other:** Projects that don't fit the above categories — typically innovation lab experiments, feasibility studies, internal tooling prototypes, or AI infrastructure work (e.g., building a data pipeline for future AI use). Governance is minimal but projects must be registered and re-classified if they expand beyond their original scope.

**When to reclassify:** A project must be re-classified if it begins accessing a new category of data, if its outputs are used to make autonomous decisions instead of informing human decisions, or if it moves from internal to customer-facing deployment. Reclassification triggers a governance review and may require returning to an earlier stage gate.`,
  },
  {
    category: 'governance',
    title: 'Stage Gate Requirements',
    source: 'PMI 2025',
    content: `The GreenfieldworkAI governance framework uses four stage gates to control the progression of AI projects from concept to production. Each gate has required deliverables, a defined approver, and a clear blocking condition.

**Gate 1 — Concept Approved:** Required deliverables: completed AI Concept Brief (all seven fields), work classification confirmed, executive sponsor named, initial risk level assigned. Approver: PMO Lead or designated AI governance coordinator. What blocks advancement: no named sponsor, missing classification, or Concept Brief with fewer than four of seven required fields completed.

**Gate 2 — Feasibility Complete:** Required deliverables: data source inventory with access confirmation, ethical risk screening completed, technical approach documented (including model selection rationale), initial ROI baseline established. Approver: PMO Lead plus Data Privacy Officer if the project accesses confidential or regulated data. What blocks advancement: data access not confirmed, ethical risks identified with no documented mitigation plan, missing ROI baseline.

**Gate 3 — Pilot Approved:** Required deliverables: pilot results documented with success metrics assessed against targets, model governance plan complete (including drift monitoring and retraining triggers), data governance sign-off obtained (Tier 1 projects), experiment learning log updated. Approver: Executive Sponsor plus CISO delegate for Tier 1 projects. What blocks advancement: pilot success criteria not met or waived with documented justification, data governance sign-off missing for Tier 1 projects, no rollback plan documented.

**Gate 4 — Production Ready:** Required deliverables: all compliance checks complete, audit trail activated and tested, rollback and incident response plan documented, stakeholder communication plan executed, executive sign-off obtained. Approver: Executive Sponsor plus relevant business unit head. What blocks advancement: any open compliance check items with "No" status that lack a remediation plan, audit logging not operational, missing executive sign-off.

Gates are sequential — a project cannot advance past Gate 3 without Gate 2 approval. Emergency exceptions require written PMO justification and must be reviewed at the next gate.`,
  },
  {
    category: 'governance',
    title: 'Shadow AI Governance',
    source: 'GreenfieldworkAI Spec',
    content: `Shadow AI refers to AI tools and applications adopted by employees or teams without going through the official AI governance process. Discovered shadow AI must be evaluated promptly — ignoring it creates compounding risk.

**Risk Classification Dimensions:** Assess discovered shadow AI across three dimensions. Data exposure risk: Is the tool processing confidential, regulated, or customer data? High exposure risk means the tool may be sending proprietary data to a third-party vendor without a data processing agreement. Vendor security posture: Does the vendor have SOC 2 Type II certification? GDPR compliance? Acceptable use policies that protect organizational data? User scope: Is this a single user's experiment or is the tool being used across a team or department? Broader scope means higher potential impact.

**Adoption Pathway Options:** Based on the risk assessment, the PMO should route each discovery to one of three pathways.

Immediate decommission (high risk): Required when the tool processes regulated or confidential data without a data processing agreement, or when the vendor has unacceptable data retention or sharing practices. The PMO coordinates with IT Security to block access, and the business team is offered an official alternative or a formal evaluation path.

Temporary exemption with mitigation plan (medium risk): Appropriate when the tool provides genuine business value and the risk can be managed through controls — for example, restricting use to non-confidential data, requiring user training, and setting a 90-day window to either formally onboard the tool or transition to an approved alternative.

Adopt and onboard into the official program (low risk, high value): When the tool processes only public or non-sensitive data, has an acceptable vendor posture, and has demonstrated clear productivity value, the team is guided through a fast-track concept brief and light governance review to bring it into the official portfolio.

**Discovery process:** Regular discovery happens through IT procurement monitoring, software usage analysis, and department-level AI audits. Teams should be encouraged to proactively disclose shadow AI without fear of penalty — the goal is governance, not punishment.`,
  },

  // ── COMPLIANCE ────────────────────────────────────────────────────────────
  {
    category: 'compliance',
    title: 'Data Governance Sign-Off Process',
    source: 'GreenfieldworkAI Spec',
    content: `Data governance sign-off is a formal checkpoint confirming that an AI project's data access and handling practices meet organizational policy before the system goes live.

**When it is required:** Data governance sign-off is mandatory for any project that processes personally identifiable information (PII), data classified as confidential or above, data subject to regulatory requirements (HIPAA for health data, GLBA for financial data, CCPA or GDPR for consumer data), or data obtained from third parties under a data sharing agreement. Projects classified as Tier 1 (Must-Have governance profile) always require formal sign-off. Tier 2 projects require sign-off if they access any regulated data category.

**What to document before seeking sign-off:** A data inventory listing every data source, the data classification for each (public, internal, confidential, regulated), the purpose for which each data element is used, how long data is retained by the AI system, who has access (roles, not individuals), and what data processing agreements or consent mechanisms are in place with data owners or subjects. For vendor-provided AI, include the vendor's data processing agreement and confirm it covers your use case.

**Who approves:** The Data Privacy Officer (DPO) or CISO delegate is the primary approver. For projects affecting employee data, HR Legal may also need to co-sign. For customer-facing projects, the Chief Privacy Officer (if distinct from DPO) should be looped in.

**Timing:** Sign-off must be obtained before Gate 3 (Pilot Approved). Do not start a production pilot with real customer or regulated data before sign-off is complete. Starting with synthetic or anonymized data during early pilot phases is encouraged specifically to avoid this bottleneck.

**Common blockers:** Missing data processing agreement with the AI vendor, unresolved questions about cross-border data transfer (particularly EU-US data flows), and failure to document the legal basis for processing personal data under GDPR or CCPA.`,
  },
  {
    category: 'compliance',
    title: 'AI Risk and Ethics Assessment',
    source: 'PMI 2025',
    content: `An AI Risk and Ethics Assessment evaluates whether an AI system may cause unintended harm, reinforce bias, or operate in ways that cannot be explained or audited. It is required before Gate 2 for all projects and must be updated before Gate 3 if the model or data scope has changed significantly.

**What to assess:**

Bias risk: Does the AI use historical data that may encode past discriminatory patterns? Does the model make decisions or recommendations that affect people differently based on age, gender, ethnicity, geography, disability status, or other protected characteristics? Bias assessment requires testing the model on representative datasets stratified by relevant demographic dimensions, not just overall accuracy metrics.

Transparency and explainability: Can the AI's outputs be explained to the users who are affected by them? For high-stakes decisions (loan denials, medical flagging, employee performance ratings), explainability is a legal or regulatory requirement in many jurisdictions. Document what explanation mechanisms are in place and at what granularity.

Autonomy level: Is the AI fully automated (makes decisions without human review), partially automated (recommends decisions that a human approves), or advisory (presents information but humans decide entirely)? Higher autonomy requires more stringent governance, especially for consequential decisions.

Failure modes and consequences: What happens when the AI is wrong? What is the worst-case outcome of a false positive or false negative? Who is harmed and how severely? Document the escalation path when the AI produces a low-confidence or flagged output.

**Common risks and mitigations:** Training data bias — mitigate with diverse datasets and bias testing. Feedback loops — mitigate with monitoring to detect when AI outputs influence future training data. Over-reliance — mitigate with required human-in-the-loop steps for high-stakes outputs. Vendor model changes — mitigate with contractual provisions requiring notification of model updates and re-testing requirements.`,
  },
  {
    category: 'compliance',
    title: 'Audit Trail Best Practices',
    source: 'GreenfieldworkAI Spec',
    content: `An audit trail for an AI system is a tamper-evident log of significant events that demonstrates the system operated as designed and enables post-hoc investigation of decisions or incidents.

**Required events to log:** AI predictions or recommendations generated (with input context, output, confidence score, and timestamp), human overrides of AI recommendations (who overrode, what the AI said, what the human decided instead), configuration changes to the model or its parameters (who changed what, when, and why), data access events (who queried or exported data from the AI system), compliance check completions (date, checker, policy, result), and system errors or anomalies that may affect output quality.

**Retention requirements:** For operational AI systems, retain logs for a minimum of three years. For AI systems involved in financial decisions, retain for seven years to comply with standard financial record-keeping requirements. For AI systems in healthcare, follow HIPAA's six-year minimum. Always match or exceed any applicable regulatory requirement — the above are floors, not ceilings. When in doubt, retain longer.

**SOC 2 implications:** If your organization is SOC 2 certified or working toward certification, your AI systems' audit trails become evidence of control effectiveness. Specifically: audit logs support the Availability and Processing Integrity trust service criteria. Your logs must demonstrate that AI outputs are complete and accurate (or that errors are detected and corrected), that the system was available when needed, and that processing was authorized. Auditors will want to see log completeness, access controls on the logs themselves (who can view, modify, or delete logs?), and evidence of regular log review.

**Format requirements:** Logs must include: timestamp (UTC, millisecond precision), user or system ID initiating the action, action type, relevant data identifiers (project ID, model version), outcome or result, and a hash or signature mechanism to detect tampering. Logs should be write-once — no in-place editing. Store logs separately from the application database in a system where the AI application does not have delete privileges.`,
  },

  // ── MATURITY ──────────────────────────────────────────────────────────────
  {
    category: 'maturity',
    title: 'AI Maturity Level Definitions',
    source: 'GreenfieldworkAI Spec',
    content: `GreenfieldworkAI uses a five-level AI maturity framework to help PMOs understand where their organization stands and what actions will advance them to the next level.

**Level 1 — Aware:** The organization knows AI exists and is relevant but has no structured approach to adopting or governing it. Characteristics: ad hoc experimentation by individuals or small teams, no AI project registry, shadow AI proliferating without oversight, no dedicated AI governance role, AI adoption driven by vendor pitches rather than strategic need. Platform action: start here — create a project registry, assign governance ownership, run your first concept brief.

**Level 2 — Experimenting:** The organization has launched organized AI pilots through at least a minimal governance process. Characteristics: first formal AI projects tracked in a registry, basic governance framework exists even if not consistently enforced, informal ROI tracking, initial risk awareness, at least one executive sponsor engaged. Platform action: enforce stage gates on all new projects, begin capturing ROI baselines, run your first compliance checks.

**Level 3 — Scaling:** Multiple AI systems are in production, governance is actively enforced, and ROI is measured systematically. Characteristics: standardized onboarding process for new AI projects, compliance checks are routine rather than exceptional, PMO actively manages the AI portfolio as a whole (not just individual projects), maturity assessments drive investment decisions. Platform action: optimize stage gate cycle time, track portfolio-level metrics, establish a shadow AI discovery process.

**Level 4 — Optimizing:** AI is deeply integrated into core business operations and the organization is continuously improving its AI practice. Characteristics: model performance monitoring with automated alerts, compliance integrated into development pipelines, sophisticated ROI measurement including strategic option value, regular maturity reviews drive process improvement. Platform action: automate routine governance checks, begin contributing governance patterns back to the PMI community.

**Level 5 — Leading:** AI is a core strategic differentiator and the organization is recognized externally for its AI governance excellence. Characteristics: AI-native processes (AI is the default, not the exception), active external sharing of governance best practices, innovation culture producing AI applications that create new market opportunities, governance that enables rather than impedes AI adoption. Platform action: mentor peer organizations, publish governance frameworks.`,
  },
  {
    category: 'maturity',
    title: 'Moving from Level 1 to Level 2',
    source: 'GreenfieldworkAI Spec',
    content: `The transition from Level 1 (Aware) to Level 2 (Experimenting) is the most important maturity jump because it establishes the foundational habits that all future governance builds on. Most organizations stay at Level 1 longer than necessary due to a few recurring patterns.

**The specific steps to advance:**

First, identify and empower an AI Champion in the PMO — a person with both the authority to enforce governance and the credibility with technical teams to be seen as a helpful collaborator rather than a roadblock. This role does not need to be full-time at Level 2, but it must be a named individual with designated responsibility.

Second, create a project registry. At Level 2, this can be as simple as a shared spreadsheet or a GreenfieldworkAI project list. The discipline of registering AI projects before they start is the single most valuable Level 2 habit — it gives the PMO visibility into what's happening.

Third, define your minimum viable governance process. For Level 2, this means: every new AI project must complete a Concept Brief, receive an initial work classification, and have a named executive sponsor. That's the bar. You don't need all four stage gates enforced on day one.

Fourth, pick two to three AI projects currently underway and walk them through the new process retroactively. This proves the process works and gives the AI Champion practice before rolling it out more broadly.

**Common blockers:**

Fear of slowing down existing informal AI use is the most common objection. Counter it by making the governance process visibly faster than doing nothing — a well-facilitated Concept Brief takes 90 minutes.

Lack of executive sponsorship means governance has no teeth. If the C-suite isn't engaged, start by finding a single senior leader who has an AI project they care about and make that project a governance showcase.

Uncertainty about what governance is actually required leads to over-engineering. At Level 2, the answer is: Concept Brief, classification, sponsor. Everything else can wait until Level 3.`,
  },
  {
    category: 'maturity',
    title: 'Transformer vs Automator',
    source: 'PMI 2025',
    content: `Within any AI portfolio, projects and teams tend to fall into one of two archetypes: Automators and Transformers. Understanding which archetype dominates your portfolio tells you a lot about your organization's maturity ceiling and how to break through it.

**The Automator archetype:** Automators use AI to replicate existing processes faster and cheaper. The goal is efficiency — doing the same thing with less cost or time. Automators are typically risk-averse, prefer well-understood AI applications, and measure ROI almost exclusively in cost savings or headcount reduction. Automator projects cluster in the Productivity and Operational classifications. Governance feels like a burden because speed of deployment is the primary measure of success.

**The Transformer archetype:** Transformers use AI to redesign processes entirely, creating capabilities that didn't exist before. The goal is new value — new products, new markets, new ways of serving customers. Transformers are comfortable with uncertainty, run more experiments that fail, and measure ROI in revenue generated or strategic position gained. Transformer projects include Strategic/Product classification work. Governance is welcomed because it builds the stakeholder trust that enables bolder deployments.

**Why the distinction matters:** An organization dominated by Automator projects will plateau at Level 3 maturity. Automator ROI frameworks are well understood, but they produce diminishing returns as easy efficiency gains are captured. Transformers are what drive Level 4 and 5 maturity because they require — and therefore build — more sophisticated governance, more creative ROI measurement, and deeper organizational AI capability.

**How to move from Automator to Transformer:**

Broaden the ROI framework to require every AI project to document at least one non-cost-savings metric. What becomes possible that wasn't possible before?

Introduce a Transformer track in the governance framework — a lighter governance path for exploratory projects that encourages experimentation without the overhead of full stage gate compliance.

Expose Automator-oriented teams to Strategic/Product classification use cases in peer reviews or lunch-and-learn sessions. Transformer thinking is largely contagious when people see concrete examples.

Require innovation sprints where teams must answer the question: "If we weren't constrained by the existing process, what would we build?" and then assess whether AI makes that answer achievable.`,
  },

  // ── ROI ───────────────────────────────────────────────────────────────────
  {
    category: 'roi',
    title: 'Choosing an ROI Methodology',
    source: 'PMI 2025',
    content: `PMI's AI Adoption Framework defines seven ROI methodologies for AI projects. Choosing the right methodology is as important as the measurement itself — the wrong framework produces numbers that don't resonate with decision-makers.

**Cost-Benefit Analysis (CBA):** Best for projects with clearly quantifiable cost savings — error reduction, processing time reduction, headcount optimization. Produces a net present value of savings vs. implementation costs. Most widely understood by finance teams. Weakness: focuses only on costs, misses value creation.

**Payback Period:** Best for budget justification in capital planning cycles where stakeholders want to know "when do we break even?" Simple to communicate. Weakness: ignores value that accrues after the payback period, penalizes long-duration strategic projects.

**Net Present Value (NPV) / Internal Rate of Return (IRR):** Best for projects requiring multi-year financial modeling — typically Operational or Strategic projects with significant upfront investment. Accounts for the time value of money. Requires reliable multi-year benefit forecasts, which are difficult for AI projects with high uncertainty.

**Productivity Gain:** Best for Productivity-classified AI tools. Measures time saved per user per day × hourly rate × number of users. Straightforward to calculate, easy for HR and finance to validate. Weakness: assumes saved time translates to value, which is only true if the saved time is redirected to productive work.

**Quality Improvement:** Best for projects that reduce defect rates, customer complaints, or rework cycles. Express as: (defect cost × reduction in defect rate) + (rework cost × reduction in rework rate). Particularly powerful for regulated industries where quality failures have compliance consequences.

**Risk Reduction:** Best for compliance, fraud, or security-related AI projects. Quantify the expected cost of the risk event × reduction in probability of occurrence. Requires actuarial or historical data to estimate risk probabilities credibly.

**Strategic Option Value:** Best for exploratory projects where the primary value is the organizational learning and competitive positioning gained, not a directly quantifiable financial return. Documents what new strategic options the project creates — new product lines, new data assets, new capabilities. Requires stakeholder alignment that this is a valid ROI framing before starting.`,
  },
  {
    category: 'roi',
    title: 'Avoiding the Cost-Cutting Trap',
    source: 'PMI 2025',
    content: `The most common ROI mistake in AI adoption is framing every project as a cost-cutting initiative. This approach seems safe — everyone understands cost savings — but it systematically undermines AI adoption in organizations.

**Why cost-only framing stalls adoption:**

When AI is positioned as a cost-cutting tool, it immediately enters competition with the humans whose work it affects. Affected employees become resistors rather than collaborators. Teams that might have been AI champions become adversaries protecting their headcount. This creates organizational friction that slows every subsequent AI project.

Cost-only framing also sets an artificially low ceiling on what AI is allowed to do. Once the obvious efficiency gains are captured, the ROI case for the next project gets harder to make — and the program stalls.

Most importantly, cost savings miss the majority of AI value for most organizations. Speed, quality, capacity, and strategic position are where the transformative value lies, and none of these show up in a cost-reduction model.

**What to measure instead:**

Speed: How much faster are decisions made? Time-to-close for sales cycles, time-to-diagnose for support tickets, time-to-approve for underwriting — these are measurable and often more significant than the cost of the people involved.

Quality: Error rates, customer satisfaction scores (NPS, CSAT), defect rates, rework rates. Quality improvements compound over time in ways that cost savings don't.

Capacity: What can the organization now do that it couldn't do before? How many more customers can be served, how many more experiments can be run, how many more products can be supported with the same headcount?

Strategic position: Is this AI capability a differentiator that competitors can't easily replicate? Does it attract talent or customers who would otherwise go elsewhere?

**Practical fix:** Require every AI project to document at least two non-cost-savings metrics at the time of the ROI baseline. Build this requirement into Gate 2 so it happens before anyone has an incentive to rationalize why only cost metrics matter for this particular project.`,
  },
  {
    category: 'roi',
    title: 'ROI Baseline Setup',
    source: 'PMI 2025',
    content: `An ROI baseline is a pre-implementation measurement of the current state against which AI-driven improvements will be compared. It is the foundation of every credible AI ROI claim, and it is extremely difficult to reconstruct after the fact.

**Why timing matters:** Baselines must be captured before the AI system goes live. Once AI is influencing the process — even in a limited pilot — the "before" state begins to change and cannot be accurately recovered. Organizations that try to reconstruct pre-AI baselines post-implementation consistently produce estimates that are optimistically biased, often by 30-50%. Finance and audit teams increasingly reject reconstructed baselines.

**What to capture:**

Current process time: how long does the process take today, measured in actual time (not estimated time). Use process timing data from systems of record — ticket close times, application processing times, cycle times from your ERP or CRM. If the process isn't currently measured, start measuring it now and wait 4 weeks before deploying AI.

Error or defect rate: how often does the current process produce an incorrect or incomplete output? This requires a defined quality standard and a measurement mechanism. If one doesn't exist, establish it as part of the AI project preparation.

Volume handled per FTE: how many transactions, cases, applications, or units can the current team handle per person per week? This is the capacity baseline.

Customer or employee satisfaction score: if the AI is intended to improve experience, capture a baseline NPS, CSAT, or employee engagement score before deployment.

**Who captures it:** The business owner of the process, validated by a data analyst. Not the AI project team — they have an incentive to set a low baseline to make the improvement look larger.

**Duration:** Minimum 4 weeks of baseline data for stable processes. For seasonal processes (tax processing, open enrollment, annual reporting), capture at least 12 weeks to account for variance. Document the baseline measurement period in the Gate 2 deliverables so it can be audited.`,
  },

  // ── PMI FRAMEWORK ─────────────────────────────────────────────────────────
  {
    category: 'pmi_framework',
    title: 'PMI AI Adoption Lifecycle Phases',
    source: 'PMI 2025',
    content: `The PMI AI Adoption Lifecycle defines five phases that an AI project moves through from initial idea to continuous production operation. GreenfieldworkAI maps its stage gates and governance activities to these phases.

**Phase 1 — Ideation:** The AI opportunity is identified, scoped, and formally registered. Platform activities in this phase: create the AI Concept Brief, assign the work classification (Productivity / Operational / Strategic / Other), name the executive sponsor, set the initial risk level, and assign the project to a PMO portfolio owner. Ideation ends when Gate 1 is approved.

**Phase 2 — Discovery:** The project team validates feasibility — do the data, technology, and organizational conditions exist for this project to succeed? Platform activities: complete the data source inventory with access confirmation, conduct the AI Risk and Ethics Assessment, document the technical approach and model selection rationale, establish the ROI baseline, and perform the initial compliance screening. Discovery ends when Gate 2 is approved.

**Phase 3 — Pilot:** A small-scale, controlled deployment to validate the AI system's performance in real (or realistic) conditions. Platform activities: deploy the pilot, maintain the Experiment Learning Log throughout, collect stakeholder feedback, assess pilot results against Gate 3 success criteria, obtain data governance sign-off for Tier 1 projects. Pilot ends when Gate 3 is approved.

**Phase 4 — Scale:** Full production deployment with all governance controls activated. Platform activities: complete all compliance checks, activate the audit trail, execute the stakeholder communication plan, obtain Gate 4 executive sign-off, begin systematic ROI measurement against baselines. Scale ends when the system is fully deployed and operating within established parameters.

**Phase 5 — Optimize:** Ongoing operation with continuous monitoring and periodic re-assessment. Platform activities: monitor model performance against established thresholds, conduct scheduled compliance reviews, update the maturity assessment, capture insights in the Experiment Learning Log for future projects. Projects in Optimize phase are reviewed annually for re-classification or decommission.`,
  },
  {
    category: 'pmi_framework',
    title: 'AI Concept Brief Requirements',
    source: 'PMI 2025',
    content: `The AI Concept Brief is the mandatory first deliverable for every AI project. It is completed during Phase 1 (Ideation) and reviewed at Gate 1. A brief that is complete and well-considered typically takes 60-90 minutes to write and is the single most time-efficient governance investment a PMO can make.

**The seven required fields and why each matters:**

**1. Problem Statement:** What business problem does this project solve? Written in terms of the business outcome, not the AI technology. "Reduce time to process claims from 5 days to 2 days" is a good problem statement. "Deploy an NLP model" is not. This field matters because it anchors governance decisions — if the project drifts, you return to the problem statement to evaluate whether the drift is acceptable.

**2. AI Classification:** Productivity / Operational / Strategic / Other. This field determines the governance path, required approvals, and ROI methodology. Getting it right at the start avoids expensive re-work later. When in doubt, classify higher.

**3. Data Sources:** What data will the AI use, and is it already accessible? List each data source, its classification (public, internal, confidential, regulated), and the current approval status (approved, pending, not yet requested). This field identifies data access as a risk early, before the team has invested significant effort.

**4. Expected Outcome:** A measurable description of the target state after AI deployment. Must be specific enough to evaluate at Gate 4. "Reduce claims processing time by 60%" is measurable. "Improve efficiency" is not.

**5. Success Metrics:** How will you know if the project worked? List 2-4 metrics with current baseline values (or a plan to establish baselines) and target values. At least one metric must be non-cost-related per the ROI best practice guidelines.

**6. Risk Level:** Initial classification as low, medium, or high, based on data sensitivity, decision autonomy, and stakeholder impact. This is an initial estimate — risk level is formally re-assessed at Gate 2.

**7. Executive Sponsor:** The named individual with budget authority who is accountable for this project's business outcomes. Without a named sponsor, the project cannot be approved at Gate 1. Sponsors are not figureheads — they sign off at Gates 3 and 4.`,
  },
  {
    category: 'pmi_framework',
    title: 'Experiment Learning Log',
    source: 'PMI 2025',
    content: `The Experiment Learning Log is a structured record of what the team learned during the pilot phase. It is a living document updated throughout Phase 3 (Pilot) and reviewed at Gate 3. Its purpose is to make the knowledge gained from each experiment available to future projects across the portfolio.

**When to create entries:** After each pilot sprint or significant milestone (typically every 2 weeks during piloting). After any significant failure, unexpected behavior, or pivot in approach. Immediately before presenting pilot results to the Gate 3 review. When a project is decommissioned — capturing end-of-project learnings before the team disperses.

**What to capture for failed experiments:**

The hypothesis that was tested — what did you believe would happen and why? This requires writing down the hypothesis before the experiment, not after. The failure mode — what actually happened? Be specific: did the model underperform on accuracy, did the data quality not support the use case, did users refuse to adopt the output, did the latency make the tool unusable? Data collected — what metrics were gathered, even if the outcome was negative? Negative results with good data are valuable. Key learnings — what does the team now know that it didn't know before? This is the most important field. Next steps — is this a dead end, a pivot, or a "not yet" (return when conditions change)?

**What to capture for successful experiments:**

Which variables drove success — and which ones you thought would matter but didn't. What surprised the team — the unexpected positive findings are often the most valuable learnings. Conditions required to replicate success — what organizational, data, or technical conditions need to be present for this to work in another context? Recommended scale plan — specific, concrete recommendations for how to move from pilot to production, including what would need to change at 10x the current volume.

**Format and storage:** Entries are dated and include the author's name, are linked to the project ID in GreenfieldworkAI, and are tagged with the primary hypothesis tested. The log is stored in GreenfieldworkAI's project record and is visible to PMO leadership to enable cross-project learning.`,
  },

  // ── GENERAL ───────────────────────────────────────────────────────────────
  {
    category: 'general',
    title: 'Getting Started Checklist for New AI Projects',
    source: 'GreenfieldworkAI Spec',
    content: `This checklist covers the essential steps for launching a new AI project through GreenfieldworkAI. Complete steps in order — earlier steps unblock later ones. Items marked [GATE 1] are required before the first gate review.

**1. Document the business problem [GATE 1]:** Write the problem statement in terms of the business outcome, not the AI technology. Have the executive sponsor review and agree before proceeding.

**2. Classify the project [GATE 1]:** Assign the work classification: Productivity, Operational, Strategic/Product, or Other. When uncertain, classify higher — you can reclassify downward at Gate 2 with justification.

**3. Identify the executive sponsor [GATE 1]:** Name a specific individual (not a team, not a role) who has budget authority and will sign off at Gates 3 and 4. Confirm they accept the responsibility before listing them.

**4. Complete the AI Concept Brief [GATE 1]:** Fill in all seven required fields. Brief should take 60-90 minutes with the right stakeholders in the room.

**5. Assign the initial risk level [GATE 1]:** Low, medium, or high. Base this on data sensitivity, decision autonomy, and potential stakeholder impact. This is a first estimate — it is formally reviewed at Gate 2.

**6. Determine the governance profile [GATE 1]:** Must-Have (Tier 1), Should-Have (Tier 2), or Not Needed (Tier 3). This follows from the risk level and data classification.

**7. Schedule the Gate 1 review:** Book time with the PMO Lead within two weeks of brief completion. Gate 1 reviews typically take 30 minutes.

**8. Inventory data sources:** List every data source the AI will use. For each, confirm: data classification, current access permissions, data owner, and whether a data processing agreement is needed. Flag any source that is confidential or regulated — this triggers the data governance sign-off requirement.

**9. Identify affected stakeholders:** Who will use the AI system? Who will be affected by its decisions? Who needs to be informed before deployment? Build this list now — late stakeholder discovery is a top cause of project delays.

**10. Assign the project to a PMO portfolio work stream:** Register the project in GreenfieldworkAI, assign it to the appropriate portfolio category, and set the target gate dates. This gives the PMO visibility and enables portfolio-level resource planning.`,
  },
  {
    category: 'general',
    title: 'Common AI Project Failure Modes',
    source: 'GreenfieldworkAI Spec',
    content: `Understanding the most common AI project failure modes enables teams to recognize warning signs early and course-correct before significant investment is lost.

**Missing data access:** The project receives governance approval and begins development, then discovers it cannot access the data it needs — either because access was assumed but never formally granted, the data doesn't exist in the format needed, or the data is owned by a team that won't share it. Prevention: validate data access at Gate 2, not Gate 1. Gate 2 sign-off on data access is the single most important feasibility check.

**Pilot-to-production gap:** The pilot succeeds in a controlled, curated environment, but the system fails when deployed at production scale or with real-world data variability. Prevention: design pilots to deliberately include edge cases, messy data, and stress conditions. If the pilot can only succeed with clean data, the production system will fail. Document the pilot conditions explicitly in the Experiment Learning Log so Gate 3 reviewers can assess whether they reflect production reality.

**Orphaned projects:** The AI system champion or project owner leaves the organization, and no one inherits the responsibility for governance, model updates, or stakeholder management. The system continues running but begins to drift without oversight. Prevention: require a named successor or team responsibility (not a single individual) as a Gate 3 deliverable for any project moving to production. Include model ownership in the project's governance documentation.

**ROI not measured:** The project delivers a production system but no one captured a baseline before deployment, so no credible ROI case can be made. Budget for the next AI project is harder to secure because the value of the first one was never demonstrated. Prevention: ROI baseline is a Gate 2 hard requirement — Gate 3 cannot be approved without documented baselines.

**Ungoverned expansion:** A Productivity-classified project (approved as a personal writing assistant for one team) quietly expands to process customer data or is adopted across departments without re-classification or additional governance. Prevention: any change in data access scope, decision autonomy, or user population triggers a mandatory governance review and potential re-classification.

**Stakeholder resistance:** The AI system is technically successful but users refuse to adopt it — because they weren't involved in its design, don't trust its outputs, fear it threatens their roles, or simply find it harder to use than the old process. Prevention: include affected end users in the pilot design phase (not just the results review), address concerns explicitly in the stakeholder communication plan, and measure adoption as a success metric alongside technical performance.`,
  },
];

async function seed() {
  console.log(`Seeding ${entries.length} knowledge base entries...`);

  // Clear existing entries to allow idempotent re-runs
  const { error: deleteError } = await supabase.from('knowledge_base').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.warn('Warning: could not clear existing entries:', deleteError.message);
  }

  const { data, error } = await supabase.from('knowledge_base').insert(entries).select('id, title');
  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data?.length ?? 0} entries:`);
  data?.forEach(row => console.log(`  • ${row.title}`));
}

seed();
