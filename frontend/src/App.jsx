import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/EditorPage';
import BlogDetail from './pages/BlogDetail';
import AuthorProfile from './pages/AuthorProfile';
import Bookmarks from './pages/Bookmarks';
import NotFound from './pages/NotFound';
import api from './services/api';

function BackendStatusBanner() {
  const [status, setStatus] = useState({ checking: true, connected: false });

  useEffect(() => {
    api.get('/health')
      .then((res) => {
        if (res.data?.status === 'UP') {
          setStatus({ checking: false, connected: true });
        }
      })
      .catch(() => {
        setStatus({ checking: false, connected: false });
      });
  }, []);

  if (status.checking) return null;

  return (
    <div className={`text-xs py-1.5 px-4 text-center font-medium ${
      status.connected 
        ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-200' 
        : 'bg-amber-50 text-amber-800 border-b border-amber-200'
    }`}>
      {status.connected ? (
        <span>Inkora Backend API Connected (Spring Boot 3 + MySQL)</span>
      ) : (
        <span>Backend API offline. Starting backend on port 8080...</span>
      )}
    </div>
  );
}

function PublicAuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="flex flex-col min-h-screen">
          <BackendStatusBanner />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/@:username" element={<AuthorProfile />} />
              <Route path="/author/:username" element={<AuthorProfile />} />
              
              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicAuthRoute>
                    <Login />
                  </PublicAuthRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicAuthRoute>
                    <Register />
                  </PublicAuthRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/editor" 
                element={
                  <ProtectedRoute>
                    <EditorPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/editor/:id" 
                element={
                  <ProtectedRoute>
                    <EditorPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/bookmarks" 
                element={
                  <ProtectedRoute>
                    <Bookmarks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bookmarks" 
                element={
                  <ProtectedRoute>
                    <Bookmarks />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
