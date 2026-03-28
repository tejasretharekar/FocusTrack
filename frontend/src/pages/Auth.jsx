// frontend/src/pages/Auth.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { username: formData.username, password: formData.password } : formData;

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id: data._id, name: data.name, username: data.username, role: data.role })); 
        navigate('/home');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('Server error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-[#EDEDED] flex flex-col p-6 font-sans overflow-x-hidden">
      
      {/* Minimal Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pb-6 border-b border-[#222]">
        <button onClick={() => navigate('/')} className="text-[#888] hover:text-white transition-colors">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">Login/Sign in</h2>
        <div className="w-6"></div>
      </div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col pt-12">
        <div className="mb-12">
          <p className="text-[#666] text-xs uppercase tracking-widest mb-2">System Access</p>
          <h1 className="text-4xl font-light tracking-tighter leading-none text-white">
            {isLogin ? 'Login' : 'Create Identity'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
          {error && (
            <div className="pb-2 border-b border-red-900 text-red-500 text-xs font-medium uppercase tracking-widest">
              Error: {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <input
                type="text" required placeholder="Full Name"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]"
              />
            </div>
          )}

          <div>
            <input
              type="text" name="username" autoComplete="off" required placeholder="Username"
              value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} name="password" autoComplete="new-password" required placeholder="Password"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-transparent text-white pb-2 pr-10 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]"
            />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 text-[#666] hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
            </button>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full py-4 bg-white text-black font-medium uppercase tracking-widest text-xs hover:bg-[#ddd] transition-colors flex items-center justify-center group">
              {isLogin ? 'Authenticate' : 'Initialize'}
              <ArrowRight size={16} strokeWidth={1.5} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="text-center pt-6">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({ name: '', username: '', password: ''}); }}
              className="text-[#666] hover:text-white text-xs uppercase tracking-widest transition-colors border-b border-transparent hover:border-white pb-1"
            >
              {isLogin ? "No account? Register" : "Have account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}