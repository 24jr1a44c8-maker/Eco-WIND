
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Activity } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  user: User;
  history: Activity[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, history }) => {
  // Calculate lifetime earnings (sum of all positive coin transactions from recycling)
  const lifetimeEarnings = useMemo(() => {
    return user.activities
      .filter(a => a.type === 'RECYCLE')
      .reduce((sum, a) => sum + a.amount, 0);
  }, [user.activities]);

  // Next Milestone
  const nextMilestone = user.totalItems < 50 ? 50 : user.totalItems < 100 ? 100 : 500;
  const progressPercent = Math.min(100, (user.totalItems / nextMilestone) * 100);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Eco Dashboard</h1>
          <p className="text-slate-500 mt-1">Namaste, {user.email.split('@')[0]}! Your green journey is inspiring.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-2xl font-black text-sm border border-green-200">
          <i className="fa-solid fa-shield-halved"></i>
          LEVEL {Math.floor(user.totalItems / 10) + 1} PROTECTOR
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Available Balance */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Available Balance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-4xl font-black text-slate-900">{user.balance}</h3>
            <span className="text-sm font-bold text-slate-400">Coins</span>
          </div>
          <p className="text-xs text-green-600 font-bold mt-3 flex items-center gap-1">
            <i className="fa-solid fa-circle-info"></i>
            Value: ₹{user.balance.toFixed(2)}
          </p>
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
             <i className="fa-solid fa-coins text-9xl"></i>
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="w-14 h-14 bg-yellow-400/20 text-yellow-400 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Earned</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-4xl font-black">{lifetimeEarnings}</h3>
            <span className="text-sm font-bold text-slate-500">Coins</span>
          </div>
          <p className="text-xs text-yellow-400 font-bold mt-3">All-time recycling rewards</p>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
             <i className="fa-solid fa-award text-9xl"></i>
          </div>
        </div>

        {/* Total Items Recycled */}
        <div className="bg-green-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group hover:shadow-xl transition-all lg:col-span-1">
          <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-recycle"></i>
          </div>
          <p className="text-green-100 text-xs font-black uppercase tracking-widest">Items Recycled</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-4xl font-black">{user.totalItems}</h3>
            <span className="text-sm font-bold text-green-200">Units</span>
          </div>
          <p className="text-xs text-white/70 font-bold mt-3">Helping save Mother Earth</p>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
             <i className="fa-solid fa-earth-asia text-9xl"></i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800">Recycling Log</h2>
            <Link to="/history" className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-200 transition-colors uppercase tracking-tight">View Full History</Link>
          </div>
          <div className="space-y-4">
            {history.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-[2rem] border-2 border-dashed border-slate-100">
                  <i className="fa-solid fa-hourglass-start text-4xl text-slate-200 mb-4"></i>
                  <p className="text-slate-400 font-bold">Your journey starts with the first item!</p>
                  <Link to="/recycle" className="text-green-600 text-sm font-black mt-2 inline-block">SCAN NOW</Link>
               </div>
            ) : (
              history.map(activity => (
                <div key={activity.id} className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg ${activity.type === 'RECYCLE' ? (activity.category ? CATEGORY_COLORS[activity.category] : 'bg-green-100 text-green-600') : 'bg-slate-100 text-slate-600'}`}>
                      <i className={`fa-solid ${activity.type === 'RECYCLE' ? 'fa-plus' : 'fa-minus'}`}></i>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm group-hover:text-green-700 transition-colors">{activity.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-1">
                        <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className={`${activity.type === 'RECYCLE' ? 'text-green-500' : 'text-slate-500'}`}>{activity.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black ${activity.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                      {activity.amount > 0 ? '+' : ''}{activity.amount}
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">COINS</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Impact Goals & Leveling */}
        <div className="space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h3 className="text-xl font-black text-slate-800 mb-6">Impact Goal</h3>
             <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Next Milestone</span>
                   <span className="text-sm font-black text-green-600">{user.totalItems} / {nextMilestone} Items</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                   <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out shadow-inner" 
                    style={{ width: `${progressPercent}%` }}
                   ></div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
                      <i className="fa-solid fa-water"></i>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Water Saved</p>
                      <p className="text-sm font-black text-slate-800">{Math.floor(user.totalWeight * 0.1)} Liters</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                   <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">
                      <i className="fa-solid fa-leaf"></i>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">CO2 Reduced</p>
                      <p className="text-sm font-black text-slate-800">{(user.totalWeight * 0.002).toFixed(2)} kg</p>
                   </div>
                </div>
             </div>
           </div>

           <Link to="/recycle" className="block p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 hover:bg-black transition-all text-center group relative overflow-hidden">
              <div className="relative z-10">
                <i className="fa-solid fa-camera text-3xl mb-4 group-hover:scale-110 transition-transform"></i>
                <h3 className="text-xl font-black uppercase tracking-tight">Earn More Coins</h3>
                <p className="text-white/50 text-xs font-bold mt-2">Launch AI Scanner & Deposit Items</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent"></div>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
