export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">G</div>
            <span className="font-semibold">GreenfieldworkAI</span>
          </div>
          <a href="#signup" className="px-6 py-2 rounded-lg bg-teal-600 text-white text-sm hover:bg-teal-700">Early Access</a>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-teal-50 border border-teal-200">
              <span className="text-sm font-medium text-teal-700">52% of employees use AI unsanctioned</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold">Governance debt is <span className="text-teal-600">invisible</span> — until it's not</h1>
            <p className="text-xl text-gray-600">Your employees are using AI tools your organization doesn't know about. It creates compliance risk, governance debt, and security exposure.</p>
            <p className="text-xl text-gray-600">GreenfieldworkAI automates unsanctioned AI visibility — so you can govern at scale without killing speed.</p>
            <a href="#signup" className="inline-block px-8 py-4 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700">Get Early Access →</a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 rounded-2xl bg-teal-50 border border-teal-100">
              <p className="text-4xl font-bold text-teal-700">52%</p>
              <p className="text-sm text-gray-600 mt-2">of employees use unsanctioned AI</p>
            </div>
            <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-4xl font-bold text-blue-700">$847B</p>
              <p className="text-sm text-gray-600 mt-2">estimated governance debt</p>
            </div>
            <div className="p-8 rounded-2xl bg-amber-50 border border-amber-100 col-span-2">
              <p className="text-2xl font-bold text-amber-700">No PMO can govern what they can't see</p>
              <p className="text-sm text-gray-600 mt-2">That changes July 1, 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-center">The Problem PMOs Face</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-2xl font-bold text-teal-600">1</div>
              <h3 className="text-xl font-semibold mt-4">Compliance Risk</h3>
              <p className="text-gray-600 mt-2">Unsanctioned tools access sensitive data without governance controls. Audit trails disappear. Liability multiplies.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-2xl font-bold text-teal-600">2</div>
              <h3 className="text-xl font-semibold mt-4">Governance Debt</h3>
              <p className="text-gray-600 mt-2">Ungoverned AI accumulates like technical debt. Cost compounds. Retrofitting is exponentially harder than proactive governance.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-2xl font-bold text-teal-600">3</div>
              <h3 className="text-xl font-semibold mt-4">Security Exposure</h3>
              <p className="text-gray-600 mt-2">Employees bypass vendor approval. Data flows to unknown providers. Your risk profile becomes invisible to CISO.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">The Solution: PMO-Native AI Governance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-gray-200 bg-white hover:border-teal-300">
            <p className="text-4xl mb-4">📊</p>
            <h3 className="text-xl font-semibold">Governance Debt Scoring</h3>
            <p className="text-gray-600 mt-2">Automatically score unsanctioned AI adoption. Identify highest-risk tools and patterns.</p>
          </div>
          <div className="p-8 rounded-2xl border border-gray-200 bg-white hover:border-teal-300">
            <p className="text-4xl mb-4">👁️</p>
            <h3 className="text-xl font-semibold">Visibility Without Friction</h3>
            <p className="text-gray-600 mt-2">See what AI your org uses. No agent install. No employee friction. Governance that scales.</p>
          </div>
          <div className="p-8 rounded-2xl border border-gray-200 bg-white hover:border-teal-300">
            <p className="text-4xl mb-4">⚙️</p>
            <h3 className="text-xl font-semibold">PMI Framework Native</h3>
            <p className="text-gray-600 mt-2">Built on PMI standards. Speaks the language PMOs understand. Integrates with existing governance.</p>
          </div>
        </div>
      </section>

      <section id="signup" className="py-20 px-6 bg-gradient-to-br from-teal-600 to-cyan-600 text-white">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold">Ready for governance without friction?</h2>
          <p className="text-xl text-teal-50">Join 20+ PMO leaders testing GreenfieldworkAI before launch on July 1, 2026</p>
          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <form action="https://app.convertkit.com/forms/9403249/subscriptions" method="post" className="space-y-4">
              <input className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="Your work email" type="email" name="email_address" required />
              <input className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="Your name" type="text" name="fields[name]" />
              <button type="submit" className="w-full px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700">Get Early Access</button>
              <p className="text-xs text-gray-500">We'll email you 48 hours before launch. No spam, ever.</p>
            </form>
          </div>
          <p className="text-teal-100 text-sm">Join the beta. Shape the future of AI governance.</p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8">Why GreenfieldworkAI?</h2>
        <div className="text-gray-700 space-y-6">
          <p>I spent 8 years in enterprise PMO leadership. I watched AI adoption explode in 2024. What surprised me wasn't the speed — it was the invisibility.</p>
          <p>Your PMO knows you have technical debt. But governance debt? That's invisible until it's a crisis. An unvetted data tool here, an unsanctioned AI agent there. One thousand papercuts that cost millions to govern.</p>
          <p>I built GreenfieldworkAI because PMOs shouldn't have to choose between innovation and governance. You deserve visibility + control that doesn't slow people down.</p>
          <p className="text-teal-600 font-semibold">Building in public. Launching July 1, 2026.</p>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <p>GreenfieldworkAI © 2026 • AI Governance Reimagined</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">Twitter</a>
            <a href="#" className="hover:text-gray-900">LinkedIn</a>
            <a href="#" className="hover:text-gray-900">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
