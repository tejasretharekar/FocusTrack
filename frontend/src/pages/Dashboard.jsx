// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, CheckSquare, Flame, Dumbbell } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tasks: { total: 0, completedToday: 0 },
    workouts: { total: 0, completedToday: 0 },
    diet: { total: 0, completedToday: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token') || 'dummy-token';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // If the user has absolutely no data created yet, inject the mock data for testing
          if (data.tasks.total === 0 && data.workouts.total === 0 && data.diet.total === 0) {
            loadMockData();
          } else {
            setStats(data);
          }
        } else {
          loadMockData(); // Dev mode bypass
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
        loadMockData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const loadMockData = () => {
    console.warn("Using Dev Mode Mock Data for Dashboard");
    setStats({
      tasks: { total: 5, completedToday: 3 },
      workouts: { total: 3, completedToday: 1 },
      diet: { total: 6, completedToday: 5 }
    });
  };

  // Helper to calculate percentages securely without dividing by zero
  const calcPercent = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const totalItems = stats.tasks.total + stats.workouts.total + stats.diet.total;
  const totalCompleted = stats.tasks.completedToday + stats.workouts.completedToday + stats.diet.completedToday;
  const overallProgress = calcPercent(totalCompleted, totalItems);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#121212] via-[#1a0b2e] to-[#0a0a0a] flex flex-col items-center p-4 md:p-6 overflow-x-hidden box-border">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 mt-2 md:mt-0">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition p-2">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider flex items-center">
          <BarChart3 className="text-focusPurple mr-2" size={24} />
          DAILY REVIEW
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pb-12">
        
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-focusPurple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Hero Metric - Overall Progress */}
            <div className="bg-[#1e1e28] border border-purple-900/50 rounded-3xl p-8 shadow-2xl mb-8 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-focusPurple opacity-10 rounded-full blur-3xl"></div>
              
              <h3 className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-4">Overall Completion</h3>
              
              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-6xl font-black text-white tracking-tighter">{overallProgress}</span>
                <span className="text-2xl text-focusPurple font-bold">%</span>
              </div>
              
              <p className="text-gray-400 text-sm">
                {totalCompleted} of {totalItems} goals crushed today
              </p>

              {/* Master Progress Bar */}
              <div className="w-full h-3 bg-gray-800 rounded-full mt-6 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-focusPurple to-purple-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white tracking-wide mb-4 pl-1">Category Breakdown</h3>

            {/* Breakdown Cards */}
            <div className="space-y-4">
              
              {/* Tasks Card */}
              <div className="bg-[#1a1a24] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                      <CheckSquare size={20} />
                    </div>
                    <span className="font-semibold text-gray-200">Tasks</span>
                  </div>
                  <span className="text-white font-bold">{stats.tasks.completedToday} / {stats.tasks.total}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${calcPercent(stats.tasks.completedToday, stats.tasks.total)}%` }}></div>
                </div>
              </div>

              {/* Workout Card */}
              <div className="bg-[#1a1a24] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-focusPurple/20 p-2 rounded-lg text-focusPurple">
                      <Dumbbell size={20} />
                    </div>
                    <span className="font-semibold text-gray-200">Workouts</span>
                  </div>
                  <span className="text-white font-bold">{stats.workouts.completedToday} / {stats.workouts.total}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-focusPurple rounded-full transition-all duration-1000" style={{ width: `${calcPercent(stats.workouts.completedToday, stats.workouts.total)}%` }}></div>
                </div>
              </div>

              {/* Diet Card */}
              <div className="bg-[#1a1a24] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-focusOrange/20 p-2 rounded-lg text-focusOrange">
                      <Flame size={20} />
                    </div>
                    <span className="font-semibold text-gray-200">Diet</span>
                  </div>
                  <span className="text-white font-bold">{stats.diet.completedToday} / {stats.diet.total}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-focusOrange rounded-full transition-all duration-1000" style={{ width: `${calcPercent(stats.diet.completedToday, stats.diet.total)}%` }}></div>
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}