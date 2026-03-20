// frontend/src/pages/AdminAuth.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export default function AdminAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // STRICT ADMIN CHECK
        if (data.role !== 'admin') {
          setError('Access Denied: You do not have admin privileges.');
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id: data._id, name: data.name, role: data.role }));
        navigate('/admin'); // Redirect straight to admin panel
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Server error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e1e28] border border-red-500/30 rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.1)] overflow-hidden">
        
        <div className="p-8 text-center bg-gradient-to-b from-[#381515] to-transparent border-b border-red-500/10">
          <div className="flex justify-center mb-4">
            <div className="bg-black/40 p-4 rounded-full border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="text-red-500" size={40} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-red-500 tracking-widest uppercase">
            Admin Portal
          </h2>
          <p className="text-gray-400 mt-2 text-sm">Restricted Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center font-semibold">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-red-500/50" size={20} />
            <input 
              type="email" required placeholder="Admin Email"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-[#121212] text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-red-500/50" size={20} />
            <input 
              type="password" required placeholder="Password"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-[#121212] text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg mt-4">
            VERIFY CREDENTIALS
            <ArrowRight size={20} className="ml-2" />
          </button>
          
          <div className="text-center mt-4">
            <button type="button" onClick={() => navigate('/auth')} className="text-gray-500 hover:text-white text-sm transition">
              Return to User Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}