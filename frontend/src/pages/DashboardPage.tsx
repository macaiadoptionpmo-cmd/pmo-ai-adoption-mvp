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
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">PMO AI Platform</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition duration-200"
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to PMO AI</h2>
            <p className="text-gray-600 mb-4">
              Your AI-powered governance and compliance platform is ready to help manage your organizational AI adoption.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-green-600">
                <span className="text-2xl mr-3">✓</span>
                <span>Authentication working</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="text-2xl mr-3">✓</span>
                <span>Database connected</span>
              </div>
              <div className="flex items-center text-blue-600">
                <span className="text-2xl mr-3">→</span>
                <span>Projects feature coming Week 2</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">AI Initiatives</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-600">Compliant</p>
                <p className="text-3xl font-bold text-gray-900">0%</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-sm text-gray-600">In Review</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Coming Soon */}
        <div className="mt-8 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Project Management</h3>
              <p className="text-sm text-gray-600">Create and track AI initiatives across your organization</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🛡️ Compliance Framework</h3>
              <p className="text-sm text-gray-600">Ensure governance and regulatory compliance</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🤖 AI Assistant</h3>
              <p className="text-sm text-gray-600">Ask questions about AI governance and best practices</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
