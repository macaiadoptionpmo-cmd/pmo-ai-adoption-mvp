import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';

interface User {
  email?: string;
}

export default function DashboardPage({ user }: { user: User }) {
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
      {/* Navigation - Full width background, centered content */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Main Content - Centered */}
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.email?.split('@')[0]}! 🚀
            </h2>
            <p className="text-gray-600">Your AI governance and compliance dashboard</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Active Projects Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>

            {/* Compliance Score Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Compliance Score</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>

            {/* Team Members Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Team Members</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Getting Started</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Create Your First Project</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Start by creating an AI project to track your governance initiatives.
                  </p>
                  <a href="/projects" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                    Go to Projects →
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Set Compliance Policies</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Define governance policies and compliance rules for your organization.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Monitor & Measure Impact</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Track adoption metrics and measure the impact of your AI initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
