// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, CheckSquare, Flame, Dumbbell } from 'lucide-react'; 

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tasks: { total: 0, completedToday: 0 },
    workouts: { total: 0, completedToday: 0 },
    diet: { total: 0, completedToday: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Network error', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  const calcPercent = (completed, total) => {
    if (!total || total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const totalItems = (stats.tasks?.total || 0) + (stats.workouts?.total || 0) + (stats.diet?.total || 0);
  const totalCompleted = (stats.tasks?.completedToday || 0) + (stats.workouts?.completedToday || 0) + (stats.diet?.completedToday || 0);
  const overallProgress = calcPercent(totalCompleted, totalItems);

  return (
    // Pure black background, stark white text
    <div className="min-h-screen w-full bg-black text-[#EDEDED] flex flex-col items-center p-6 font-sans">
      
      {/* Minimalist Header */}
      <div className="w-full max-w-md flex items-center justify-between pb-6 border-b border-[#222]">
        <button onClick={() => navigate('/home')} className="text-[#888] hover:text-white transition-colors duration-200">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">
          Daily Review
        </h2>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pt-8 pb-12">
        
        {/* Profile Section - Stripped of borders and background cards */}
        <div 
          className="flex items-center space-x-4 mb-12 cursor-pointer group"
          onClick={() => setIsProfileExpanded(!isProfileExpanded)}
        >
          <div className="w-12 h-12 bg-[#111] border border-[#333] rounded-full flex items-center justify-center group-hover:border-white transition-colors duration-300">
            <Activity size={20} className="text-white" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className={`text-2xl font-normal tracking-tight transition-all ${
              isProfileExpanded ? 'break-words whitespace-normal' : 'truncate'
            }`}>
              {user.name || 'User'}
            </h2>
            <p className="text-[#666] text-sm mt-1">
              @{user.username || 'username'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-6 h-6 border-2 border-[#333] border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Overall Progress - Massive Typography instead of a Card */}
            <div className="mb-16">
              <p className="text-[#666] text-xs uppercase tracking-widest mb-2">Total Completion</p>
              <div className="flex items-end space-x-2">
                <span className="text-8xl font-light tracking-tighter leading-none">{overallProgress}</span>
                <span className="text-2xl text-[#666] mb-2">%</span>
              </div>
              
              {/* Ultra-thin, elegant progress line */}
              <div className="w-full h-[1px] bg-[#222] mt-8 relative">
                <div 
                  className="absolute top-0 left-0 h-[1px] bg-white transition-all duration-1000 ease-out" 
                  style={{ width: `${overallProgress}%` }}
                >
                  {/* Subtle glowing dot at the end of the progress line */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                </div>
              </div>
              <p className="text-[#666] text-sm mt-4">{totalCompleted} of {totalItems} objectives met</p>
            </div>

            {/* Categories - Ledger Style (No Cards, Just Lines) */}
            <div className="space-y-6">
              
              {/* Task Row */}
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center space-x-3 text-[#888] group-hover:text-white transition-colors">
                    <CheckSquare size={16} strokeWidth={1.5} />
                    <span className="text-sm font-medium tracking-wide">Tasks</span>
                  </div>
                  <span className="text-xl font-light">{stats.tasks?.completedToday || 0}<span className="text-[#444] text-sm ml-1">/ {stats.tasks?.total || 0}</span></span>
                </div>
                <div className="w-full h-[2px] bg-[#111] rounded-full overflow-hidden">
                  <div className="h-full bg-[#555] group-hover:bg-white transition-all duration-700" style={{ width: `${calcPercent(stats.tasks?.completedToday, stats.tasks?.total)}%` }}></div>
                </div>
              </div>

              {/* Workout Row */}
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center space-x-3 text-[#888] group-hover:text-white transition-colors">
                    <Dumbbell size={16} strokeWidth={1.5} />
                    <span className="text-sm font-medium tracking-wide">Workouts</span>
                  </div>
                  <span className="text-xl font-light">{stats.workouts?.completedToday || 0}<span className="text-[#444] text-sm ml-1">/ {stats.workouts?.total || 0}</span></span>
                </div>
                <div className="w-full h-[2px] bg-[#111] rounded-full overflow-hidden">
                  <div className="h-full bg-[#555] group-hover:bg-white transition-all duration-700" style={{ width: `${calcPercent(stats.workouts?.completedToday, stats.workouts?.total)}%` }}></div>
                </div>
              </div>

              {/* Diet Row */}
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center space-x-3 text-[#888] group-hover:text-white transition-colors">
                    <Flame size={16} strokeWidth={1.5} />
                    <span className="text-sm font-medium tracking-wide">Diet</span>
                  </div>
                  <span className="text-xl font-light">{stats.diet?.completedToday || 0}<span className="text-[#444] text-sm ml-1">/ {stats.diet?.total || 0}</span></span>
                </div>
                <div className="w-full h-[2px] bg-[#111] rounded-full overflow-hidden">
                  <div className="h-full bg-[#555] group-hover:bg-white transition-all duration-700" style={{ width: `${calcPercent(stats.diet?.completedToday, stats.diet?.total)}%` }}></div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}