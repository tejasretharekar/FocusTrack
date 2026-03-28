// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Timer, Flame, Dumbbell, Trophy, BarChart3, Swords, Brain, Sparkles, LogOut, ShieldAlert } from 'lucide-react';

const quotes = [
  "Discipline equals freedom.",
  "Don't stop when you're tired. Stop when you're done.",
  "The hard days are what make you stronger.",
  "Focus on the process, not the outcome.",
  "Your future is created by what you do today."
];

export default function Home() {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setCurrentUser(JSON.parse(userData));

    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true); 
      }, 500); 
    }, 6000); 

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  // Infused rich, dark accent colors to keep the layout lively but professional
  const navItems = [
    { title: 'Tasks', path: '/tasks', icon: <CheckSquare size={32} strokeWidth={1.5} />, color: 'text-blue-600' },
    { title: 'Pomodoro', path: '/pomodoro', icon: <Timer size={32} strokeWidth={1.5} />, color: 'text-orange-600' },
    { title: 'Diet', path: '/diet', icon: <Flame size={32} strokeWidth={1.5} />, color: 'text-emerald-600' },
    { title: 'Workout', path: '/workout', icon: <Dumbbell size={32} strokeWidth={1.5} />, color: 'text-red-600' },
    { title: 'Challenges', path: '/challenges', icon: <Swords size={32} strokeWidth={1.5} />, color: 'text-purple-600' },
    { title: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={32} strokeWidth={1.5} />, color: 'text-yellow-600' },
    { title: 'Dashboard', path: '/dashboard', icon: <BarChart3 size={32} strokeWidth={1.5} />, color: 'text-cyan-600' },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ title: 'Admin', path: '/admin', icon: <ShieldAlert size={32} strokeWidth={1.5} />, color: 'text-rose-600' });
  } else {
    navItems.push({ title: 'TBA', path: '#', icon: <Sparkles size={32} strokeWidth={1.5} />, color: 'text-[#555]' });
  }

  const handleNavigation = (path) => {
    if (path === '#') alert("More features are on the way.");
    else navigate(path);
  };

  return (
    <div className="min-h-screen w-full bg-black text-[#EDEDED] flex flex-col items-center p-6 font-sans overflow-x-hidden">
      
      {/* Minimal Header */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-6 border-b border-[#222]">
        <div className="flex items-center space-x-3 text-white">
          <Brain size={24} strokeWidth={1.5} className="text-purple-500" />
          <h1 className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">FocusTrack</h1>
        </div>
        <button onClick={handleLogout} className="text-[#555] hover:text-white transition-colors flex items-center text-xs uppercase tracking-widest">
          <span className="mr-2 hidden sm:inline">Logout</span>
          <LogOut size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Hero Quote */}
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl text-center px-4 my-12">
        <h2 className={`text-3xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-tight text-white transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
          {quotes[quoteIndex]}
        </h2>
      </div>

      {/* Grid Menu */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-[1px] bg-[#222] border border-[#222] pb-6 sm:pb-0">
        {navItems.map((item) => (
          <button
            key={item.title}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center justify-center py-12 bg-black hover:bg-[#111] transition-colors group"
          >
            {/* Added custom color variable mapping */}
            <div className={`mb-4 transition-colors duration-300 ${item.color} group-hover:text-white`}>
              {item.icon}
            </div>
            <span className="text-[#888] font-medium tracking-widest text-[10px] md:text-xs uppercase group-hover:text-white transition-colors">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}