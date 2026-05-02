import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';

interface User {
  id: string;
  email: string;
}

interface Stats {
  total: number;
  active: number;
  planning: number;
  completed: number;
  highRisk: number;
}

export default function DashboardPage({ user }: { user: User }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, planning: 0, completed: 0, highRisk: 0 });
  const [loading, setLoading] = useState(true);
  const [adherenceRate, setAdherenceRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('status, risk_level')
        .eq('user_id', user.id);

      if (!error && data) {
        setStats({
          total:     data.length,
          active:    data.filter(p => p.status === 'active').length,
          planning:  data.filter(p => p.status === 'planning').length,
          completed: data.filter(p => p.status === 'completed').length,
          highRisk:  data.filter(p => p.risk_level === 'high').length,
        });
      }

      const { data: auditData } = await supabase
        .from('audit_log')
        .select('result')
        .eq('user_id', user.id);

      if (auditData && auditData.length > 0) {
        const compliantCount = auditData.filter(r => r.result === 'compliant').length;
        setAdherenceRate(Math.round((compliantCount / auditData.length) * 100));
      }

      setLoading(false);
    };

    fetchStats();
  }, [user.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const statCards: { label: string; value: number | string; icon: string; color: string; textColor: string; onClick?: () => void }[] = [
    {
      label: 'Total Projects',
      value: stats.total,
      icon: '📋',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-700',
    },
    {
      label: 'Active Projects',
      value: stats.active,
      icon: '🚀',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
    },
    {
      label: 'In Planning',
      value: stats.planning,
      icon: '📐',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: '✅',
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-700',
    },
    {
      label: 'High Risk',
      value: stats.highRisk,
      icon: '🔴',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
    },
    {
      label: 'Compliance Rate',
      value: adherenceRate !== null ? `${adherenceRate}%` : '—',
      icon: '✓',
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-700',
      onClick: () => navigate('/compliance'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="font-bold text-indigo-700 text-lg">🤖 PMO AI Platform</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* WELCOME */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back! 👋
            </h1>
            <p className="text-gray-500 mt-2">
              Here's your AI adoption overview for today.
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {statCards.map((card) => (
              <div
                key={card.label}
                onClick={card.onClick}
                className={`rounded-2xl border p-6 ${card.color} flex flex-col gap-2 ${card.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
              >
                <div className="text-2xl">{card.icon}</div>
                <div className={`text-3xl font-bold ${card.textColor}`}>
                  {loading ? (
                    <span className="inline-block w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </div>
                <div className="text-sm font-medium text-gray-600">{card.label}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">🗂 Manage Projects</h2>
              <p className="text-gray-500 text-sm mb-4">
                View, create, edit and track all your AI initiatives in one place.
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Go to Projects →
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">📊 Compliance & Governance</h2>
              <p className="text-gray-500 text-sm mb-4">
                Monitor policy adherence, risk scores, and audit trails.
              </p>
              <button
                onClick={() => navigate('/compliance')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Go to Compliance →
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">🤖 AI Assistant</h2>
              <p className="text-gray-500 text-sm mb-4">
                Get real-time guidance on your AI projects and best practices.
              </p>
              <button
                disabled
                className="bg-gray-100 text-gray-400 font-semibold px-5 py-2.5 rounded-xl text-sm cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">📈 Analytics & ROI</h2>
              <p className="text-gray-500 text-sm mb-4">
                Track business impact, cost savings, and adoption metrics.
              </p>
              <button
                disabled
                className="bg-gray-100 text-gray-400 font-semibold px-5 py-2.5 rounded-xl text-sm cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* GETTING STARTED — only show if no projects yet */}
          {!loading && stats.total === 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-indigo-900 mb-2">🚀 Get Started</h2>
              <p className="text-indigo-700 text-sm mb-4">
                You haven't created any AI projects yet. Start by adding your first one!
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                + Create First Project
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
