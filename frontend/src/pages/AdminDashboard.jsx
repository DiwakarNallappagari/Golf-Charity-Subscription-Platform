import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Users, Shuffle, Eye, CheckCircle, PlusCircle, Gift } from 'lucide-react';
import { Button } from '../components/Button';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('draws');
  
  // Draws state
  const [simulatedDraw, setSimulatedDraw] = useState(null);
  const [loadingDraw, setLoadingDraw] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);

  // Charities state
  const [charities, setCharities] = useState([]);
  const [newCharity, setNewCharity] = useState({ name: '', description: '' });
  const [charityLoading, setCharityLoading] = useState(false);

  useEffect(() => {
    fetchDrawHistory();
    fetchCharities();
  }, []);

  const fetchDrawHistory = async () => {
    try {
      const { data } = await api.get('/draws/history');
      setDrawHistory(data);
    } catch (e) { console.error(e); }
  };

  const fetchCharities = async () => {
    try {
      const { data } = await api.get('/charities');
      setCharities(data);
    } catch (e) { console.error(e); }
  };

  const handleSimulateDraw = async (type) => {
    setLoadingDraw(true);
    try {
      const { data } = await api.post('/draws/simulate', { type });
      setSimulatedDraw(data);
    } catch (e) {
      console.error(e);
      alert('Error simulating draw');
    } finally {
      setLoadingDraw(false);
    }
  };

  const handlePublishDraw = async () => {
    if (!simulatedDraw) return;
    setPublishLoading(true);
    try {
      await api.post('/draws/publish', { type: simulatedDraw.type });
      setSimulatedDraw(null);
      fetchDrawHistory();
      alert('Draw published successfully!');
    } catch (e) {
      console.error(e);
      alert('Error publishing draw');
    } finally {
      setPublishLoading(false);
    }
  };

  const handleCreateCharity = async (e) => {
    e.preventDefault();
    if (!newCharity.name || !newCharity.description) return;
    setCharityLoading(true);
    try {
      await api.post('/charities', newCharity);
      setNewCharity({ name: '', description: '' });
      fetchCharities();
    } catch (e) {
      console.error(e);
      alert('Error creating charity');
    } finally {
      setCharityLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Control Panel</h1>
          <div className="mt-4 sm:mt-0 flex space-x-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('draws')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'draws' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              Draw Engine
            </button>
            <button
              onClick={() => setActiveTab('charities')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'charities' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              Charities
            </button>
          </div>
        </div>

        {activeTab === 'draws' && (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Draw Engine Control */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 lg:p-8 flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Shuffle className="w-7 h-7 mr-3 text-emerald-600 bg-emerald-50 p-1.5 rounded-lg" />
                Intelligent Draw Engine
              </h2>
              
              <div className="space-y-4 mb-8">
                <p className="text-gray-500 text-sm leading-relaxed">Simulate a draw before publishing. The weighted algorithm favors scores with a higher recorded frequency.</p>
                <div className="flex gap-4">
                  <Button onClick={() => handleSimulateDraw('random')} isLoading={loadingDraw} className="flex-1 bg-white text-gray-700 border-gray-300 border hover:bg-gray-50 min-h-[3rem]">
                    Simulate Random
                  </Button>
                  <Button onClick={() => handleSimulateDraw('weighted')} isLoading={loadingDraw} className="flex-1 min-h-[3rem] shadow-emerald-500/20 shadow-md">
                    Simulate Weighted
                  </Button>
                </div>
              </div>

              {simulatedDraw && (
                <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 mt-auto shadow-inner">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-500" />
                      Results ({simulatedDraw.type})
                    </h3>
                  </div>
                  <div className="flex justify-center gap-3 mb-6">
                    {simulatedDraw.winningNumbers.map((n, i) => (
                      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay: i * 0.1}} key={i} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-extrabold text-emerald-700 shadow-md border border-emerald-100">
                        {n}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-center mb-6">
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                      {simulatedDraw.simulatedWinnersCount} Winners Found
                    </span>
                  </div>
                  <Button onClick={handlePublishDraw} isLoading={publishLoading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/30">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Publish Results to All Users
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Draw History */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Draw History</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {drawHistory.map((draw) => (
                  <div key={draw._id} className="p-5 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-gray-900">{new Date(draw.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-0.5">{draw.type} Draw</p>
                      </div>
                      <span className="text-sm font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg">
                        {draw.winners.length} Winners
                      </span>
                    </div>
                    <div className="flex gap-2 max-w-full overflow-x-auto pb-1">
                      {draw.winningNumbers.map((n, idx) => (
                        <div key={idx} className="w-8 h-8 flex-shrink-0 bg-white shadow-sm border border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {drawHistory.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-400 font-medium">No draws published yet.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'charities' && (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 lg:p-8 flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <PlusCircle className="w-7 h-7 mr-3 text-pink-600 bg-pink-50 p-1.5 rounded-lg" />
                Add New Charity
              </h2>
              <form onSubmit={handleCreateCharity} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Charity Name</label>
                  <input required value={newCharity.name} onChange={e => setNewCharity({...newCharity, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm" placeholder="e.g. Golfers Against Cancer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea required value={newCharity.description} onChange={e => setNewCharity({...newCharity, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-all shadow-sm" rows="4" placeholder="Brief description of the charity's mission..."></textarea>
                </div>
                <Button type="submit" isLoading={charityLoading} className="w-full h-12 text-base font-bold shadow-emerald-500/20 shadow-md">Create Charity</Button>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Registered Charities</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {charities.map(charity => (
                  <div key={charity._id} className="p-5 rounded-2xl border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all bg-white shadow-sm">
                    <div className="flex items-start">
                      <div className="bg-pink-50 p-2 rounded-xl mr-4 border border-pink-100">
                        <Gift className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{charity.name}</h4>
                        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{charity.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {charities.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-400 font-medium">No charities found.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </Layout>
  );
}
