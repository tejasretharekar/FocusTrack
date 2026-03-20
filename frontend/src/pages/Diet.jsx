// frontend/src/pages/Diet.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2, Circle, Flame, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export default function Diet() {
  const navigate = useNavigate();
  const [dietItems, setDietItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', calories: '' });
  const today = new Date().toISOString().split('T')[0];
  const token = localStorage.getItem('token'); 

  const fetchDiet = async () => {
    try {
      const response = await fetch(`${API_URL}/diet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDietItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch diet items', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDiet();
  }, [token]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/diet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });
      
      if (response.ok) {
        const addedItem = await response.json();
        setDietItems([...dietItems, addedItem]);
        setNewItem({ name: '', quantity: '', unit: '', calories: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to add item', error);
    }
  };

  const handleToggle = async (id) => {
    // Optimistic UI update
    setDietItems(items => items.map(item => {
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
      await fetch(`${API_URL}/diet/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ date: today })
      });
    } catch (error) {
      console.error('Failed to toggle', error);
      fetchDiet(); // Revert on failure
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents the item from toggling completion when clicking the trash can
    
    if (!window.confirm("Are you sure you want to delete this diet item?")) return;

    // Optimistic UI update
    const previousItems = [...dietItems];
    setDietItems(dietItems.filter(item => item._id !== id));

    try {
      const response = await fetch(`${API_URL}/diet/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Delete failed');
    } catch (error) {
      console.error('Failed to delete item', error);
      setDietItems(previousItems); // Revert on failure
    }
  };

  const totalCalories = dietItems.reduce((sum, item) => sum + Number(item.calories), 0);
  const consumedCalories = dietItems.reduce((sum, item) => {
    return item.completedDates.includes(today) ? sum + Number(item.calories) : sum;
  }, 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#121212] via-[#1a1a24] to-[#0d1b1e] flex flex-col items-center p-4 md:p-6 overflow-x-hidden box-border">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 mt-2 md:mt-0">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition p-2">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider">DIET PLAN</h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pb-12">
        
        {/* Calorie Summary Card */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8 flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1 uppercase tracking-wider">Today's Calories</p>
            <div className="text-3xl font-bold text-white">
              {consumedCalories} <span className="text-lg text-orange-200 font-normal">/ {totalCalories} kcal</span>
            </div>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Flame size={32} className="text-white" />
          </div>
        </div>

        {/* Add Button & Form */}
        <div className="mb-6">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full py-3 bg-[#242430] hover:bg-[#2a2a38] text-orange-500 rounded-xl font-bold flex items-center justify-center transition border border-gray-800"
          >
            <Plus size={20} className="mr-2" />
            {showAddForm ? 'CANCEL' : 'ADD DIET TARGET'}
          </button>

          {showAddForm && (
            <form onSubmit={handleAddItem} className="mt-4 bg-[#1e1e28] p-5 rounded-2xl border border-gray-800 animate-fade-in box-border">
              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Item Name</label>
                  <input required type="text" placeholder="e.g. Eggs" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 box-border" />
                </div>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Qty</label>
                    <input required type="number" placeholder="6" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 box-border" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Unit</label>
                    <input required type="text" placeholder="items" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 box-border" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Calories</label>
                  <input required type="number" placeholder="450" value={newItem.calories} onChange={e => setNewItem({...newItem, calories: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 box-border" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition shadow-lg">
                SAVE ITEM
              </button>
            </form>
          )}
        </div>

        {/* Diet List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : dietItems.length === 0 && !showAddForm ? (
            <p className="text-center text-gray-500 mt-10">Your diet plan is empty. Add some items to track!</p>
          ) : (
            dietItems.map((item) => {
              const isDone = item.completedDates.includes(today);
              return (
                <div 
                  key={item._id}
                  onClick={() => handleToggle(item._id)}
                  className={`group flex items-center justify-between p-4 md:p-5 rounded-2xl cursor-pointer transition border ${isDone ? 'bg-[#1a2e20] border-green-900/50' : 'bg-[#1e1e28] border-gray-800 hover:border-gray-600'}`}
                >
                  <div className="flex items-center">
                    <button className={`mr-4 transition-colors ${isDone ? 'text-green-500' : 'text-gray-500 hover:text-orange-500'}`}>
                      {isDone ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                    </button>
                    <div>
                      <h3 className={`font-bold text-lg ${isDone ? 'text-green-100 line-through opacity-70' : 'text-white'}`}>
                        {item.name}
                      </h3>
                      <p className={`text-sm ${isDone ? 'text-green-400/60' : 'text-gray-400'}`}>
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`font-semibold ${isDone ? 'text-green-500/70' : 'text-orange-500'}`}>
                      {item.calories} <span className="text-xs font-normal opacity-70">kcal</span>
                    </div>
                    {/* Delete Button - Appears on hover for desktop */}
                    <button 
                      onClick={(e) => handleDelete(e, item._id)}
                      className="text-gray-600 hover:text-red-500 p-2 md:opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}