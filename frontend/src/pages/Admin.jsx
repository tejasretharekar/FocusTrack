// frontend/src/pages/Admin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Users, Swords, Trash2, Activity, X, Database } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalChallenges: 0, activeChallenges: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usersRes = await fetch(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (statsRes.ok && usersRes.ok) {
          setStats(await statsRes.json());
          setUsers(await usersRes.json());
        } else {
          console.error('Failed to fetch admin data. Are you an admin?');
          setStats({ totalUsers: 0, totalChallenges: 0, activeChallenges: 0 });
          setUsers([]);
        }
      } catch (error) {
        console.error('Admin Fetch Error', error);
        setStats({ totalUsers: 0, totalChallenges: 0, activeChallenges: 0 });
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchAdminData();
  }, [token]);

  const handleDeleteUser = async (e, id, name) => {
    e.stopPropagation(); 
    
    if (!window.confirm(`CRITICAL WARNING: Are you sure you want to permanently delete user ${name}?`)) {
      return;
    }

    // Optimistic UI update
    const previousUsers = [...users];
    setUsers(users.filter(u => u._id !== id));

    try {
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Delete failed');
    } catch (error) {
      console.error('Failed to delete user', error);
      setUsers(previousUsers); // Revert on failure
    }
  };

  const handleRowClick = async (userId) => {
    setIsModalLoading(true);
    setSelectedUserDetails({ user: users.find(u => u._id === userId), stats: null }); 

    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedUserDetails(data);
      } else {
        console.error("Failed to fetch user details");
        setSelectedUserDetails(null);
      }
    } catch (error) {
      console.error("Failed to fetch user details", error);
      setSelectedUserDetails(null);
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => setSelectedUserDetails(null);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center p-4 md:p-6 overflow-x-hidden box-border font-sans relative">
      
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 mt-2 md:mt-0 border-b border-red-900/30 pb-4">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white transition p-2">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-widest flex items-center">
          <ShieldAlert className="text-red-500 mr-3" size={28} />
          SYSTEM COMMAND
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-4xl flex-1 flex flex-col pb-12">
        
        {isLoading ? (
          <div className="flex justify-center mt-20"><div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Users</p>
                  <p className="text-3xl font-black text-white">{stats.totalUsers || 0}</p>
                </div>
                <Users size={32} className="text-gray-600" />
              </div>
              <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Global Challenges</p>
                  <p className="text-3xl font-black text-white">{stats.totalChallenges || 0}</p>
                </div>
                <Swords size={32} className="text-gray-600" />
              </div>
              <div className="bg-gradient-to-br from-[#1a0505] to-[#121212] border border-red-900/40 rounded-xl p-6 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Active Now</p>
                  <p className="text-3xl font-black text-white">{stats.activeChallenges || 0}</p>
                </div>
                <Activity size={32} className="text-red-500 animate-pulse" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-300 tracking-wider mb-4 uppercase">User Management</h3>
            
            <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="hidden md:grid grid-cols-12 gap-4 bg-[#1a1a1a] p-4 border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <div className="col-span-3">User</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {users.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No users found in the database.</div>
              ) : (
                <div className="divide-y divide-gray-800/50">
                  {users.map(user => (
                    <div 
                      key={user._id} 
                      onClick={() => handleRowClick(user._id)}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-[#1a1a24] transition-colors cursor-pointer relative"
                    >
                      <div className="col-span-1 md:col-span-3 flex flex-col pointer-events-none">
                        <span className="font-bold text-gray-200">{user.name}</span>
                        <span className="text-xs text-gray-500 md:hidden">{user.email}</span>
                      </div>
                      <div className="hidden md:block col-span-4 text-sm text-gray-400 truncate pointer-events-none">
                        {user.email}
                      </div>
                      <div className="hidden md:block col-span-2 text-sm text-gray-500 pointer-events-none">
                        {user.createdAt ? user.createdAt.split('T')[0] : 'N/A'}
                      </div>
                      <div className="col-span-1 md:col-span-2 pointer-events-none">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gray-800 text-gray-400'}`}>
                          {user.role || 'user'}
                        </span>
                      </div>
                      <div className="col-span-1 md:col-span-1 flex justify-end absolute md:relative right-4 md:right-0 mt-[-30px] md:mt-0 z-10">
                        {user.role !== 'admin' && (
                          <button 
                            onClick={(e) => handleDeleteUser(e, user._id, user.name)}
                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedUserDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121212] border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            <div className="sticky top-0 bg-[#121212] border-b border-gray-800 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedUserDetails.user.name}</h2>
                <p className="text-gray-400 text-sm">{selectedUserDetails.user.email}</p>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-white bg-gray-800/50 hover:bg-gray-700 p-2 rounded-full transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {isModalLoading || !selectedUserDetails.stats ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="flex items-center text-red-400 font-bold uppercase tracking-widest text-sm mb-2 border-b border-red-900/30 pb-2">
                    <Database size={16} className="mr-2" /> Database Footprint
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#1a1a1a] p-4 rounded-xl text-center border border-gray-800">
                      <p className="text-gray-500 text-xs font-bold uppercase mb-1">Tasks</p>
                      <p className="text-2xl font-black text-white">{selectedUserDetails.stats.totalTasks || 0}</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-4 rounded-xl text-center border border-gray-800">
                      <p className="text-gray-500 text-xs font-bold uppercase mb-1">Workouts</p>
                      <p className="text-2xl font-black text-white">{selectedUserDetails.stats.totalWorkouts || 0}</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-4 rounded-xl text-center border border-gray-800">
                      <p className="text-gray-500 text-xs font-bold uppercase mb-1">Diets</p>
                      <p className="text-2xl font-black text-white">{selectedUserDetails.stats.totalDietItems || 0}</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-4 rounded-xl text-center border border-gray-800">
                      <p className="text-gray-500 text-xs font-bold uppercase mb-1">Challenges</p>
                      <p className="text-2xl font-black text-white">{selectedUserDetails.stats.totalChallenges || 0}</p>
                    </div>
                  </div>

                  <div className="mt-8 bg-red-900/10 border border-red-900/30 rounded-xl p-5">
                    <p className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Moderation Action</p>
                    <button 
                      onClick={(e) => {
                        closeModal();
                        handleDeleteUser(e, selectedUserDetails.user._id, selectedUserDetails.user.name);
                      }}
                      className="w-full py-3 bg-red-900/40 hover:bg-red-600 text-white font-bold rounded-lg transition border border-red-800"
                    >
                      PURGE USER DATA
                    </button>
                  </div>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}