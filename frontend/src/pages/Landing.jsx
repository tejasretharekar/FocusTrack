// frontend/src/pages/Landing.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Timer, Trophy, Swords, CheckSquare, Activity, ArrowRight, Target } from 'lucide-react';

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // ... (keep the same features array from before)
  const features = [
    { icon: <Timer size={32} className="text-red-500" />, title: "Deep Work Pomodoro", description: "Lock in with customizable focus intervals." },
    { icon: <CheckSquare size={32} className="text-blue-500" />, title: "Task Management", description: "Organize your daily goals and prioritize effectively." },
    { icon: <Swords size={32} className="text-purple-500" />, title: "Head-to-Head Challenges", description: "Send productivity challenges to other usernames." },
    { icon: <Activity size={32} className="text-green-500" />, title: "Fitness & Diet Tracking", description: "Log your workouts and meals to keep your physical energy aligned." },
    { icon: <Trophy size={32} className="text-yellow-500" />, title: "Global Leaderboard", description: "Climb the ranks to the top of the FocusTrack community." },
    { icon: <Target size={32} className="text-orange-500" />, title: "Analytics & Streaks", description: "Visualize your progress over time and maintain daily streaks." }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      <nav className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto z-50 relative">
        <div className="flex items-center space-x-3">
          <Brain className="text-red-500" size={36} />
          <span className="text-2xl font-black tracking-widest text-white uppercase">FocusTrack</span>
        </div>
        <div>
          {isLoggedIn ? (
            <Link to="/home" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              Resume Tracking
            </Link>
          ) : (
            <Link to="/auth" className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-white font-bold rounded-lg transition-all border border-gray-800">
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <main className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="z-10 max-w-4xl space-y-8 animate-fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full border border-red-900/50 bg-red-900/10 text-red-400 text-sm font-bold tracking-widest uppercase mb-4">
            Gamify Your Productivity
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Stop Procrastinating. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Start Dominating.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The ultimate gamified productivity system. Track your deep work, conquer tasks, challenge friends, and monitor your physical health—all in one command center.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <button onClick={() => navigate('/home')} className="flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all text-lg group w-full sm:w-auto shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                Go to App
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            ) : (
              <button onClick={() => navigate('/auth')} className="flex items-center justify-center px-8 py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all text-lg group w-full sm:w-auto">
                Start Tracking Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            )}
          </div>
        </div>
      </main>

      <section className="py-24 bg-[#121212] border-t border-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">The Arsenal</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#1a1a1a] border border-gray-800 p-8 rounded-2xl hover:border-gray-600 transition-colors group">
                <div className="mb-6 bg-[#252525] w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}