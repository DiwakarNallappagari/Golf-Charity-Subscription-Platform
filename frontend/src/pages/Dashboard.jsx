import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../components/Button';
import { Activity, CreditCard, Heart, Trophy, TrendingUp, Award, CheckCircle, XCircle, Edit2, Trash2, Gift, Gem, Lock } from 'lucide-react';
import clsx from 'clsx';

export default function Dashboard() {
  const { user, updateSubscription } = useAuth();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [loadingScore, setLoadingScore] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Edit State
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // Simulation Draw State
  const [drawNumbers, setDrawNumbers] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [simulatedWinnings, setSimulatedWinnings] = useState(0);

  useEffect(() => {
    // Generate 5 random winning numbers on initial Dashboard load
    const nums = [];
    while(nums.length < 5) {
      const r = Math.floor(Math.random() * 45) + 1;
      if(!nums.includes(r)) nums.push(r);
    }
    setDrawNumbers(nums.sort((a,b) => a-b));
    fetchScores();
  }, []);

  useEffect(() => {
    // Calculate winnings and matches dynamically whenever scores or draw numbers change
    if (scores.length > 0 && drawNumbers.length > 0) {
      const scoreVals = scores.map(s => s.value);
      const count = scoreVals.filter(s => drawNumbers.includes(s)).length;
      setMatchCount(count);
      
      let w = 0;
      if (count >= 1) w = 50;
      if (count >= 2) w = 100;
      if (count >= 3) w = 200;
      if (count >= 4) w = 1500;
      if (count === 5) w = 50000;
      setSimulatedWinnings(w);
    } else {
      setMatchCount(0);
      setSimulatedWinnings(0);
    }
  }, [scores, drawNumbers]);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchScores = async () => {
    try {
      const { data } = await api.get('/scores');
      setScores(data.reverse()); // Graph expects chronological (oldest first)
    } catch (e) {
      console.error(e);
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!newScore || newScore < 1 || newScore > 45) {
      showToast('Score must be between 1 and 45', 'error');
      return;
    }
    setLoadingScore(true);
    try {
      await api.post('/scores', { value: Number(newScore) });
      setNewScore('');
      fetchScores();
      showToast('Awesome! Score tracked (FIFO Applied).');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting score', 'error');
    } finally {
      setLoadingScore(false);
    }
  };

  const handleDeleteScore = async (id) => {
    try {
      await api.delete(`/scores/${id}`);
      fetchScores();
      showToast('Score removed');
    } catch (err) {
      showToast('Error deleting score', 'error');
    }
  };

  const handleEditScore = async (id) => {
    if (!editingValue || editingValue < 1 || editingValue > 45) {
      showToast('Valid score required', 'error');
      return;
    }
    try {
      await api.put(`/scores/${id}`, { value: Number(editingValue) });
      setEditingScoreId(null);
      setEditingValue('');
      fetchScores();
      showToast('Score updated');
    } catch (err) {
      showToast('Error updating score', 'error');
    }
  };

  const handleUpgrade = async () => {
    try {
      await updateSubscription();
      showToast('Successfully Upgraded to Premium!');
    } catch (err) {
      showToast('Upgrade failed', 'error');
    }
  };

  // Real graph data rendering exactly the FIFO 5 scores
  const graphScores = scores.length > 0 ? scores : [];
  
  // Dummy fallback data if empty 
  const displayScores = graphScores.length > 0 ? graphScores : [
    { value: 12, createdAt: new Date(Date.now() - 4 * 86400000) },
    { value: 25, createdAt: new Date(Date.now() - 3 * 86400000) },
    { value: 18, createdAt: new Date(Date.now() - 2 * 86400000) },
    { value: 38, createdAt: new Date(Date.now() - 1 * 86400000) },
    { value: 28, createdAt: new Date() }
  ];

  const chartData = displayScores.map((s, i) => ({
    name: `Game ${i + 1}`,
    value: s.value,
    date: new Date(s.createdAt).toLocaleDateString(),
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const limitReached = scores.length >= 5 && user?.subscription?.status !== 'active';

  return (
    <Layout>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-10">
        
        {/* Top Feature Cards: Expanded for PRD Alignment */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          <motion.div variants={itemVariants} className="bg-[#121214]/80 backdrop-blur-xl border border-white/5 overflow-hidden shadow-xl rounded-3xl p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Gift className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Winnings Total</dt>
                <dd className="text-3xl font-black text-white mt-1 flex items-baseline">
                  ${(user?.winningsTotal || 0) + simulatedWinnings} 
                  <span className="text-[9px] ml-2 font-black text-emerald-500 uppercase tracking-widest">
                    {simulatedWinnings > 0 ? '+ SIM WON' : ''}
                  </span>
                </dd>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#121214]/80 backdrop-blur-xl border border-white/5 overflow-hidden shadow-xl rounded-3xl p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 bg-yellow-500/10 rounded-2xl p-4 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                <Trophy className="h-7 w-7 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Monthly Draw (Sim)</dt>
                <dd className="text-sm font-black text-yellow-400 mt-1.5 flex flex-col gap-0.5 tracking-wider">
                  <span>🎲 {drawNumbers.join(', ')}</span>
                  <span className="text-white text-xs uppercase tracking-widest">💰 Matches: {matchCount}</span>
                </dd>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#121214]/80 backdrop-blur-xl border border-white/5 overflow-hidden shadow-xl rounded-3xl p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 bg-pink-500/10 rounded-2xl p-4 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
                <Heart className="h-7 w-7 text-pink-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Charity Impact</dt>
                <dd className="text-3xl font-black text-white mt-1">
                  {user?.charityPercentage || 10}% <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Donated</span>
                </dd>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#121214]/80 backdrop-blur-xl border border-white/5 overflow-hidden shadow-xl rounded-3xl p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <Gem className="h-7 w-7 text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Subscription</dt>
                <dd className="text-xl font-black text-white mt-1.5 flex flex-wrap items-center gap-2 capitalize">
                  {user?.subscription?.status || 'Active'}
                  <span className={clsx(
                    "inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm",
                    user?.subscription?.status === 'active' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/10 text-gray-300 border-white/10'
                  )}>
                    {user?.subscription?.plan || 'Free'}
                  </span>
                </dd>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <motion.div variants={itemVariants} className="bg-[#121214]/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10 p-8 lg:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 z-20 relative">
              <h3 className="text-2xl font-black text-white tracking-tight">Performance Analytics</h3>
              <span className="mt-2 sm:mt-0 text-xs text-emerald-400 font-black bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">FIFO 5 Tracking</span>
            </div>

            <div className="h-[340px] w-full mt-4 relative z-10">
              {scores.length === 0 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.3}} className="absolute inset-0 z-20 bg-[#0a0a0b]/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20">
                  <motion.div animate={{y: [0, -10, 0]}} transition={{repeat: Infinity, duration: 2, ease: "easeInOut"}} className="w-20 h-20 bg-emerald-500/20 flex items-center justify-center rounded-full mb-6 border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <Activity className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <p className="font-black text-white text-2xl tracking-tight mb-2">No scores logged yet</p>
                  <p className="text-base text-gray-400 mb-8 max-w-sm text-center font-medium leading-relaxed">Let's get started! Enter your first golf score to unlock real-time visualizations.</p>
                  <Button onClick={() => document.getElementById('score').focus()} className="px-8 py-3 h-14 text-lg shadow-emerald-500/30 shadow-lg rounded-2xl">
                    Add Your First Score
                  </Button>
                </motion.div>
              )}
              
              <ResponsiveContainer width="100%" height="100%" className={scores.length === 0 ? "opacity-20 pointer-events-none filter blur-[2px]" : ""}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13, fontWeight: 600}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13, fontWeight: 600}} dx={-15} domain={[0, 50]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '16px 20px' }}
                    labelStyle={{ color: '#fff', fontWeight: 800, marginBottom: '6px', fontSize: '15px' }}
                    itemStyle={{ color: '#34d399', fontWeight: 700, fontSize: '15px' }}
                    cursor={{ stroke: '#34d399', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Line type="stepAfter" dataKey="value" stroke="url(#colorUv)" strokeWidth={4} dot={{r: 6, fill: '#0a0a0b', strokeWidth: 3, stroke: '#10b981'}} activeDot={{r: 10, stroke: '#10b981', strokeWidth: 3, fill: '#0a0a0b', filter: 'drop-shadow(0px 0px 8px rgba(16,185,129,0.8))'}} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Input Score Panel */}
          <motion.div variants={itemVariants} className="bg-[#121214]/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10 p-8 flex flex-col relative z-20">
            <h3 className="text-2xl font-black text-white tracking-tight mb-3">Log New Score</h3>
            <p className="text-sm text-gray-400 mb-8 font-medium leading-relaxed">Enter your latest golf score (1–45). A new score will push out the oldest one automatically (Max 5).</p>
            
            {limitReached ? (
              <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(234,179,8,0.2)] border border-yellow-500/30">
                  <Lock className="w-8 h-8 text-yellow-500" />
                </div>
                <h4 className="text-xl font-black text-white mb-2">Maximum Reached</h4>
                <p className="text-sm text-gray-400 mb-8">You have reached the free limit of 5 scores. Unlock Premium to continue tracking your latest games.</p>
                <Button onClick={handleUpgrade} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#1a1500] shadow-[0_0_20px_rgba(234,179,8,0.4)] font-black h-14 text-lg rounded-xl border-none">
                  Unlock Premium
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleScoreSubmit} className="space-y-5 flex-1 mt-2">
                <input
                  id="score"
                  type="number"
                  min="1"
                  max="45"
                  placeholder="Enter score (e.g. 18)"
                  required
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-white/10 text-white placeholder-gray-600 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-black text-xl shadow-inner"
                />
                <Button type="submit" isLoading={loadingScore} className="w-full h-14 text-lg font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 border-none hover:from-emerald-400 hover:to-emerald-500">
                  Submit Score
                </Button>
              </form>
            )}

            <AnimatePresence>
              {scores.length > 0 && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mt-8 pt-6 border-t border-white/10 flex-1">
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-5 flex items-center justify-between">
                    Score History
                    <span className="bg-white/5 text-gray-400 px-2 py-1 rounded text-[10px]">{scores.length} entries</span>
                  </h4>
                  <ul className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {[...scores].reverse().map((score, idx) => (
                      <motion.li initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay: Math.min(idx * 0.05, 0.5)}} key={score._id} className="flex justify-between items-center text-sm group p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all">
                        
                        {editingScoreId === score._id ? (
                          <div className="flex w-full gap-2 items-center">
                            <input 
                              type="number" min="1" max="45"
                              value={editingValue} onChange={e => setEditingValue(e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-[#0a0a0b] border border-white/20 text-white rounded-lg focus:ring-1 focus:outline-none focus:border-emerald-500 font-bold"
                              autoFocus
                            />
                            <button onClick={() => handleEditScore(score._id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-emerald-500 transition-colors">Save</button>
                            <button onClick={() => setEditingScoreId(null)} className="text-gray-400 hover:text-white px-2 font-medium transition-colors">Cancel</button>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col">
                              <span className="text-gray-300 font-bold group-hover:text-white transition-colors">{new Date(score.createdAt).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</span>
                              <div className="flex gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingScoreId(score._id); setEditingValue(score.value); }} className="text-blue-400 hover:text-blue-300 flex items-center text-[11px] font-bold uppercase tracking-wide"><Edit2 className="w-3 h-3 mr-1"/> Edit</button>
                                <button onClick={() => handleDeleteScore(score._id)} className="text-red-400 hover:text-red-300 flex items-center text-[11px] font-bold uppercase tracking-wide"><Trash2 className="w-3 h-3 mr-1"/> Delete</button>
                              </div>
                            </div>
                            <span className="font-black text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20 shadow-sm text-base">{score.value} <span className="text-[10px] text-emerald-500/80 uppercase">pts</span></span>
                          </>
                        )}

                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </motion.div>

      {/* Global Dashboard Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={clsx(
              "fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl flex items-center z-50 text-white font-bold tracking-wide border backdrop-blur-md",
              toastType === 'success' ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-50' : 'bg-red-900/90 border-red-500/50 text-red-50'
            )}
          >
            {toastType === 'success' ? <CheckCircle className="w-6 h-6 mr-3 text-emerald-400" /> : <XCircle className="w-6 h-6 mr-3 text-white" />}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </Layout>
  );
}
