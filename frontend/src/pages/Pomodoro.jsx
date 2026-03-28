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
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ duration: durationMinutes })
      });
    } catch (error) { console.error("Failed to log session", error); }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      const alarmSound = new Audio('/alarm.mp3'); alarmSound.play().catch(e => console.error(e));
      
      setTimeout(() => {
        if (isFocus) {
          logSessionToBackend(focusTime);
          alert(`Awesome job! You focused for ${focusTime} minutes. Time for a break.`);
          alarmSound.pause(); alarmSound.currentTime = 0;
          setIsFocus(false); setTimeLeft(breakTime * 60);
        } else {
          alert("Break is over! Time to get back to work.");
          alarmSound.pause(); alarmSound.currentTime = 0;
          setIsFocus(true); setTimeLeft(focusTime * 60);
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
  const resetTimer = () => { setIsActive(false); setTimeLeft(isFocus ? focusTime * 60 : breakTime * 60); };

  const handleApplySettings = (e) => { e.preventDefault(); setShowSettings(false); resetTimer(); };

  return (
    <div className="min-h-screen w-full bg-black text-[#EDEDED] flex flex-col items-center p-6 font-sans overflow-x-hidden">
      
      {/* Minimal Header */}
      <div className="w-full max-w-md flex items-center justify-between pb-6 border-b border-[#222]">
        <button onClick={() => navigate('/home')} className="text-[#888] hover:text-white transition-colors">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">Pomodoro Timer</h2>
        <button onClick={() => setShowSettings(!showSettings)} className="text-[#888] hover:text-white transition-colors">
          <Settings size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col justify-center pt-8 pb-12">
        
        {/* Typographic Timer Display */}
        <div className="mb-16 flex flex-col items-center">
          <p className="text-[#666] text-xs uppercase tracking-widest mb-6">
            {isFocus ? 'Focus Phase Active' : 'Recovery Phase Active'}
          </p>
          <div className="text-[7rem] sm:text-9xl font-light tracking-tighter leading-none text-white transition-all duration-300">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Minimalist Controls */}
        <div className="flex justify-center space-x-6 mb-12">
          <button 
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full border border-white text-black bg-white hover:bg-[#ddd] flex items-center justify-center transition-colors"
          >
            {isActive ? <Pause size={24} strokeWidth={1.5} /> : <Play size={24} strokeWidth={1.5} className="ml-1" />}
          </button>
          
          <button 
            onClick={resetTimer}
            className="w-16 h-16 rounded-full border border-[#333] text-[#888] hover:text-white hover:border-white flex items-center justify-center transition-colors bg-transparent"
          >
            <RotateCcw size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <form onSubmit={handleApplySettings} className="border-t border-[#222] pt-8 pb-4 animate-fade-in">
            <h3 className="text-xs font-medium tracking-[0.2em] text-[#888] uppercase mb-6">Configure Parameters</h3>
            <div className="flex space-x-6 mb-6">
              <div className="flex-1">
                <input 
                  type="number" min="1" value={focusTime} placeholder="Focus (min)"
                  onChange={(e) => setFocusTime(Number(e.target.value))}
                  className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="number" min="1" value={breakTime} placeholder="Break (min)"
                  onChange={(e) => setBreakTime(Number(e.target.value))}
                  className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]"
                />
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-white text-black font-medium uppercase tracking-widest text-xs hover:bg-[#ddd] transition-colors">
              Sync Parameters
            </button>
          </form>
        )}

        {/* Protocol Execution Info */}
        <div className="mt-8 pt-8 border-t border-[#222]">
          <h3 className="text-xs font-medium tracking-[0.2em] text-[#888] uppercase mb-4">Objective</h3>
          <p className="text-[#666] font-light text-sm leading-relaxed mb-6">
A time management method that helps you stay focused and avoid burnout by working in short, structured intervals.          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-white font-medium mr-4 text-xs tracking-widest">01.</span>
              <span className="text-[#888] font-light text-sm">Choose one task to work on.</span>
            </div>
            <div className="flex items-start">
              <span className="text-white font-medium mr-4 text-xs tracking-widest">02.</span>
              <span className="text-[#888] font-light text-sm">Start the timer and focus only on that task.</span>
            </div>
            <div className="flex items-start">
              <span className="text-white font-medium mr-4 text-xs tracking-widest">03.</span>
              <span className="text-[#888] font-light text-sm">Work without distractions until the timer ends.</span>
            </div>
            <div className="flex items-start">
              <span className="text-white font-medium mr-4 text-xs tracking-widest">04.</span>
              <span className="text-[#888] font-light text-sm">Take a short break to refresh your mind.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}