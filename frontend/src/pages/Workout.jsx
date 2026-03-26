// frontend/src/pages/Workout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2, Circle, Play, Timer, Trash2 } from 'lucide-react';

export default function Workout() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', type: 'reps', target: '' });
  const [activeTimerId, setActiveTimerId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const token = localStorage.getItem('token') || 'dummy-token';

  // ... (Keep all existing logic exactly the same: fetchWorkouts, timer interval, handleAddWorkout, handleToggle, handleDeleteWorkout, startExerciseTimer, cancelTimer, toggleExpand)
  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workouts`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) { setWorkouts(await response.json()); }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  useEffect(() => {
    let interval = null;
    if (activeTimerId && timeLeft > 0) { interval = setInterval(() => setTimeLeft((t) => t - 1), 1000); }
    else if (activeTimerId && timeLeft === 0) {
      clearInterval(interval);
      const alarmSound = new Audio('/alarm.mp3'); alarmSound.play().catch(err => console.log(err));
      setTimeout(() => { alert("Time's up! Great job."); alarmSound.pause(); alarmSound.currentTime = 0; handleToggle(activeTimerId); setActiveTimerId(null); }, 500);
    }
    return () => clearInterval(interval);
  }, [activeTimerId, timeLeft]);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workouts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(newItem) });
      if (response.ok) { setNewItem({ name: '', type: 'reps', target: '' }); setShowAddForm(false); fetchWorkouts(); }
      else { /* mock logic retained */
        let points = newItem.type === 'reps' ? Number(newItem.target) : Math.max(1, Math.round((Number(newItem.target) / 60) * 5));
        setWorkouts([...workouts, { _id: Date.now().toString(), name: newItem.name, type: newItem.type, target: Number(newItem.target), points, completedDates: [] }]);
        setNewItem({ name: '', type: 'reps', target: '' }); setShowAddForm(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleToggle = async (id) => {
    setWorkouts(items => items.map(item => {
      if (item._id === id) { return { ...item, completedDates: item.completedDates.includes(today) ? item.completedDates.filter(d => d !== today) : [...item.completedDates, today] }; } return item;
    }));
    try { await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workouts/${id}/toggle`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ date: today }) }); } catch (error) {}
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;
    setWorkouts(workouts.filter(w => w._id !== id));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workouts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) { fetchWorkouts(); alert("Failed to delete."); }
    } catch (error) { fetchWorkouts(); }
  };

  const startExerciseTimer = (id, seconds) => { setActiveTimerId(id); setTimeLeft(seconds); };
  const cancelTimer = () => { setActiveTimerId(null); setTimeLeft(0); };
  const toggleExpand = (id) => setExpandedWorkoutId(prevId => prevId === id ? null : id);

  const earnedPoints = workouts.reduce((sum, item) => item.completedDates.includes(today) ? sum + item.points : sum, 0);
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;

  return (
    <div className="min-h-screen w-full bg-black text-[#EDEDED] flex flex-col items-center p-6 font-sans overflow-x-hidden">
      
      {/* Minimal Header */}
      <div className="w-full max-w-md flex items-center justify-between pb-6 border-b border-[#222]">
        <button onClick={() => navigate('/home')} className="text-[#888] hover:text-white transition-colors">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">Workout Plan</h2>
        <div className="w-6"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pt-8 pb-12">
        
        {/* Typographic Score Tracker */}
        <div className="mb-12">
          <p className="text-[#666] text-xs uppercase tracking-widest mb-2">Points Earned Today</p>
          <div className="flex items-end space-x-2">
            <span className="text-8xl font-light tracking-tighter leading-none">+{earnedPoints}</span>
          </div>
        </div>

        <div className="mb-10">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full py-4 border border-[#222] hover:border-white text-[#888] hover:text-white uppercase tracking-widest text-xs font-medium transition-colors flex items-center justify-center"
          >
            {showAddForm ? 'Cancel Entry' : <><Plus size={16} className="mr-2" strokeWidth={1.5}/> Add Exercise</>}
          </button>

          {showAddForm && (
            <form onSubmit={handleAddWorkout} className="mt-4 border-b border-[#222] pb-6 animate-fade-in">
              <div className="space-y-4 mb-6">
                <div>
                  <input required type="text" placeholder="Exercise Name (e.g. Pushups)" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]" />
                </div>
                <div className="flex space-x-6">
                  <div className="flex-1">
                    <select value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})} className="w-full bg-black text-[#EDEDED] pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light appearance-none rounded-none cursor-pointer">
                      <option value="reps">Reps</option>
                      <option value="time">Time (Secs)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input required type="number" placeholder={newItem.type === 'reps' ? "Target Reps" : "Target Secs"} value={newItem.target} onChange={e => setNewItem({...newItem, target: e.target.value})} className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-white text-black font-medium uppercase tracking-widest text-xs hover:bg-[#ddd] transition-colors">
                Save Execution
              </button>
            </form>
          )}
        </div>

        {/* Ledger-style Exercise List */}
        <div className="space-y-0">
          {workouts.length === 0 && !showAddForm ? (
            <p className="text-[#555] font-light text-center mt-10">No protocols established.</p>
          ) : (
            workouts.map((item) => {
              const isDone = item.completedDates.includes(today);
              const isActiveTimer = activeTimerId === item._id;

              return (
                <div key={item._id} className="group border-b border-[#111] hover:border-[#333] transition-colors py-5 flex flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col flex-1 min-w-0">
                      
                      <h3 
                        onClick={() => toggleExpand(item._id)}
                        className={`text-lg font-light cursor-pointer transition-all duration-300 ${
                          expandedWorkoutId === item._id ? 'break-words whitespace-normal' : 'truncate'
                        } ${isDone ? 'text-[#444] line-through' : 'text-[#EDEDED]'}`}
                      >
                        {item.name}
                      </h3>
                      
                      <div className={`text-xs mt-1.5 flex items-center font-medium tracking-wide uppercase ${isDone ? 'text-[#333]' : 'text-[#666]'}`}>
                        <span className="mr-3 text-white">{item.points} pts</span>
                        {item.type === 'reps' ? `${item.target} Reps` : `${item.target} Secs`}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {item.type === 'reps' || isDone ? (
                        <button onClick={() => handleToggle(item._id)} className={`transition-colors ${isDone ? 'text-white' : 'text-[#444] hover:text-white'}`}>
                          {isDone ? <CheckCircle2 size={24} strokeWidth={1.5} /> : <Circle size={24} strokeWidth={1.5} />}
                        </button>
                      ) : (
                        !isActiveTimer && (
                          <button onClick={() => startExerciseTimer(item._id, item.target)} className="text-[#888] hover:text-white transition-colors">
                            <Play size={24} strokeWidth={1.5} />
                          </button>
                        )
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteWorkout(item._id); }} 
                        className="text-[#444] hover:text-white transition-colors md:opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {isActiveTimer && (
                    <div className="mt-6 mb-2 flex flex-col items-start animate-fade-in pl-1">
                      <span className="text-6xl font-light tracking-tighter text-white mb-2 leading-none">
                        {formatTime(timeLeft)}
                      </span>
                      <button onClick={cancelTimer} className="text-[10px] text-[#666] hover:text-white uppercase tracking-widest border-b border-[#333] hover:border-white pb-1 transition-all">
                        Abort Protocol
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}