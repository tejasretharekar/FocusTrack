// frontend/src/pages/Auth.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User, ArrowRight } from 'lucide-react';

// Use 127.0.0.1 instead of localhost to prevent IPv6 binding issues in Node
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id: data._id, name: data.name, role: data.role }));
        navigate('/');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('Server error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#121212] via-[#1a0b2e] to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e1e28] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header Section */}
        <div className="p-8 text-center bg-gradient-to-b from-[#251538] to-transparent">
          <div className="flex justify-center mb-4">
            <div className="bg-black/40 p-4 rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <Brain className="text-purple-500" size={40} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-500 tracking-widest uppercase">
            FocusFlow
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {isLogin ? 'Welcome back. Stay disciplined.' : 'Create your account. Start your journey.'}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center font-semibold">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <input 
                type="text" required placeholder="Full Name"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#121212] text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input 
              type="email" required placeholder="Email Address"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-[#121212] text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input 
              type="password" required placeholder="Password"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-[#121212] text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <button type="submit" className="w-full py-4 bg-gradient-to-r from-orange-500 to-purple-500 hover:opacity-90 text-white rounded-xl font-bold flex items-center justify-center transition-opacity shadow-lg mt-4">
            {isLogin ? 'ENTER COMMAND CENTER' : 'INITIALIZE ACCOUNT'}
            <ArrowRight size={20} className="ml-2" />
          </button>

          <div className="text-center mt-6">
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-purple-500 font-bold">{isLogin ? 'Sign Up' : 'Log In'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}