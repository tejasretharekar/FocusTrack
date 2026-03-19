// frontend/src/pages/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, Flame } from 'lucide-react';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token') || 'dummy-token';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // If the DB has users, use them. If it's empty, use the mock data for testing.
          if (data.length > 0) {
            setLeaderboard(data);
          } else {
            loadMockData();
          }
        } else {
          loadMockData(); // Dev mode bypass
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
        loadMockData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  const loadMockData = () => {
    console.warn("Using Dev Mode Mock Data for Leaderboard");
    setLeaderboard([
      { _id: '1', name: 'Alex "The Machine"', totalPoints: 1250, workoutPoints: 500, dietPoints: 350, taskPoints: 400 },
      { _id: '2', name: 'Jordan Grind', totalPoints: 980, workoutPoints: 400, dietPoints: 300, taskPoints: 280 },
      { _id: '3', name: 'Taylor Swift', totalPoints: 850, workoutPoints: 300, dietPoints: 250, taskPoints: 300 },
      { _id: '4', name: 'Casey Smith', totalPoints: 620, workoutPoints: 200, dietPoints: 200, taskPoints: 220 },
      { _id: '5', name: 'You (Guest)', totalPoints: 450, workoutPoints: 150, dietPoints: 100, taskPoints: 200 },
    ]);
  };

  // Helper to determine styling based on rank
  const getRankStyles = (index) => {
    switch (index) {
      case 0: 
        return { 
          card: 'bg-gradient-to-r from-[#2a1a00] to-[#1a1500] border-yellow-500/60 shadow-[0_0_15px_rgba(234,179,8,0.2)]', 
          text: 'text-yellow-400', 
          icon: <Trophy size={36} className="text-yellow-400 drop-shadow-lg" /> 
        };
      case 1: 
        return { 
          card: 'bg-gradient-to-r from-[#1a1a2e] to-[#12121a] border-gray-400/50', 
          text: 'text-gray-300', 
          icon: <Medal size={32} className="text-gray-300" /> 
        };
      case 2: 
        return { 
          card: 'bg-gradient-to-r from-[#2e1510] to-[#1a0c0a] border-orange-600/50', 
          text: 'text-orange-500', 
          icon: <Award size={32} className="text-orange-500" /> 
        };
      default: 
        return { 
          card: 'bg-[#1e1e28] border-gray-800', 
          text: 'text-focusPurple', 
          icon: <span className="text-xl font-bold text-gray-600 w-8 text-center">{index + 1}</span> 
        };
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#121212] via-[#1a0b2e] to-[#0a0a0a] flex flex-col items-center p-4 md:p-6 overflow-x-hidden box-border">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 mt-2 md:mt-0">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition p-2">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider flex items-center">
          <Flame className="text-focusPurple mr-2" size={24} />
          GLOBAL RANKING
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pb-12">
        
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-focusPurple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((user, index) => {
              const styles = getRankStyles(index);
              const isTop3 = index < 3;

              return (
                <div 
                  key={user._id} 
                  className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-transform hover:scale-[1.02] ${styles.card}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10">
                      {styles.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold ${isTop3 ? 'text-xl' : 'text-lg'} text-white tracking-wide`}>
                        {user.name || 'Anonymous User'}
                      </h3>
                      <div className="flex space-x-3 text-xs md:text-sm text-gray-400 mt-1">
                        <span>💪 {user.workoutPoints}</span>
                        <span>🥗 {user.dietPoints}</span>
                        <span>✅ {user.taskPoints}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-right ${styles.text}`}>
                    <div className={`font-black ${isTop3 ? 'text-3xl' : 'text-2xl'} tracking-tighter`}>
                      {user.totalPoints}
                    </div>
                    <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-80">
                      Points
                    </div>
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