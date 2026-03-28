// frontend/src/pages/Landing.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Timer, Trophy, Swords, CheckSquare, Activity, ArrowRight, Target } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: <Timer size={24} strokeWidth={1.5} />, title: "Deep Work Pomodoro", description: "Lock in with customizable focus intervals." },
    { icon: <CheckSquare size={24} strokeWidth={1.5} />, title: "Task Management", description: "Organize your daily goals and prioritize effectively." },
    { icon: <Swords size={24} strokeWidth={1.5} />, title: "Head-to-Head Challenges", description: "Send productivity challenges to other users." },
    { icon: <Activity size={24} strokeWidth={1.5} />, title: "Fitness & Diet Tracking", description: "Log your workouts and meals to keep your physical energy aligned." },
    { icon: <Trophy size={24} strokeWidth={1.5} />, title: "Global Leaderboard", description: "Climb the ranks to the top of the FocusTrack community." },
    { icon: <Target size={24} strokeWidth={1.5} />, title: "Analytics & Streaks", description: "Visualize your progress over time and maintain daily streaks." }
  ];

  return (
    <div className="min-h-screen bg-black text-[#EDEDED] font-sans selection:bg-white selection:text-black overflow-x-hidden flex flex-col">
      
      {/* Minimal Header */}
      <nav className="w-full px-6 py-6 border-b border-[#222] flex justify-between items-center">
        <div className="flex items-center space-x-3 text-white">
          <Brain size={24} strokeWidth={1.5} />
          <span className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">FocusTrack</span>
        </div>
        <button onClick={() => navigate('/auth')} className="text-xs font-medium tracking-widest uppercase text-[#888] hover:text-white transition-colors">
          Login
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="max-w-4xl space-y-12 animate-fade-in">
          
          <div className="text-xs font-medium tracking-[0.2em] text-[#666] uppercase mb-4">
            System Architecture for Productivity
          </div>
          
          <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-none text-white">
            Stop Procrastinating.<br />
            <span className="text-[#666]">Start Dominating.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#888] font-light max-w-2xl mx-auto leading-relaxed">
            The ultimate disciplined productivity system. Track your deep work, conquer tasks, challenge peers, and monitor physical output.
          </p>
          
          <div className="pt-8 flex justify-center">
            <button onClick={() => navigate('/auth')} className="flex items-center justify-center px-10 py-4 bg-white text-black hover:bg-[#ddd] font-medium uppercase tracking-widest text-sm transition-colors group">
              Initialize Protocol
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </main>

      <section className="py-24 border-t border-[#222]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-medium tracking-[0.2em] text-[#888] uppercase">The Arsenal</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[#222] bg-[#111]">
            {features.map((feature, index) => (
              <div key={index} className="p-10 border border-[#222] bg-black hover:bg-[#0a0a0a] transition-colors group">
                <div className="mb-8 text-[#555] group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-normal mb-3 text-[#EDEDED]">{feature.title}</h3>
                <p className="text-[#666] font-light leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}