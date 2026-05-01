import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email: string;
}

const STATUS_OPTIONS = ['active', 'planning', 'on-hold', 'completed'];

const statusColor: Record<string, string> = {
  active:    'bg-green-100 text-green-800',
  planning:  'bg-blue-100 text-blue-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
};

export default function ProjectDetailPage({ user }: { user: User }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState('planning');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete state
  const [showDelete, setShowDelete] = useState(false);

  // ── Fetch project ───────────────────────────────────────────
  const fetchProject = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      setError('Project not found or you do not have access.');
    } else {
      setProject(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProject(); }, [id]);

  // ── Open edit modal ─────────────────────────────────────────
  const openEdit = () => {
    if (!project) return;
    setFormName(project.name);
    setFormDesc(project.description || '');
    setFormStatus(project.status);
    setFormError('');
    setShowEdit(true);
  };

  // ── Save edit ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!formName.trim()) { setFormError('Project name is required.'); return; }
    setSaving(true);
    setFormError('');

    const { error } = await supabase
      .from('projects')
      .update({
        name: formName.trim(),
        description: formDesc.trim(),
        status: formStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      setFormError('Failed to update project. Try again.');
    } else {
      setShowEdit(false);
      fetchProject();
    }
    setSaving(false);
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) navigate('/projects');
  };

  // ── Logout ──────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/projects')} className="text-gray-500 hover:text-gray-800 text-sm">
                ← Projects
              </button>
              <span className="text-gray-300">|</span>
              <span className="font-bold text-indigo-700 text-lg">📄 Project Detail</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
              <button onClick={handleLogout} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="w-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* LOADING */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-400 text-lg">Loading project...</div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4">
              {error}
              <button onClick={() => navigate('/projects')} className="ml-4 text-sm underline">
                Back to Projects
              </button>
            </div>
          )}

          {/* PROJECT DETAIL */}
          {!loading && !error && project && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${statusColor[project.status] || 'bg-gray-100 text-gray-600'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={openEdit}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setShowDelete(true)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {project.description || <span className="text-gray-400 italic">No description provided.</span>}
                </p>
              </div>

              {/* METADATA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Created</h3>
                  <p className="text-gray-700 text-sm">
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Last Updated</h3>
                  <p className="text-gray-700 text-sm">
                    {new Date(project.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Project ID</h3>
                  <p className="text-gray-400 text-xs font-mono">{project.id}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</h3>
                  <p className="text-gray-700 text-sm capitalize">{project.status}</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✏️ Edit Project</h2>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowEdit(false)} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition-colors">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Project?</h2>
            <p className="text-gray-500 text-sm mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
