import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
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

export default function ProjectsPage({ user }: { user: User }) {
  const navigate = useNavigate();

  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState('planning');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // ── Fetch projects ──────────────────────────────────────────
  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError('Failed to load projects. Please try again.');
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  // ── Open modal helpers ──────────────────────────────────────
  const openCreate = () => {
    setEditingProject(null);
    setFormName('');
    setFormDesc('');
    setFormStatus('planning');
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setFormName(project.name);
    setFormDesc(project.description || '');
    setFormStatus(project.status);
    setFormError('');
    setShowModal(true);
  };

  // ── Save (create or update) ─────────────────────────────────
  const handleSave = async () => {
    if (!formName.trim()) {
      setFormError('Project name is required.');
      return;
    }
    setSaving(true);
    setFormError('');

    if (editingProject) {
      // UPDATE
      const { error } = await supabase
        .from('projects')
        .update({ name: formName.trim(), description: formDesc.trim(), status: formStatus, updated_at: new Date().toISOString() })
        .eq('id', editingProject.id);

      if (error) {
        setFormError('Failed to update project. Try again.');
      } else {
        setShowModal(false);
        fetchProjects();
      }
    } else {
      // CREATE
      const { error } = await supabase
        .from('projects')
        .insert([{ user_id: user.id, name: formName.trim(), description: formDesc.trim(), status: formStatus }]);

      if (error) {
        setFormError(error.message.includes('unique') ? 'A project with that name already exists.' : 'Failed to create project. Try again.');
      } else {
        setShowModal(false);
        fetchProjects();
      }
    }
    setSaving(false);
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setDeleteConfirm(null);
      fetchProjects();
    }
  };

  // ── Logout ──────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ── Filtered list ───────────────────────────────────────────
  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-800 text-sm">
                ← Dashboard
              </button>
              <span className="text-gray-300">|</span>
              <span className="font-bold text-indigo-700 text-lg">🗂 Projects</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* HEADER ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Projects</h1>
              <p className="text-gray-500 mt-1">Manage and track all your AI initiatives</p>
            </div>
            <button
              onClick={openCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition-colors"
            >
              + New Project
            </button>
          </div>

          {/* SEARCH & FILTER */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* STATES */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-400 text-lg">Loading projects...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 mb-6">
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
              </h3>
              <p className="text-gray-400 mb-6">
                {projects.length === 0 ? 'Create your first AI project to get started.' : 'Try adjusting your search or filter.'}
              </p>
              {projects.length === 0 && (
                <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  + Create First Project
                </button>
              )}
            </div>
          )}

          {/* PROJECT GRID */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(project => (
                <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                   <h3
  onClick={() => navigate(`/projects/${project.id}`)}
  className="font-semibold text-gray-900 text-lg leading-tight cursor-pointer hover:text-indigo-600 transition-colors"
>
  {project.name}
</h3>
 <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor[project.status] || 'bg-gray-100 text-gray-600'}`}>
                      {project.status}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                  )}
                  <div className="text-xs text-gray-400">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                    <button
                      onClick={() => openEdit(project)}
                      className="flex-1 text-sm text-indigo-600 hover:bg-indigo-50 font-medium py-2 rounded-lg transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(project.id)}
                      className="flex-1 text-sm text-red-500 hover:bg-red-50 font-medium py-2 rounded-lg transition-colors"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROJECT COUNT */}
          {!loading && projects.length > 0 && (
            <p className="text-sm text-gray-400 mt-6 text-center">
              Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProject ? '✏️ Edit Project' : '➕ New Project'}
            </h2>

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
                  placeholder="e.g. Customer Churn Prediction"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="What does this AI project do?"
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
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {saving ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Project?</h2>
            <p className="text-gray-500 text-sm mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
