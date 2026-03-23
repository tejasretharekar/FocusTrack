// frontend/src/pages/Workout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Added Trash2 to the imports
import { ArrowLeft, Plus, CheckCircle2, Circle, Play, Timer, Trophy, Trash2 } from 'lucide-react';

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

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workouts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      }
    } catch (error) {
      console.error('Failed to fetch workouts', error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    let interval = null;
    if (activeTimerId && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (activeTimerId && timeLeft === 0) {
      clearInterval(interval);
      const alarmSound = new Audio('/alarm.mp3');
      alarmSound.play().catch(err => console.log(err));

      setTimeout(() => {
        alert("Time's up! Great job.");
        alarmSound.pause();
        alarmSound.currentTime = 0;
        handleToggle(activeTimerId);
        setActiveTimerId(null);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [activeTimerId, timeLeft]);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });
      
      if (response.ok) {
        setNewItem({ name: '', type: 'reps', target: '' });
        setShowAddForm(false);
        fetchWorkouts();
      } else {
        let calculatedPoints = 0;
        if (newItem.type === 'reps') {
          calculatedPoints = Number(newItem.target);
        } else {
          calculatedPoints = Math.max(1, Math.round((Number(newItem.target) / 60) * 5));
        }

        const mockItem = {
          _id: Date.now().toString(),
          name: newItem.name,
          type: newItem.type,
          target: Number(newItem.target),
          points: calculatedPoints,
          completedDates: []
        };
        setWorkouts([...workouts, mockItem]);
        setNewItem({ name: '', type: 'reps', target: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to add workout', error);
    }
  };

  const handleToggle = async (id) => {
    setWorkouts(items => items.map(item => {
      if (item._id === id) {
        const isDone = item.completedDates.includes(today);
        const updatedDates = isDone 
          ? item.completedDates.filter(d => d !== today) 
          : [...item.completedDates, today];
        return { ...item, completedDates: updatedDates };
      }
      return item;
    }));

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workouts/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ date: today })
      });
    } catch (error) {
      console.error('Failed to toggle', error);
    }
  };

  // NEW: Handle Delete Workout
  const handleDeleteWorkout = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;
    
    // Optimistic UI update
    setWorkouts(workouts.filter(w => w._id !== id));
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workouts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        // Revert if deletion fails on the server
        fetchWorkouts();
        alert("Failed to delete the exercise.");
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      fetchWorkouts();
    }
  };

  const startExerciseTimer = (id, seconds) => {
    setActiveTimerId(id);
    setTimeLeft(seconds);
  };

  const cancelTimer = () => {
    setActiveTimerId(null);
    setTimeLeft(0);
  };

  const toggleExpand = (id) => {
    setExpandedWorkoutId(prevId => prevId === id ? null : id);
  };

  const earnedPoints = workouts.reduce((sum, item) => {
    return item.completedDates.includes(today) ? sum + item.points : sum;
  }, 0);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#121212] via-[#1a0b2e] to-[#0a0a0a] flex flex-col items-center p-4 md:p-6 overflow-x-hidden box-border">
      
      <div className="w-full max-w-md flex items-center justify-between mb-6 mt-2 md:mt-0">
        <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-white transition p-2">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider">WORKOUT PLAN</h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pb-12">
        
        <div className="bg-gradient-to-r from-focusPurple to-purple-700 rounded-2xl p-6 shadow-xl mb-8 flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm font-medium mb-1 uppercase tracking-wider">Points Earned Today</p>
            <div className="text-4xl font-bold text-white tracking-tight">
              +{earnedPoints}
            </div>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Trophy size={32} className="text-white" />
          </div>
        </div>

        <div className="mb-6">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full py-3 bg-[#1e1e2e] hover:bg-[#252538] text-focusPurple rounded-xl font-bold flex items-center justify-center transition border border-gray-800"
          >
            <Plus size={20} className="mr-2" />
            {showAddForm ? 'CANCEL' : 'ADD EXERCISE'}
          </button>

          {showAddForm && (
            <form onSubmit={handleAddWorkout} className="mt-4 bg-[#1e1e28] p-5 rounded-2xl border border-gray-800 animate-fade-in box-border">
              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Exercise Name</label>
                  <input required type="text" placeholder="e.g. Pushups, Plank" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-focusPurple box-border" />
                </div>
                
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Type</label>
                    <select value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-focusPurple box-border appearance-none">
                      <option value="reps">Reps</option>
                      <option value="time">Time (Seconds)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Target</label>
                    <input required type="number" placeholder={newItem.type === 'reps' ? "e.g., 15" : "e.g., 60"} value={newItem.target} onChange={e => setNewItem({...newItem, target: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-focusPurple box-border" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-focusPurple hover:bg-purple-600 text-white rounded-lg font-bold transition shadow-lg">
                SAVE EXERCISE
              </button>
            </form>
          )}
        </div>

        <div className="space-y-3">
          {workouts.length === 0 && !showAddForm ? (
            <p className="text-center text-gray-500 mt-10">Your workout plan is empty. Time to build some muscle!</p>
          ) : (
            workouts.map((item) => {
              const isDone = item.completedDates.includes(today);
              const isActiveTimer = activeTimerId === item._id;

              return (
                <div key={item._id} className={`flex flex-col p-4 md:p-5 rounded-2xl transition border ${isDone ? 'bg-[#1a1a2e] border-purple-900/50' : 'bg-[#1e1e28] border-gray-800'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col flex-1 min-w-0">
                      
                      <h3 
                        onClick={() => toggleExpand(item._id)}
                        className={`font-bold text-lg cursor-pointer transition-all duration-300 ${
                          expandedWorkoutId === item._id ? 'break-words whitespace-normal' : 'truncate'
                        } ${isDone ? 'text-purple-200 line-through opacity-70' : 'text-white'}`}
                      >
                        {item.name}
                      </h3>
                      
                      <p className={`text-sm flex items-center mt-1 truncate ${isDone ? 'text-purple-400/60' : 'text-gray-400'}`}>
                        {item.type === 'reps' ? (
                          <><Circle size={14} className="mr-1 shrink-0"/> {item.target} Reps</>
                        ) : (
                          <><Timer size={14} className="mr-1 shrink-0"/> {item.target} Seconds</>
                        )}
                        <span className="mx-2">•</span>
                        <span className="text-focusPurple shrink-0">{item.points} pts</span>
                      </p>
                    </div>

                    {/* UPDATED: Added a gap and the Trash icon here */}
                    <div className="flex items-center gap-3 shrink-0">
                      {item.type === 'reps' || isDone ? (
                        <button onClick={() => handleToggle(item._id)} className={`transition-colors ${isDone ? 'text-focusPurple' : 'text-gray-500 hover:text-focusPurple'}`}>
                          {isDone ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                        </button>
                      ) : (
                        !isActiveTimer && (
                          <button onClick={() => startExerciseTimer(item._id, item.target)} className="w-10 h-10 rounded-full bg-focusPurple text-white flex items-center justify-center hover:bg-purple-600 transition shadow-lg">
                            <Play size={20} className="ml-1" />
                          </button>
                        )
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteWorkout(item._id); }} 
                        className="text-gray-600 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>

                  {isActiveTimer && (
                    <div className="mt-4 p-4 bg-[#121212] rounded-xl border border-purple-900/50 flex flex-col items-center animate-fade-in">
                      <span className="text-4xl font-bold text-white tracking-tighter mb-4">
                        {formatTime(timeLeft)}
                      </span>
                      <button onClick={cancelTimer} className="text-xs text-gray-400 hover:text-white uppercase tracking-wider">
                        Cancel Timer
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