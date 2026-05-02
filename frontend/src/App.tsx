import ProjectDetailPage from './pages/ProjectDetailPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './api/supabaseClient';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import CompliancePage from './pages/CompliancePage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
              <DashboardPage user={user} />
            </ProtectedRoute>
          }
        />
<Route
    path="/projects"
    element={
      <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
        <ProjectsPage user={user} />
      </ProtectedRoute>
    }
  />
    <Route
          path="/projects/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
              <ProjectDetailPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compliance"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
              <CompliancePage user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}
