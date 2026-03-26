// frontend/src/pages/Diet.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export default function Diet() {
  const navigate = useNavigate();
  const [dietItems, setDietItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', calories: '' });
  const [expandedDietId, setExpandedDietId] = useState(null);
  
  const today = new Date().toISOString().split('T')[0];
  const token = localStorage.getItem('token'); 

  // ... (Keep all existing logic exactly the same: fetchDiet, handleAddItem, handleToggle, handleDelete, toggleExpand)
  const fetchDiet = async () => {
    try {
      const response = await fetch(`${API_URL}/diet`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) { setDietItems(await response.json()); }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };
  useEffect(() => { if (token) fetchDiet(); }, [token]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/diet`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(newItem) });
      if (response.ok) { setDietItems([...dietItems, await response.json()]); setNewItem({ name: '', quantity: '', unit: '', calories: '' }); setShowAddForm(false); }
    } catch (error) { console.error(error); }
  };

  const handleToggle = async (id) => {
    setDietItems(items => items.map(item => {
      if (item._id === id) { return { ...item, completedDates: item.completedDates.includes(today) ? item.completedDates.filter(d => d !== today) : [...item.completedDates, today] }; } return item;
    }));
    try { await fetch(`${API_URL}/diet/${id}/toggle`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ date: today }) }); } catch (error) { fetchDiet(); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this diet item?")) return;
    const previousItems = [...dietItems];
    setDietItems(dietItems.filter(item => item._id !== id));
    try {
      const response = await fetch(`${API_URL}/diet/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error('Delete failed');
    } catch (error) { setDietItems(previousItems); }
  };

  const toggleExpand = (e, id) => { e.stopPropagation(); setExpandedDietId(prevId => prevId === id ? null : id); };

  const totalCalories = dietItems.reduce((sum, item) => sum + Number(item.calories), 0);
  const consumedCalories = dietItems.reduce((sum, item) => item.completedDates.includes(today) ? sum + Number(item.calories) : sum, 0);

  return (
    <div className="min-h-screen w-full bg-black text-[#EDEDED] flex flex-col items-center p-6 font-sans overflow-x-hidden">
      
      {/* Minimal Header */}
      <div className="w-full max-w-md flex items-center justify-between pb-6 border-b border-[#222]">
        <button onClick={() => navigate('/home')} className="text-[#888] hover:text-white transition-colors">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">Diet Plan</h2>
        <div className="w-6"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pt-8 pb-12">
        
        {/* Typographic Macro Tracker */}
        <div className="mb-12">
          <p className="text-[#666] text-xs uppercase tracking-widest mb-2">Today's Intake</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-8xl font-light tracking-tighter leading-none">{consumedCalories}</span>
            <span className="text-2xl text-[#555] font-light">/ {totalCalories} kcal</span>
          </div>
        </div>

        <div className="mb-10">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full py-4 border border-[#222] hover:border-white text-[#888] hover:text-white uppercase tracking-widest text-xs font-medium transition-colors flex items-center justify-center"
          >
            {showAddForm ? 'Cancel Entry' : <><Plus size={16} className="mr-2" strokeWidth={1.5}/> Add Diet Target</>}
          </button>

          {showAddForm && (
            <form onSubmit={handleAddItem} className="mt-4 border-b border-[#222] pb-6 animate-fade-in">
              <div className="space-y-4 mb-6">
                <div>
                  <input required type="text" placeholder="Item Name (e.g. Eggs)" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]" />
                </div>
                <div className="flex space-x-6">
                  <div className="flex-1">
                    <input required type="number" placeholder="Qty" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]" />
                  </div>
                  <div className="flex-1">
                    <input required type="text" placeholder="Unit" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]" />
                  </div>
                </div>
                <div>
                  <input required type="number" placeholder="Calories" value={newItem.calories} onChange={e => setNewItem({...newItem, calories: e.target.value})} className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-white text-black font-medium uppercase tracking-widest text-xs hover:bg-[#ddd] transition-colors">
                Save Nutrition
              </button>
            </form>
          )}
        </div>

        {/* Ledger-style Diet List */}
        <div className="space-y-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#333] border-t-white rounded-full animate-spin"></div>
            </div>
          ) : dietItems.length === 0 && !showAddForm ? (
            <p className="text-[#555] font-light text-center mt-10">No nutrition targets logged.</p>
          ) : (
            dietItems.map((item) => {
              const isDone = item.completedDates.includes(today);
              return (
                <div 
                  key={item._id}
                  onClick={() => handleToggle(item._id)}
                  className="group flex items-center justify-between gap-4 py-5 border-b border-[#111] hover:border-[#333] transition-colors cursor-pointer"
                >
                  <div className="flex items-start flex-1 min-w-0">
                    <button className={`mt-0.5 mr-4 shrink-0 transition-colors ${isDone ? 'text-white' : 'text-[#444] group-hover:text-white'}`}>
                      {isDone ? <CheckCircle2 size={20} strokeWidth={2} /> : <Circle size={20} strokeWidth={1.5} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      
                      <h3 
                        onClick={(e) => toggleExpand(e, item._id)}
                        className={`text-lg font-light transition-all duration-300 ${
                          expandedDietId === item._id ? 'break-words whitespace-normal' : 'truncate'
                        } ${isDone ? 'text-[#444] line-through' : 'text-[#EDEDED]'}`}
                      >
                        {item.name}
                      </h3>
                      
                      <p className={`text-xs mt-1 uppercase tracking-wider font-medium ${isDone ? 'text-[#333]' : 'text-[#666]'}`}>
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 shrink-0">
                    <div className={`font-light text-lg tracking-tight ${isDone ? 'text-[#444]' : 'text-white'}`}>
                      {item.calories} <span className="text-xs text-[#666] uppercase tracking-widest ml-1">kcal</span>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, item._id)}
                      className="text-[#444] hover:text-white transition-colors md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} strokeWidth={1.5} />
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