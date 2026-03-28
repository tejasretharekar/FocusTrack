// frontend/src/pages/Challenges.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, User, Users, Check, X, ShieldAlert } from 'lucide-react';

export default function Challenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); 
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newChallenge, setNewChallenge] = useState({ title: '', type: 'personal', targetDays: '', opponentEmail: '' });
  const [expandedChallengeId, setExpandedChallengeId] = useState(null);

  const token = localStorage.getItem('token') || 'dummy-token';
  const myMockId = 'my-id'; 

  // ... (All logic remains strictly identical)
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/challenges`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) setChallenges(data); else loadMockData();
        } else { loadMockData(); }
      } catch (error) { loadMockData(); } finally { setIsLoading(false); }
    };
    fetchChallenges();
  }, [token]);

  const loadMockData = () => {
    setChallenges([
      { _id: '1', title: '30 Days No Sugar', type: 'personal', status: 'active', targetDays: 30, creatorProgress: 12, opponentProgress: 0, creator: { _id: myMockId, name: 'Me' }, opponent: null },
      { _id: '2', title: '10,000 Steps Daily', type: 'friend', status: 'active', targetDays: 7, creatorProgress: 4, opponentProgress: 6, creator: { _id: myMockId, name: 'Me' }, opponent: { _id: 'f1', name: 'Alex' } },
      { _id: '3', title: 'Read 20 Pages', type: 'friend', status: 'pending', targetDays: 14, creatorProgress: 0, opponentProgress: 0, creator: { _id: 'f2', name: 'Jordan' }, opponent: { _id: myMockId, name: 'Me' } }
    ]);
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/challenges`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(newChallenge)
      });
      if (response.ok) { setNewChallenge({ title: '', type: 'personal', targetDays: '', opponentEmail: '' }); setShowAddForm(false); } 
      else {
        const mockNew = { _id: Date.now().toString(), title: newChallenge.title, type: newChallenge.type, status: newChallenge.type === 'friend' ? 'pending' : 'active', targetDays: Number(newChallenge.targetDays), creatorProgress: 0, opponentProgress: 0, creator: { _id: myMockId, name: 'Me' }, opponent: newChallenge.type === 'friend' ? { _id: 'f3', name: newChallenge.opponentEmail } : null };
        setChallenges([...challenges, mockNew]); setNewChallenge({ title: '', type: 'personal', targetDays: '', opponentEmail: '' }); setShowAddForm(false);
      }
    } catch (error) {}
  };

  const handleUpdateProgress = async (id) => {
    setChallenges(chals => chals.map(c => {
      if (c._id === id) {
        const isCreator = c.creator._id === myMockId;
        if (isCreator && c.creatorProgress < c.targetDays) return { ...c, creatorProgress: c.creatorProgress + 1 };
        if (!isCreator && c.opponentProgress < c.targetDays) return { ...c, opponentProgress: c.opponentProgress + 1 };
      }
      return c;
    }));
  };

  const handleAcceptInvite = async (id) => { setChallenges(chals => chals.map(c => c._id === id ? { ...c, status: 'active' } : c)); setActiveTab('active'); };
  const toggleExpand = (id) => setExpandedChallengeId(prevId => prevId === id ? null : id);

  const activeChallenges = challenges.filter(c => c.status === 'active' || c.status === 'completed');
  const pendingInvites = challenges.filter(c => c.status === 'pending' && c.opponent?._id === myMockId);
  const calcPercent = (prog, target) => Math.min(100, Math.round((prog / target) * 100));

  return (
    <div className="min-h-screen w-full bg-black text-[#EDEDED] flex flex-col items-center p-6 font-sans overflow-x-hidden">
      
      {/* Minimal Header */}
      <div className="w-full max-w-md flex items-center justify-between pb-6 border-b border-[#222]">
        <button onClick={() => navigate('/home')} className="text-[#888] hover:text-white transition-colors">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className="text-sm font-medium tracking-[0.2em] text-[#888] uppercase">Challenges</h2>
        <div className="w-6"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pt-8 pb-12">
        
        {/* Underlined Text Tabs */}
        <div className="flex space-x-6 border-b border-[#222] mb-10">
          <button 
            onClick={() => setActiveTab('active')}
            className={`pb-3 text-xs tracking-widest uppercase transition-colors ${activeTab === 'active' ? 'text-white border-b-2 border-white' : 'text-[#555] hover:text-[#aaa]'}`}
          >
            Active Operations
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`pb-3 text-xs tracking-widest uppercase transition-colors relative ${activeTab === 'pending' ? 'text-white border-b-2 border-white' : 'text-[#555] hover:text-[#aaa]'}`}
          >
            Pending Invites
            {pendingInvites.length > 0 && <span className="absolute top-0 -right-3 w-1.5 h-1.5 bg-white rounded-full"></span>}
          </button>
        </div>

        {activeTab === 'active' && (
          <div className="mb-10">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full py-4 border border-[#222] hover:border-white text-[#888] hover:text-white uppercase tracking-widest text-xs font-medium transition-colors flex items-center justify-center"
            >
              {showAddForm ? 'Cancel Entry' : <><Plus size={16} className="mr-2" strokeWidth={1.5} /> Initiate Challenge</>}
            </button>

            {showAddForm && (
              <form onSubmit={handleCreateChallenge} className="mt-4 border-b border-[#222] pb-6 animate-fade-in">
                <div className="space-y-4 mb-6">
                  <div>
                    <input required type="text" placeholder="Title (e.g. Reading Protocol)" value={newChallenge.title} onChange={e => setNewChallenge({...newChallenge, title: e.target.value})} className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]" />
                  </div>
                  <div className="flex space-x-6">
                    <div className="flex-1">
                      <select value={newChallenge.type} onChange={e => setNewChallenge({...newChallenge, type: e.target.value})} className="w-full bg-black text-[#EDEDED] pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light appearance-none cursor-pointer">
                        <option value="personal">Solo Target</option>
                        <option value="friend">Versus Target</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <input required type="number" min="1" placeholder="Target Days" value={newChallenge.targetDays} onChange={e => setNewChallenge({...newChallenge, targetDays: e.target.value})} className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]" />
                    </div>
                  </div>
                  {newChallenge.type === 'friend' && (
                    <div className="animate-fade-in">
                      <input required type="email" placeholder="Opponent ID (Email)" value={newChallenge.opponentEmail} onChange={e => setNewChallenge({...newChallenge, opponentEmail: e.target.value})} className="w-full bg-transparent text-white pb-2 border-b border-[#333] focus:outline-none focus:border-white font-light placeholder-[#555]" />
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full py-3 bg-white text-black font-medium uppercase tracking-widest text-xs hover:bg-[#ddd] transition-colors">
                  {newChallenge.type === 'friend' ? 'Dispatch Invite' : 'Commence Protocol'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Ledger List */}
        <div className="space-y-0">
          {isLoading ? (
            <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#333] border-t-white rounded-full animate-spin"></div></div>
          ) : activeTab === 'active' ? (
            activeChallenges.length === 0 ? (
              <p className="text-[#555] font-light text-center mt-10">No active operations.</p>
            ) : (
              activeChallenges.map(chal => {
                const isCreator = chal.creator._id === myMockId;
                const myProgress = isCreator ? chal.creatorProgress : chal.opponentProgress;
                const theirProgress = isCreator ? chal.opponentProgress : chal.creatorProgress;
                const opponentName = isCreator ? chal.opponent?.name : chal.creator?.name;

                return (
                  <div key={chal._id} className="border-b border-[#111] hover:border-[#333] transition-colors py-6">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 
                          onClick={() => toggleExpand(chal._id)}
                          className={`text-lg font-light cursor-pointer transition-all duration-300 text-white ${expandedChallengeId === chal._id ? 'break-words whitespace-normal' : 'truncate'}`}
                        >
                          {chal.title}
                        </h3>
                        <div className="flex items-center text-xs font-medium tracking-wide uppercase text-[#666] mt-1.5">
                          {chal.type === 'personal' ? <><User size={12} strokeWidth={1.5} className="mr-1.5"/> Solo</> : <><Users size={12} strokeWidth={1.5} className="mr-1.5"/> VS {opponentName}</>}
                        </div>
                      </div>
                      
                      {myProgress < chal.targetDays ? (
                        <button onClick={() => handleUpdateProgress(chal._id)} className="shrink-0 text-xs uppercase tracking-widest border-b border-[#333] hover:border-white pb-1 transition-colors text-[#888] hover:text-white">
                          Log +1
                        </button>
                      ) : (
                        <span className="shrink-0 text-xs font-medium tracking-widest uppercase text-white">Cleared</span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs uppercase tracking-widest text-[#555]">My Progress</span>
                          <span className="text-sm font-light text-white">{myProgress} <span className="text-[#444]">/ {chal.targetDays}</span></span>
                        </div>
                        <div className="w-full h-[1px] bg-[#111] relative">
                          <div className="absolute top-0 left-0 h-[1px] bg-white transition-all duration-500" style={{ width: `${calcPercent(myProgress, chal.targetDays)}%` }}></div>
                        </div>
                      </div>

                      {chal.type === 'friend' && (
                        <div>
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-xs uppercase tracking-widest text-[#444] truncate pr-2">Opponent: {opponentName}</span>
                            <span className="text-sm font-light text-[#666]">{theirProgress} <span className="text-[#333]">/ {chal.targetDays}</span></span>
                          </div>
                          <div className="w-full h-[1px] bg-[#111] relative">
                            <div className="absolute top-0 left-0 h-[1px] bg-[#555] transition-all duration-500" style={{ width: `${calcPercent(theirProgress, chal.targetDays)}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )
          ) : (
            pendingInvites.length === 0 ? (
              <p className="text-[#555] font-light text-center mt-10">No pending operations.</p>
            ) : (
              pendingInvites.map(chal => (
                <div key={chal._id} className="border-b border-[#111] py-6">
                  <h3 onClick={() => toggleExpand(chal._id)} className={`text-lg font-light text-white mb-1 cursor-pointer transition-all duration-300 ${expandedChallengeId === chal._id ? 'break-words whitespace-normal' : 'truncate'}`}>
                    {chal.title}
                  </h3>
                  <p className="text-xs font-medium tracking-wide uppercase text-[#666] mb-6">Sender: {chal.creator.name} — Target: {chal.targetDays} Days</p>
                  
                  <div className="flex space-x-4">
                    <button onClick={() => handleAcceptInvite(chal._id)} className="flex-1 py-3 bg-white text-black text-xs font-medium tracking-widest uppercase transition-colors hover:bg-[#ddd]">
                      Accept
                    </button>
                    <button onClick={() => setChallenges(chals => chals.filter(c => c._id !== chal._id))} className="flex-1 py-3 border border-[#333] text-[#888] text-xs font-medium tracking-widest uppercase transition-colors hover:border-white hover:text-white">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>

      </div>
    </div>
  );
}