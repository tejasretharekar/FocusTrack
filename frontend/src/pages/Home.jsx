// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, Timer, Flame, Dumbbell, Trophy, BarChart3, Swords, Brain, Sparkles, LogOut, ShieldAlert 
} from 'lucide-react';

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
  
  // 1. Get the current logged-in user from local storage
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Parse the user data when the component mounts
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

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

  // Base navigation items for everyone
  const navItems = [
    { title: 'Tasks', path: '/tasks', icon: <CheckSquare size={32} />, color: 'text-focusOrange' },
    { title: 'Pomodoro', path: '/pomodoro', icon: <Timer size={32} />, color: 'text-focusOrange' },
    { title: 'Diet', path: '/diet', icon: <Flame size={32} />, color: 'text-focusOrange' },
    { title: 'Workout', path: '/workout', icon: <Dumbbell size={32} />, color: 'text-focusPurple' },
    { title: 'Challenges', path: '/challenges', icon: <Swords size={32} />, color: 'text-focusPurple' },
    { title: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={32} />, color: 'text-yellow-500' },
    { title: 'Dashboard', path: '/dashboard', icon: <BarChart3 size={32} />, color: 'text-focusPurple' },
  ];

  // 2. Conditionally add the 8th button based on the user's role
  if (currentUser?.role === 'admin') {
    // If they are an admin, show the Command Center button
    navItems.push({ title: 'Admin Panel', path: '/admin', icon: <ShieldAlert size={32} />, color: 'text-red-500' });
  } else {
    // If they are a regular user, show the "More Soon" placeholder to keep the grid even
    navItems.push({ title: 'More Soon', path: '#', icon: <Sparkles size={32} />, color: 'text-gray-500' });
  }

  const handleNavigation = (path) => {
    if (path === '#') {
      alert("More features are on the way! Stay focused.");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#121212] via-[#1a0b2e] to-[#2d1406] flex flex-col items-center justify-between p-6 md:p-10 overflow-x-hidden box-border">
      
      {/* Top: App Logo, Branding & Logout */}
      <div className="w-full flex justify-between items-center mt-2 md:mt-4">
        <div className="w-10"></div>
        <div className="flex items-center space-x-3 bg-black/30 px-6 py-3 rounded-full backdrop-blur-md border border-white/5 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
          <Brain className="text-focusPurple" size={28} />
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-focusOrange to-focusPurple tracking-widest uppercase">
            FocusFlow
          </h1>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition p-2 w-10 flex justify-end">
          <LogOut size={24} />
        </button>
      </div>

      {/* Center: Immersive Motivational Quote */}
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl text-center px-4 my-8">
        <h2 
          className={`text-2xl md:text-4xl lg:text-5xl font-bold text-gray-200 tracking-wide leading-relaxed transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
        >
          "{quotes[quoteIndex]}"
        </h2>
      </div>

      {/* Bottom: Responsive Navigation Grid */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5 pb-4">
        {navItems.map((item) => (
          <button
            key={item.title}
            onClick={() => handleNavigation(item.path)}
            className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-[#1e1e28]/40 border border-gray-800 backdrop-blur-sm hover:bg-[#252538]/80 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
          >
            <div className={`mb-3 transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
              {item.icon}
            </div>
            <span className="text-gray-300 font-bold tracking-wider text-xs md:text-sm uppercase group-hover:text-white transition-colors text-center">
              {item.title}
            </span>
          </button>
        ))}
      </div>
      
    </div>
  );
}