import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 px-6 lg:px-8 overflow-hidden bg-gray-900 selection:bg-emerald-500 selection:text-white">
      {/* Premium Abstract Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900 via-gray-900 to-black z-0"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none z-0"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="h-14 w-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-emerald-500/30 shadow-lg border border-emerald-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400 font-medium">Sign in to your Golf Charity Dashboard</p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
           className="bg-white/10 backdrop-blur-2xl py-8 px-6 sm:rounded-[2rem] sm:px-10 border border-white/10 shadow-2xl"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </motion.div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" placeholder="name@company.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" placeholder="••••••••" />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base mt-4 font-bold shadow-emerald-500/20 shadow-lg"
              isLoading={loading}
            >
              Sign in
            </Button>
          </form>
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400 font-medium">Don't have an account?</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                Create new account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
