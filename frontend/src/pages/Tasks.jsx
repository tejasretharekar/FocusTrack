// frontend/src/pages/Tasks.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function Tasks() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daily (one-time)');
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const token = localStorage.getItem('token');

  // ... (Keep all existing useEffect, addTask, toggleComplete, deleteTask, toggleExpand logic exactly the same)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.ok) { setTasks(await response.json()); }
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    if (token) fetchTasks();
  }, [token]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTask, type: activeTab })
      });
      if (response.ok) { setTasks([await response.json(), ...tasks]); setNewTask(''); }
    } catch (error) { console.error(error); }
  };

  const toggleComplete = async (id, currentStatus) => {
    setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: !currentStatus } : t));
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ isCompleted: !currentStatus }) });
    } catch (error) { setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: currentStatus } : t)); }
  };

  const deleteTask = async (id) => {
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t._id !== id));
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error('Delete failed');
    } catch (error) { setTasks(previousTasks); }
  };

  const toggleExpand = (id) => setExpandedTaskId(prevId => prevId === id ? null : id);
  const filteredTasks = tasks.filter(t => t.type === activeTab);

  return (
    <div className="min-h-screen w-full bg-black text-[#EDEDED] flex flex-col items-center p-6 font-sans">
      
      {/* Minimal Header */}
      <div className="w-full max-w-2xl flex items-center justify-between pb-6 border-b border-[#222] mb-8">
        <button onClick={() => navigate('/home')} className="text-[#888] hover:text-white transition-colors">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h1 className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">My Tasks</h1>
        <div className="w-6"></div>
      </div>

      {/* Underlined Text Tabs instead of pills */}
      <div className="w-full max-w-2xl flex space-x-6 border-b border-[#222] mb-10 overflow-x-auto no-scrollbar">
        {['daily (one-time)', 'daily (recurring)', 'long-term'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs tracking-widest uppercase transition-colors whitespace-nowrap ${
              activeTab === tab ? 'text-white border-b-2 border-white' : 'text-[#555] hover:text-[#aaa]'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Invisible Input Line */}
      <form onSubmit={addTask} className="w-full max-w-2xl flex mb-12 border-b border-[#333] focus-within:border-white transition-colors pb-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={`Add a new ${activeTab.replace('-', ' ')} target...`}
          className="flex-1 min-w-0 bg-transparent text-white px-2 py-2 text-lg font-light focus:outline-none placeholder-[#444]"
        />
        <button type="submit" className="text-[#666] hover:text-white px-4 transition-colors flex items-center justify-center shrink-0">
          <Plus size={24} strokeWidth={1.5} />
        </button>
      </form>

      {/* Ledger-style Task List */}
      <div className="w-full max-w-2xl pb-10">
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <div className="w-6 h-6 border-2 border-[#333] border-t-white rounded-full animate-spin"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <p className="text-[#555] font-light tracking-wide text-center mt-10">No tasks on record.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="group flex items-start justify-between py-4 border-b border-[#111] hover:border-[#333] transition-colors gap-4">
              
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                <button 
                  onClick={() => toggleComplete(task._id, task.isCompleted)}
                  className={`mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center border transition-all duration-300 ${
                    task.isCompleted ? 'bg-white border-white text-black' : 'border-[#444] hover:border-white'
                  }`}
                >
                  {task.isCompleted && <Check size={14} strokeWidth={3} />}
                </button>
                
                <span 
                  onClick={() => toggleExpand(task._id)}
                  className={`block text-lg font-light cursor-pointer transition-all duration-300 ${
                    expandedTaskId === task._id ? 'break-words whitespace-normal' : 'truncate'
                  } ${task.isCompleted ? 'text-[#444] line-through' : 'text-[#EDEDED]'}`}
                >
                  {task.title}
                </span>
              </div>

              <button onClick={() => deleteTask(task._id)} className="shrink-0 text-[#444] hover:text-white p-2 md:p-0 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}