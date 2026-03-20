// frontend/src/pages/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, Flame } from 'lucide-react';


const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        } else {
          console.error('Failed to fetch leaderboard');
          setLeaderboard([]);
        }
      } catch (error) {
        console.error('Network error', error);
        setLeaderboard([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  const getRankStyles = (index) => {
    switch (index) {
      case 0: return { card: 'bg-gradient-to-r from-[#2a1a00] to-[#1a1500] border-yellow-500/60 shadow-[0_0_15px_rgba(234,179,8,0.2)]', text: 'text-yellow-400', icon: <Trophy size={36} className="text-yellow-400 drop-shadow-lg" /> };
      case 1: return { card: 'bg-gradient-to-r from-[#1a1a2e] to-[#12121a] border-gray-400/50', text: 'text-gray-300', icon: <Medal size={32} className="text-gray-300" /> };
      case 2: return { card: 'bg-gradient-to-r from-[#2e1510] to-[#1a0c0a] border-orange-600/50', text: 'text-orange-500', icon: <Award size={32} className="text-orange-500" /> };
      default: return { card: 'bg-[#1e1e28] border-gray-800', text: 'text-purple-500', icon: <span className="text-xl font-bold text-gray-600 w-8 text-center">{index + 1}</span> };
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#121212] via-[#1a0b2e] to-[#0a0a0a] flex flex-col items-center p-4 md:p-6 overflow-x-hidden box-border">
      <div className="w-full max-w-md flex items-center justify-between mb-8 mt-2 md:mt-0">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition p-2">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider flex items-center">
          <Flame className="text-purple-500 mr-2" size={24} /> GLOBAL RANKING
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pb-12">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">No active users yet.</p>
            <p className="text-sm">Complete tasks to become the first on the board!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((user, index) => {
              const styles = getRankStyles(index);
              const isTop3 = index < 3;
              return (
                <div key={user._id || index} className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-transform hover:scale-[1.02] ${styles.card}`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10">{styles.icon}</div>
                    <div>
                      <h3 className={`font-bold ${isTop3 ? 'text-xl' : 'text-lg'} text-white tracking-wide`}>{user.name || 'Anonymous User'}</h3>
                      <div className="flex space-x-3 text-xs md:text-sm text-gray-400 mt-1">
                        <span>💪 {user.workoutPoints || 0}</span>
                        <span>🥗 {user.dietPoints || 0}</span>
                        <span>✅ {user.taskPoints || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right ${styles.text}`}>
                    <div className={`font-black ${isTop3 ? 'text-3xl' : 'text-2xl'} tracking-tighter`}>{user.totalPoints || 0}</div>
                    <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-80">Points</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}