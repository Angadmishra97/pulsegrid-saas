import React, { useState } from 'react';
import API from '../services/api';
import { LayoutDashboard } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    slug: '',
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await API.post('/auth/register', formData);
        setIsRegister(false);
        alert('Registration successful! Please log in.');
      } else {
        const res = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('authToken', res.data.token);
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#0b0f19] px-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <LayoutDashboard className="w-8 h-8 text-indigo-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            PulseGrid SaaS
          </span>
        </div>

        <h2 className="text-lg font-medium text-center text-slate-300 mb-6">
          {isRegister ? 'Register Organization' : 'Sign in to your Workspace'}
        </h2>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {isRegister ? 'Create Organization' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isRegister ? 'Already have an account?' : "Don't have an organization?"}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-400 hover:underline font-medium ml-1 cursor-pointer"
          >
            {isRegister ? 'Sign In' : 'Register here'}
          </button>
        </div>
      </div>
    </div>
  );
}