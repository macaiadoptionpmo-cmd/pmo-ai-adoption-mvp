import { useState } from 'react';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <span className="font-semibold text-gray-900">GreenfieldworkAI</span>
          </div>
          
            href="#signup"
            className="px-6 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition"
          >
            Early Access
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-full bg-teal-50 border border-teal-200">
                <span className="text-sm font-medium text-teal-700">
                  52% of employees use AI unsanctioned
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Governance debt is
                <span className="text-teal-600"> invisible</span> — until it's not
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your employees are using AI tools your organization doesn't know about. It creates compliance risk, governance debt, and security exposure.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              GreenfieldworkAI automates unsanctioned AI visibility — so you can govern at scale without killing speed.
            </p>
            <div className="pt-4">
              
                href="#signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-teal-600 text-white font-semibold text-lg hover:bg-teal-700 transition transform hover:scale-105"
              >
                Get Early Access →
              </a>
            </div>
          </div>

          {/* Visual Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100">
              <p className="text-4xl font-bold text-teal-700">52%</p>
              <p className="text-sm text-gray-600 mt-2">of employees use unsanctioned AI</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <p className="text-4xl font-bold text-blue-700">$847B</p>
              <p className="text-sm text-gray-600 mt-2">estimated governance debt</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 col-span-2">
              <p className="text-2xl font-bold text-amber-700">No PMO can govern what they can't see</p>
              <p className="text-sm text-gray-600 mt-2">That changes July 1, 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">The Problem PMOs Face</h2>
            <p className="text-lg text-gray-600">
              Unsanctioned AI creates three interconnected risks your organization can't ignore
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                title: 'Compliance Risk',
                desc: 'Unsanctioned tools access sensitive data without governance controls. Audit trails disappear. Liability multiplies.',
              },
              {
                num: '2',
                title: 'Governance Debt',
                desc: 'Ungoverned AI accumulates like technical debt. Cost compounds. Retrofitting is exponentially harder than proactive governance.',
              },
              {
                num: '3',
                title: 'Security Exposure',
                desc: 'Employees bypass vendor approval. Data flows to unknown providers. Your risk profile becomes invisible to CISO.',
              },
            ].map((item) => (
              <div key={item.num} className="p-8 rounded-2xl bg-white border border-gray-200 space-y-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-teal-600">{item.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">The Solution: PMO-Native AI Governance</h2>
            <p className="text-lg text-gray-600">
              Automated visibility + scoring + control — without slowing down innovation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'Governance Debt Scoring',
                desc: 'Automatically score unsanctioned AI adoption. Identify highest-risk tools and patterns.',
              },
              {
                icon: '👁️',
                title: 'Visibility Without Friction',
                desc: 'See what AI your org uses. No agent install. No employee friction. Governance that scales.',
              },
              {
                icon: '⚙️',
                title: 'PMI Framework Native',
                desc: 'Built on PMI standards. Speaks the language PMOs understand. Integrates with existing governance.',
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border border-gray-200 bg-white hover:border-teal-300 hover:shadow-lg transition space-y-4">
                <p className="text-4xl">{feature.icon}</p>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section
        id="signup"
        className="py-20 px-6 bg-gradient-to-br from-teal-600 to-cyan-600 text-white"
      >
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">Ready for governance without friction?</h2>
            <p className="text-xl text-teal-50 leading-relaxed">
              Join 20+ PMO leaders testing GreenfieldworkAI before launch on July 1, 2026
            </p>
          </div>

          {/* ConvertKit Form Embed */}
          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <form
              action="https://app.convertkit.com/forms/YOUR_FORM_ID/subscriptions"
              method="post"
              className="space-y-4"
            >
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="Your work email"
                  type="email"
                  name="email_address"
                  required
                />
              </div>
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="Your name"
                  type="text"
                  name="fields[name]"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
              >
                Get Early Access
              </button>
              <p className="text-xs text-gray-500">
                We'll email you 48 hours before launch. No spam, ever.
              </p>
            </form>
          </div>

          <p className="text-teal-100 text-sm">
            Join the beta. Shape the future of AI governance.
          </p>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Why GreenfieldworkAI?</h2>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              I spent 8 years in enterprise PMO leadership. I watched AI adoption explode in 2024.
              What surprised me wasn't the speed — it was the invisibility.
            </p>
            <p>
              Your PMO knows you have technical debt. But governance debt? That's invisible until it's a crisis.
              An unvetted data tool here, an unsanctioned AI agent there. One thousand papercuts that cost millions to govern.
            </p>
            <p>
              I built GreenfieldworkAI because PMOs shouldn't have to choose between innovation and governance.
              You deserve visibility + control that doesn't slow people down.
            </p>
            <p className="text-teal-600 font-semibold">
              Building in public. Launching July 1, 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <p>GreenfieldworkAI © 2026 • AI Governance Reimagined</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition">
              Twitter
            </a>
            <a href="#" className="hover:text-gray-900 transition">
              LinkedIn
            </a>
            <a href="#" className="hover:text-gray-900 transition">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
