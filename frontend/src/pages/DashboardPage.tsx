import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';

export default function DashboardPage({ user }: { user: any }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">PMO AI Platform</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition duration-200 transform hover:scale-105"
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full px-6 sm:px-8 lg:px-12 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.email?.split('@')[0]}! 👋</h2>
          <p className="text-gray-600">Your AI governance and compliance dashboard</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* AI Initiatives Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">AI Initiatives</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-4xl font-bold text-blue-600">0</p>
            <p className="text-xs text-gray-500 mt-2">Active projects</p>
          </div>

          {/* Compliance Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Compliance Rate</h3>
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-4xl font-bold text-green-600">0%</p>
            <p className="text-xs text-gray-500 mt-2">Policy adherence</p>
          </div>

          {/* In Review Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">In Review</h3>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-4xl font-bold text-orange-600">0</p>
            <p className="text-xs text-gray-500 mt-2">Pending approval</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to PMO AI Platform</h2>
              <p className="text-gray-600 mb-6">
                Your AI-powered governance and compliance platform is ready to help manage your organizational AI adoption at scale.
              </p>

              {/* Status Checks */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-lg">✓</span>
                  <div>
                    <p className="font-medium text-gray-900">Authentication Working</p>
                    <p className="text-sm text-gray-600">Secure login with email verification</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-lg">✓</span>
                  <div>
                    <p className="font-medium text-gray-900">Database Connected</p>
                    <p className="text-sm text-gray-600">PostgreSQL with Supabase</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-lg">→</span>
                  <div>
                    <p className="font-medium text-gray-900">Projects Feature</p>
                    <p className="text-sm text-gray-600">Coming next week - Create and track AI initiatives</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 rounded-lg hover:shadow-lg transition-shadow">
                Get Started with Your First Project
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h3>
              <nav className="space-y-3">
                <a href="#" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <span>📋</span>
                  <span className="text-sm font-medium">Projects</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <span>🛡️</span>
                  <span className="text-sm font-medium">Compliance</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <span>📊</span>
                  <span className="text-sm font-medium">Analytics</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <span>🤖</span>
                  <span className="text-sm font-medium">AI Assistant</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <span>⚙️</span>
                  <span className="text-sm font-medium">Settings</span>
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Features Coming Soon */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Roadmap - Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Management */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-bold text-gray-900 mb-2">Project Management</h4>
              <p className="text-sm text-gray-600 mb-4">Create and track AI initiatives across your organization with portfolio views.</p>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">Week 2</span>
            </div>

            {/* Compliance Framework */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">🛡️</div>
              <h4 className="font-bold text-gray-900 mb-2">Compliance Framework</h4>
              <p className="text-sm text-gray-600 mb-4">Ensure governance and regulatory compliance with automated policy checks.</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Week 3</span>
            </div>

            {/* AI Assistant */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">🤖</div>
              <h4 className="font-bold text-gray-900 mb-2">AI Assistant</h4>
              <p className="text-sm text-gray-600 mb-4">Ask Claude for guidance on AI governance and best practices in real-time.</p>
              <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">Week 4</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12 py-8">
          <p className="text-center text-sm text-gray-600">
            PMO AI Adoption Platform • Version 1.0 • <time dateTime="2026-04-28">April 2026</time>
          </p>
        </div>
      </footer>
    </div>
  );
}
