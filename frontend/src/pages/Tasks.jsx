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

  const token = localStorage.getItem('token');

  // Fetch Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchTasks();
  }, [token]);

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTask, type: activeTab })
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks([addedTask, ...tasks]);
        setNewTask('');
      }
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  // Toggle Complete
  const toggleComplete = async (id, currentStatus) => {
    // Optimistic UI update
    setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: !currentStatus } : t));

    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isCompleted: !currentStatus })
      });
    } catch (error) {
      console.error('Error updating task', error);
      // Revert on failure
      setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: currentStatus } : t));
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t._id !== id));

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Delete failed');
    } catch (error) {
      console.error('Error deleting task', error);
      setTasks(previousTasks); // Revert on failure
    }
  };

  const filteredTasks = tasks.filter(t => t.type === activeTab);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#1a0b2e] via-[#121212] to-[#2d1406] flex flex-col items-center p-4 md:p-6 overflow-x-hidden">
      <div className="w-full max-w-2xl flex items-center mb-6 md:mb-8 mt-2 md:mt-0">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition mr-3 md:mr-4">
          <ArrowLeft size={24} className="md:w-7 md:h-7" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-white">My Tasks</h1>
      </div>

      <div className="w-full max-w-2xl flex flex-wrap justify-center gap-2 bg-[#1e1e28] p-2 rounded-xl mb-6 shadow-lg border border-gray-800">
        {['daily (one-time)', 'daily (recurring)', 'long-term'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg text-xs md:text-sm font-semibold capitalize transition-all duration-300 ${
              activeTab === tab ? 'bg-orange-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      <form onSubmit={addTask} className="w-full max-w-2xl flex mb-6 md:mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={`Add a new ${activeTab.replace('-', ' ')} task...`}
          className="flex-1 bg-[#1e1e28] text-white px-3 md:px-4 py-3 text-sm md:text-base rounded-l-xl border border-gray-700 focus:outline-none focus:border-orange-500"
        />
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 rounded-r-xl transition flex items-center justify-center">
          <Plus size={20} className="md:w-6 md:h-6" />
        </button>
      </form>

      <div className="w-full max-w-2xl space-y-3 pb-10">
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-sm md:text-base">No tasks in this category. Add one above!</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="flex items-center justify-between bg-[#1e1e28] p-3 md:p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition shadow-md group">
              <div className="flex items-center space-x-3 md:space-x-4 overflow-hidden">
                <button 
                  onClick={() => toggleComplete(task._id, task.isCompleted)}
                  className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center border transition-all duration-300 ${
                    task.isCompleted ? 'bg-orange-500 border-orange-500' : 'border-gray-500 hover:border-orange-500'
                  }`}
                >
                  {task.isCompleted && <Check size={14} className="text-white md:w-4 md:h-4" />}
                </button>
                <span className={`text-sm md:text-lg truncate transition-all duration-300 ${task.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                  {task.title}
                </span>
              </div>
              <button onClick={() => deleteTask(task._id)} className="text-gray-600 hover:text-red-500 p-2 md:p-0 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Trash2 size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}