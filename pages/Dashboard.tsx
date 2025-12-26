
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Activity } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  user: User;
  history: Activity[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, history }) => {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Namaste, {user.email.split('@')[0]}! 🌿</h1>
        <p className="text-slate-500 mt-2">You're making a real difference for India's environment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-xl">
            <i className="fa-solid fa-coins"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Available Balance</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{user.balance} <span className="text-sm font-normal text-slate-400">Coins</span></h3>
          <p className="text-xs text-slate-400 mt-2">Value: ₹{user.balance.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 text-xl">
            <i className="fa-solid fa-box"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Items Recycled</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{user.totalItems} <span className="text-sm font-normal text-slate-400">Items</span></h3>
          <p className="text-xs text-slate-400 mt-2">Great progress!</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 text-xl">
            <i className="fa-solid fa-weight-hanging"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Weight Saved</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{(user.totalWeight / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-400">kg</span></h3>
          <p className="text-xs text-slate-400 mt-2">Diverted from landfills</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
            <Link to="/history" className="text-green-600 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {history.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400">No activity yet. Start by recycling!</p>
               </div>
            ) : (
              history.map(activity => (
                <div key={activity.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.type === 'RECYCLE' ? (activity.category ? CATEGORY_COLORS[activity.category] : 'bg-green-100 text-green-600') : 'bg-slate-100 text-slate-600'}`}>
                      <i className={`fa-solid ${activity.type === 'RECYCLE' ? 'fa-plus' : 'fa-minus'}`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 truncate max-w-[150px]">{activity.title}</h4>
                      <p className="text-xs text-slate-400">{new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-black ${activity.amount > 0 ? 'text-green-600' : 'text-slate-600'}`}>
                      {activity.amount > 0 ? '+' : ''}{activity.amount}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">coins</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-4">Eco Warrior 🏆</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">
                 Recycling just 1 item a day can save up to 365 items a year. You're part of a community saving over 1,000kg of waste daily!
               </p>
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <i className="fa-solid fa-trophy"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Rank</p>
                    <p className="text-sm font-bold">Green Guardian</p>
                  </div>
               </div>
             </div>
             <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-green-500/10 blur-3xl"></div>
           </div>

           <Link to="/recycle" className="block p-8 bg-green-600 rounded-[2.5rem] text-white shadow-xl shadow-green-100 hover:bg-green-700 transition-all text-center">
              <i className="fa-solid fa-camera text-3xl mb-4"></i>
              <h3 className="text-xl font-bold">Launch Scanner</h3>
              <p className="text-white/70 text-sm mt-1">Found more items to recycle?</p>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
