// frontend/src/pages/Pomodoro.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Settings } from 'lucide-react';

export default function Pomodoro() {
  const navigate = useNavigate();
  
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  
  const [timeLeft, setTimeLeft] = useState(focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Function to save session to database
  const logSessionToBackend = async (durationMinutes) => {
    try {
      const token = localStorage.getItem('token'); // We will set this in Phase 14 when we build the Login UI
      if (!token) return; // Skip if user isn't logged in yet (during testing)

      await fetch('http://localhost:5000/api/pomodoro/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ duration: durationMinutes })
      });
      console.log(`Logged ${durationMinutes} minutes to backend!`);
    } catch (error) {
      console.error("Failed to log session", error);
    }
  };

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      
      if (isFocus) {
        // LEADERBOARD INTEGRATION: Send data to backend!
        logSessionToBackend(focusTime);
        
        alert(`Awesome job! You focused for ${focusTime} minutes. Time for a break.`);
        setIsFocus(false);
        setTimeLeft(breakTime * 60);
      } else {
        alert("Break is over! Time to get back to work.");
        setIsFocus(true);
        setTimeLeft(focusTime * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isFocus, focusTime, breakTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isFocus ? focusTime * 60 : breakTime * 60);
  };

  const handleApplySettings = (e) => {
    e.preventDefault();
    setShowSettings(false);
    resetTimer();
  };

  const themeColor = isFocus ? 'text-focusOrange border-focusOrange' : 'text-focusPurple border-focusPurple';
  const bgThemeColor = isFocus ? 'bg-focusOrange hover:bg-orange-600' : 'bg-focusPurple hover:bg-purple-600';

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#1a0b2e] via-[#121212] to-[#2d1406] flex flex-col items-center p-4 md:p-6 overflow-x-hidden">
      
      <div className="w-full max-w-md flex items-center justify-between mb-8 mt-2 md:mt-0">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={28} />
        </button>
        <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-white transition">
          <Settings size={28} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        
        <h2 className={`text-2xl md:text-3xl font-bold uppercase tracking-widest mb-8 ${themeColor.split(' ')[0]}`}>
          {isFocus ? 'Focus Session' : 'Break Time'}
        </h2>

        <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-4 flex items-center justify-center mb-12 shadow-2xl transition-colors duration-500 ${themeColor}`}>
          <span className="text-6xl md:text-8xl font-bold text-focusText tracking-tighter">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex space-x-6">
          <button 
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition transform hover:scale-105 ${bgThemeColor}`}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          
          <button 
            onClick={resetTimer}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-focusCard text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 shadow-lg transition transform hover:scale-105"
          >
            <RotateCcw size={32} />
          </button>
        </div>

        {showSettings && (
          <form onSubmit={handleApplySettings} className="mt-12 bg-focusCard p-6 rounded-2xl border border-gray-800 shadow-xl w-full animate-fade-in">
            <h3 className="text-lg font-semibold text-focusText mb-4">Timer Settings (Minutes)</h3>
            <div className="flex space-x-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Focus</label>
                <input 
                  type="number" min="1" value={focusTime}
                  onChange={(e) => setFocusTime(Number(e.target.value))}
                  className="w-full bg-[#121212] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-focusOrange"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Break</label>
                <input 
                  type="number" min="1" value={breakTime}
                  onChange={(e) => setBreakTime(Number(e.target.value))}
                  className="w-full bg-[#121212] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-focusPurple"
                />
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition">
              Apply & Reset
            </button>
          </form>
        )}

      </div>
    </div>
  );
}