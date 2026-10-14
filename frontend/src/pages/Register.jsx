import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { UserPlus, User, Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto format username to lowercase alphanumeric without spaces
    const cleanValue = name === 'username' ? value.toLowerCase().replace(/[^a-z0-9_-]/g, '') : value;
    
    setFormData({ ...formData, [name]: cleanValue });
    if (errorMessage) setErrorMessage('');
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    // Basic frontend checks
    if (formData.username.length < 3) {
      setFieldErrors({ username: 'Username must be at least 3 characters' });
      return;
    }
    if (formData.password.length < 6) {
      setFieldErrors({ password: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      const authData = response.data;
      
      login(authData.token, {
        id: authData.id,
        username: authData.username,
        email: authData.email,
        displayName: authData.displayName,
        bio: authData.bio,
        profileImageUrl: authData.profileImageUrl,
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.data?.errors) {
        setFieldErrors(err.data.errors);
      } else {
        setErrorMessage(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-decoration-none group mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
              I
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Inkora<span className="text-blue-600">.</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Join the Publishing Platform
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Create an author account to publish blogs in 4 custom themes and connect with readers.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-card">
          
          {/* General Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full / Display Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  placeholder="Eleanor Vance"
                  className={`block w-full px-3.5 py-2.5 bg-slate-50 border ${
                    fieldErrors.displayName ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white text-sm transition`}
                />
              </div>
              {fieldErrors.displayName && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.displayName}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  @
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="eleanorvance"
                  className={`block w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border ${
                    fieldErrors.username ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white text-sm transition`}
                />
              </div>
              {fieldErrors.username && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="eleanor@inkora.io"
                  className={`block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border ${
                    fieldErrors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white text-sm transition`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="At least 6 characters"
                  className={`block w-full pl-10 pr-10 py-2.5 bg-slate-50 border ${
                    fieldErrors.password ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white text-sm transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-bold bg-slate-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
