import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Settings, ChevronDown } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden bg-[#050505] selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Mesh Gradients - Ultra Premium Dark */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent"></div>
        <div className="absolute top-[-20%] right-[-5%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[150px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[130px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] rounded-full bg-teal-400/5 blur-[100px]"></div>
      </div>

      <nav className="bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-40 w-full shadow-2xl relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all">
                  G
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">GolfCharity</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-5">
              {user?.role === 'admin' && (
                <Link to="/admin" className="p-2.5 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:border-white/10">
                  <Settings className="w-5 h-5" />
                </Link>
              )}
              
              <div className="h-8 w-[1px] bg-white/10 hidden sm:block mx-2"></div>
              
              <div className="group relative flex items-center gap-3 p-1.5 pr-4 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#050505]">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-gray-200 hidden sm:block">
                  {user?.name}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                
                {/* Dropdown Menu */}
                <div className="absolute top-12 right-0 w-48 bg-[#0f0f11] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5 bg-white/5 text-sm">
                    <p className="font-semibold text-white">{user?.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 font-bold flex items-center transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
