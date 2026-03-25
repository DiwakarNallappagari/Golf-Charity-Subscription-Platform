import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [charityId, setCharityId] = useState('');
  const [charityPercentage, setCharityPercentage] = useState(10);
  const [charities, setCharities] = useState([]);
  const [loadingCharities, setLoadingCharities] = useState(true);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const { data } = await api.get('/charities');
        setCharities(data);
        if (data.length > 0) setCharityId(data[0]._id);
      } catch(e) { console.log(e); } finally { setLoadingCharities(false); }
    };
    fetchCharities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (charityPercentage < 10) {
      setError('Minimum charitable contribution is 10%');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, 'user', charityId, Number(charityPercentage));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 px-6 lg:px-8 overflow-auto bg-gray-900 selection:bg-emerald-500 selection:text-white pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-[#022c22] z-0 fixed pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none z-0 fixed"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 pt-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="h-14 w-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-emerald-500/30 shadow-lg border border-emerald-400">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-emerald-400 font-bold">Join the Golf Charity Platform ecosystem</p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-[#0f0f11]/80 backdrop-blur-2xl py-8 px-6 sm:rounded-[2rem] sm:px-10 border border-white/10 shadow-2xl"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-bold text-center">
                {error}
              </motion.div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#050505] border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold transition-all shadow-inner" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050505] border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold transition-all shadow-inner" placeholder="name@company.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#050505] border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold transition-all shadow-inner" placeholder="••••••••" />
            </div>
            
            <div className="pt-3 border-t border-white/5 mt-3">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5 ml-1">Select Supported Charity</label>
              <select required value={charityId} onChange={(e) => setCharityId(e.target.value)} className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold transition-all appearance-none cursor-pointer">
                {loadingCharities && <option value="">Loading charities...</option>}
                {!loadingCharities && charities.length === 0 && <option value="">No charities available yet</option>}
                {charities.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 flex justify-between">
                <span>Contribution Percentage</span>
                <span className="text-emerald-500">{charityPercentage}%</span>
              </label>
              <input type="range" required min="10" max="100" step="5" value={charityPercentage} onChange={(e) => setCharityPercentage(e.target.value)} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              <p className="text-[10px] text-gray-500 mt-1">Minimum 10% of subscription goes directly to charity.</p>
            </div>

            <Button type="submit" className="w-full h-14 text-lg mt-6 font-black shadow-[0_0_20px_rgba(16,185,129,0.2)] rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 border-none hover:from-emerald-400 hover:to-emerald-500" isLoading={loading}>
              Create Account
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors text-sm">
              Already have an account? Sign in.
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
