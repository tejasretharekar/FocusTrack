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

  const logSessionToBackend = async (durationMinutes) => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) return; 

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pomodoro/log`, {
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
      
      const alarmSound = new Audio('/alarm.mp3');
      alarmSound.play().catch(err => console.error("Audio playback prevented:", err));
      
      setTimeout(() => {
        if (isFocus) {
          logSessionToBackend(focusTime);
          alert(`Awesome job! You focused for ${focusTime} minutes. Time for a break.`);
          
          alarmSound.pause();
          alarmSound.currentTime = 0;
          
          setIsFocus(false);
          setTimeLeft(breakTime * 60);
        } else {
          alert("Break is over! Time to get back to work.");
          
          alarmSound.pause();
          alarmSound.currentTime = 0;
          
          setIsFocus(true);
          setTimeLeft(focusTime * 60);
        }
      }, 500); 
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
    // FIX: Changed w-screen to w-full to prevent horizontal scroll
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a0b2e] via-[#121212] to-[#2d1406] flex flex-col items-center p-4 md:p-6 overflow-x-hidden box-border">
      
      {/* Header Controls - FIX: Removed negative margins */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 mt-2 md:mt-0">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition p-2">
          <ArrowLeft size={28} />
        </button>
        <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-white transition p-2">
          <Settings size={28} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md pb-12">
        
        <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-widest mb-6 md:mb-8 text-center ${themeColor.split(' ')[0]}`}>
          {isFocus ? 'Focus Session' : 'Break Time'}
        </h2>

        {/* Timer Display */}
        <div className={`w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full border-4 flex items-center justify-center mb-10 shadow-2xl transition-colors duration-500 ${themeColor}`}>
          <span className="text-5xl sm:text-6xl md:text-8xl font-bold text-focusText tracking-tighter">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Timer Controls */}
        <div className="flex space-x-6">
          <button 
            onClick={toggleTimer}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-lg transition transform hover:scale-105 ${bgThemeColor}`}
          >
            {isActive ? <Pause size={28} className="sm:w-8 sm:h-8" /> : <Play size={28} className="ml-1 sm:w-8 sm:h-8" />}
          </button>
          
          <button 
            onClick={resetTimer}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-focusCard text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 shadow-lg transition transform hover:scale-105"
          >
            <RotateCcw size={28} className="sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <form onSubmit={handleApplySettings} className="mt-8 bg-focusCard p-5 sm:p-6 rounded-2xl border border-gray-800 shadow-xl w-full animate-fade-in box-border">
            <h3 className="text-lg font-semibold text-focusText mb-4 text-center sm:text-left">Timer Settings</h3>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="flex-1 w-full">
                <label className="block text-sm text-gray-400 mb-1">Focus (min)</label>
                <input 
                  type="number" min="1" value={focusTime}
                  onChange={(e) => setFocusTime(Number(e.target.value))}
                  className="w-full bg-[#121212] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-focusOrange box-border"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm text-gray-400 mb-1">Break (min)</label>
                <input 
                  type="number" min="1" value={breakTime}
                  onChange={(e) => setBreakTime(Number(e.target.value))}
                  className="w-full bg-[#121212] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-focusPurple box-border"
                />
              </div>
            </div>
            <button type="submit" className="w-full py-3 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition">
              Apply & Reset
            </button>
          </form>
        )}

        {/* Pomodoro Explanation Section */}
        <div className="w-full mt-10 sm:mt-12 p-5 sm:p-6 bg-[#1a1a24] rounded-2xl border border-gray-800 shadow-xl box-border">
          <h3 className="text-lg sm:text-xl font-bold text-gray-200 mb-3 text-center">What is Pomodoro?</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-5 text-center">
            The Pomodoro Technique is a time management method designed to maximize focus and prevent burnout by breaking work into intervals.
          </p>
          <div className="flex flex-col space-y-3 text-xs sm:text-sm text-gray-300 mx-auto max-w-[280px] sm:max-w-none">
            <div className="flex items-start">
              <span className="text-focusOrange font-bold mr-3 mt-0.5">1.</span> 
              <span>Pick a task to accomplish.</span>
            </div>
            <div className="flex items-start">
              <span className="text-focusOrange font-bold mr-3 mt-0.5">2.</span> 
              <span>Start the 25-minute timer and focus.</span>
            </div>
            <div className="flex items-start">
              <span className="text-focusOrange font-bold mr-3 mt-0.5">3.</span> 
              <span>Work until the timer rings.</span>
            </div>
            <div className="flex items-start">
              <span className="text-focusPurple font-bold mr-3 mt-0.5">4.</span> 
              <span>Take a 5-minute break to recharge.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}