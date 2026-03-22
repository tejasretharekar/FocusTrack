// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, CheckSquare, Flame, Dumbbell, User } from 'lucide-react'; // Added User icon

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tasks: { total: 0, completedToday: 0 },
    workouts: { total: 0, completedToday: 0 },
    diet: { total: 0, completedToday: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');
  
  // 1. Safely parse user data from localStorage
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
        } else {
          console.error('Failed to fetch stats');
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#121212] via-[#1a0b2e] to-[#0a0a0a] flex flex-col items-center p-4 md:p-6 overflow-x-hidden box-border">
      <div className="w-full max-w-md flex items-center justify-between mb-6 mt-2 md:mt-0">
        <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-white transition p-2">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider flex items-center">
          <BarChart3 className="text-purple-500 mr-2" size={24} /> DAILY REVIEW
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pb-12">
        
        {/* 2. User Profile Header added here */}
        <div className="bg-[#1e1e28] border border-gray-800 rounded-3xl p-6 mb-6 flex items-center space-x-5 shadow-lg">
          <div className="bg-gradient-to-br from-orange-500 to-purple-500 p-1 rounded-full">
            <div className="bg-[#121212] p-3 rounded-full">
              <User size={32} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide">{user.name || 'User'}</h2>
            <p className="text-purple-400 font-medium tracking-wider text-sm">@{user.username || 'username'}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center mt-12">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="bg-[#1e1e28] border border-purple-900/50 rounded-3xl p-8 shadow-2xl mb-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
              <h3 className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-4">Overall Completion</h3>
              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-6xl font-black text-white tracking-tighter">{overallProgress}</span>
                <span className="text-2xl text-purple-500 font-bold">%</span>
              </div>
              <p className="text-gray-400 text-sm">{totalCompleted} of {totalItems} goals crushed today</p>
              <div className="w-full h-3 bg-gray-800 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${overallProgress}%` }}></div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white tracking-wide mb-4 pl-1">Category Breakdown</h3>
            <div className="space-y-4">
              
              <div className="bg-[#1a1a24] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><CheckSquare size={20} /></div>
                    <span className="font-semibold text-gray-200">Tasks</span>
                  </div>
                  <span className="text-white font-bold">{stats.tasks?.completedToday || 0} / {stats.tasks?.total || 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${calcPercent(stats.tasks?.completedToday, stats.tasks?.total)}%` }}></div>
                </div>
              </div>

              <div className="bg-[#1a1a24] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg text-purple-500"><Dumbbell size={20} /></div>
                    <span className="font-semibold text-gray-200">Workouts</span>
                  </div>
                  <span className="text-white font-bold">{stats.workouts?.completedToday || 0} / {stats.workouts?.total || 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${calcPercent(stats.workouts?.completedToday, stats.workouts?.total)}%` }}></div>
                </div>
              </div>

              <div className="bg-[#1a1a24] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500"><Flame size={20} /></div>
                    <span className="font-semibold text-gray-200">Diet</span>
                  </div>
                  <span className="text-white font-bold">{stats.diet?.completedToday || 0} / {stats.diet?.total || 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${calcPercent(stats.diet?.completedToday, stats.diet?.total)}%` }}></div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}