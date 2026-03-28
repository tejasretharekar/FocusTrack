// frontend/src/pages/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}/leaderboard`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.ok) setLeaderboard(await response.json()); 
        else setLeaderboard([]);
      } catch (error) { setLeaderboard([]); } finally { setIsLoading(false); }
    };
    fetchLeaderboard();
  }, [token]);

  return (
    <div className="min-h-screen w-full bg-black text-[#EDEDED] flex flex-col items-center p-6 font-sans overflow-x-hidden">
      
      {/* Minimal Header */}
      <div className="w-full max-w-md flex items-center justify-between pb-6 border-b border-[#222]">
        <button onClick={() => navigate('/home')} className="text-[#888] hover:text-white transition-colors">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">Global Ranking</h2>
        <div className="w-6"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pt-8 pb-12">
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <div className="w-6 h-6 border-2 border-[#333] border-t-white rounded-full animate-spin"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-[#555] font-light text-center mt-10">No metrics acquired. System idle.</p>
        ) : (
          <div className="space-y-0">
            {/* Header row for context */}
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#444] pb-4 border-b border-[#111]">
              <span className="w-8">Rnk</span>
              <span className="flex-1 ml-4">Identifier</span>
              <span className="text-right">Score</span>
            </div>

            {leaderboard.map((user, index) => {
              const isTop = index === 0;
              return (
                <div key={user._id || index} className="flex items-center justify-between py-5 border-b border-[#111] hover:border-[#333] transition-colors group">
                  
                  <div className="flex items-center flex-1 min-w-0">
                    <div className={`w-8 font-light text-lg ${isTop ? 'text-white' : 'text-[#444]'}`}>
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0 ml-4">
                      <h3 className={`font-light text-lg tracking-wide truncate ${isTop ? 'text-white' : 'text-[#EDEDED]'}`}>
                        {user.name || 'Anonymous Protocol'}
                      </h3>
                      
                      <div className="flex space-x-3 text-[10px] uppercase tracking-widest text-[#666] mt-1 font-medium">
                        <span>WK: {user.workoutPoints || 0}</span>
                        <span>DT: {user.dietPoints || 0}</span>
                        <span>TS: {user.taskPoints || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <div className={`font-light text-2xl tracking-tighter ${isTop ? 'text-white' : 'text-[#888]'}`}>
                      {user.totalPoints || 0}
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