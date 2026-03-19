// frontend/src/pages/Challenges.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Swords, Plus, User, Users, Check, X, ShieldAlert } from 'lucide-react';

export default function Challenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newChallenge, setNewChallenge] = useState({ title: '', type: 'personal', targetDays: '', opponentEmail: '' });

  const token = localStorage.getItem('token') || 'dummy-token';
  const myMockId = 'my-id'; // Used to determine if we are the creator or opponent in dev mode

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/challenges', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setChallenges(data);
          } else {
            loadMockData();
          }
        } else {
          loadMockData(); // Dev mode bypass
        }
      } catch (error) {
        console.error('Failed to fetch challenges', error);
        loadMockData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, [token]);

  const loadMockData = () => {
    console.warn("Using Dev Mode Mock Data for Challenges");
    setChallenges([
      {
        _id: '1', title: '30 Days No Sugar', type: 'personal', status: 'active', targetDays: 30, creatorProgress: 12, opponentProgress: 0,
        creator: { _id: myMockId, name: 'Me' }, opponent: null
      },
      {
        _id: '2', title: '10,000 Steps Daily', type: 'friend', status: 'active', targetDays: 7, creatorProgress: 4, opponentProgress: 6,
        creator: { _id: myMockId, name: 'Me' }, opponent: { _id: 'f1', name: 'Alex' }
      },
      {
        _id: '3', title: 'Read 20 Pages', type: 'friend', status: 'pending', targetDays: 14, creatorProgress: 0, opponentProgress: 0,
        creator: { _id: 'f2', name: 'Jordan' }, opponent: { _id: myMockId, name: 'Me' }
      }
    ]);
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newChallenge)
      });
      
      if (response.ok) {
        setNewChallenge({ title: '', type: 'personal', targetDays: '', opponentEmail: '' });
        setShowAddForm(false);
        // fetchChallenges(); -> In a real app we'd refetch
      } else {
        // DEV MODE BYPASS
        const mockNew = {
          _id: Date.now().toString(),
          title: newChallenge.title,
          type: newChallenge.type,
          status: newChallenge.type === 'friend' ? 'pending' : 'active',
          targetDays: Number(newChallenge.targetDays),
          creatorProgress: 0, opponentProgress: 0,
          creator: { _id: myMockId, name: 'Me' },
          opponent: newChallenge.type === 'friend' ? { _id: 'f3', name: newChallenge.opponentEmail } : null
        };
        setChallenges([...challenges, mockNew]);
        setNewChallenge({ title: '', type: 'personal', targetDays: '', opponentEmail: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to create', error);
    }
  };

  const handleUpdateProgress = async (id) => {
    // Optimistic UI update
    setChallenges(chals => chals.map(c => {
      if (c._id === id) {
        const isCreator = c.creator._id === myMockId;
        if (isCreator && c.creatorProgress < c.targetDays) return { ...c, creatorProgress: c.creatorProgress + 1 };
        if (!isCreator && c.opponentProgress < c.targetDays) return { ...c, opponentProgress: c.opponentProgress + 1 };
      }
      return c;
    }));
    // Real app would send PUT to /api/challenges/:id/progress here
  };

  const handleAcceptInvite = async (id) => {
    setChallenges(chals => chals.map(c => c._id === id ? { ...c, status: 'active' } : c));
    setActiveTab('active');
    // Real app would send PUT to /api/challenges/:id/accept here
  };

  // Filter logic
  const activeChallenges = challenges.filter(c => c.status === 'active' || c.status === 'completed');
  const pendingInvites = challenges.filter(c => c.status === 'pending' && c.opponent?._id === myMockId);

  const calcPercent = (prog, target) => Math.min(100, Math.round((prog / target) * 100));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#121212] via-[#1a0b2e] to-[#0a0a0a] flex flex-col items-center p-4 md:p-6 overflow-x-hidden box-border">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 mt-2 md:mt-0">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition p-2">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider flex items-center">
          <Swords className="text-focusPurple mr-2" size={24} />
          CHALLENGES
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col pb-12">
        
        {/* Custom Tab Switcher */}
        <div className="flex bg-[#1e1e28] rounded-xl p-1 mb-6 border border-gray-800">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'active' ? 'bg-focusPurple text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
          >
            ACTIVE
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all relative ${activeTab === 'pending' ? 'bg-focusPurple text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
          >
            INVITES
            {pendingInvites.length > 0 && (
              <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Add Challenge Section (Only in Active Tab) */}
        {activeTab === 'active' && (
          <div className="mb-6">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full py-3 bg-[#1e1e2e] hover:bg-[#252538] text-focusPurple rounded-xl font-bold flex items-center justify-center transition border border-gray-800"
            >
              <Plus size={20} className="mr-2" />
              {showAddForm ? 'CANCEL' : 'NEW CHALLENGE'}
            </button>

            {showAddForm && (
              <form onSubmit={handleCreateChallenge} className="mt-4 bg-[#1e1e28] p-5 rounded-2xl border border-gray-800 animate-fade-in box-border">
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Title</label>
                    <input required type="text" placeholder="e.g., Read 30 Days" value={newChallenge.title} onChange={e => setNewChallenge({...newChallenge, title: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-focusPurple box-border" />
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Type</label>
                      <select value={newChallenge.type} onChange={e => setNewChallenge({...newChallenge, type: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-focusPurple box-border appearance-none">
                        <option value="personal">Personal</option>
                        <option value="friend">Friend VS</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Target (Days)</label>
                      <input required type="number" min="1" placeholder="e.g., 30" value={newChallenge.targetDays} onChange={e => setNewChallenge({...newChallenge, targetDays: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-focusPurple box-border" />
                    </div>
                  </div>

                  {newChallenge.type === 'friend' && (
                    <div className="animate-fade-in">
                      <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Friend's Email</label>
                      <input required type="email" placeholder="friend@example.com" value={newChallenge.opponentEmail} onChange={e => setNewChallenge({...newChallenge, opponentEmail: e.target.value})} className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-focusPurple box-border" />
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full py-3 bg-focusPurple hover:bg-purple-600 text-white rounded-lg font-bold transition shadow-lg">
                  {newChallenge.type === 'friend' ? 'SEND INVITE' : 'START CHALLENGE'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center mt-10"><div className="w-8 h-8 border-4 border-focusPurple border-t-transparent rounded-full animate-spin"></div></div>
        ) : activeTab === 'active' ? (
          /* ACTIVE CHALLENGES LIST */
          <div className="space-y-4">
            {activeChallenges.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">No active challenges. Push yourself and start one!</p>
            ) : (
              activeChallenges.map(chal => {
                const isCreator = chal.creator._id === myMockId;
                const myProgress = isCreator ? chal.creatorProgress : chal.opponentProgress;
                const theirProgress = isCreator ? chal.opponentProgress : chal.creatorProgress;
                const opponentName = isCreator ? chal.opponent?.name : chal.creator?.name;

                return (
                  <div key={chal._id} className="bg-[#1a1a24] border border-purple-900/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{chal.title}</h3>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          {chal.type === 'personal' ? <><User size={12} className="mr-1"/> Personal</> : <><Users size={12} className="mr-1"/> VS {opponentName}</>}
                        </div>
                      </div>
                      {myProgress < chal.targetDays ? (
                        <button 
                          onClick={() => handleUpdateProgress(chal._id)}
                          className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-focusPurple border border-focusPurple rounded-lg text-sm font-bold transition-colors"
                        >
                          +1 DAY
                        </button>
                      ) : (
                        <span className="text-green-500 font-bold text-sm bg-green-500/10 px-3 py-1 rounded-lg">DONE!</span>
                      )}
                    </div>

                    {/* Progress Visuals */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-300 font-semibold">You</span>
                          <span className="text-focusPurple font-bold">{myProgress} / {chal.targetDays}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-focusPurple transition-all duration-500" style={{ width: `${calcPercent(myProgress, chal.targetDays)}%` }}></div>
                        </div>
                      </div>

                      {chal.type === 'friend' && (
                        <div>
                          <div className="flex justify-between text-xs mb-1 opacity-70">
                            <span className="text-gray-400">{opponentName}</span>
                            <span className="text-blue-400">{theirProgress} / {chal.targetDays}</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden opacity-70">
                            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${calcPercent(theirProgress, chal.targetDays)}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* PENDING INVITES LIST */
          <div className="space-y-4">
            {pendingInvites.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
                <ShieldAlert size={48} className="mb-4 opacity-20" />
                <p>No pending invites right now.</p>
              </div>
            ) : (
              pendingInvites.map(chal => (
                <div key={chal._id} className="bg-[#1e1e28] border border-orange-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 opacity-5 rounded-bl-full"></div>
                  <h3 className="text-lg font-bold text-white mb-1">{chal.title}</h3>
                  <p className="text-sm text-gray-400 mb-4"><span className="text-orange-400 font-semibold">{chal.creator.name}</span> challenged you to {chal.targetDays} days!</p>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleAcceptInvite(chal._id)}
                      className="flex-1 py-2 bg-focusOrange hover:bg-orange-600 text-white rounded-lg font-bold flex justify-center items-center transition"
                    >
                      <Check size={18} className="mr-1" /> ACCEPT
                    </button>
                    <button 
                      onClick={() => setChallenges(chals => chals.filter(c => c._id !== chal._id))}
                      className="flex-1 py-2 bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 rounded-lg font-bold flex justify-center items-center transition"
                    >
                      <X size={18} className="mr-1" /> DECLINE
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}