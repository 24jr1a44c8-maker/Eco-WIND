
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
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Hello, {user.email.split('@')[0]}! 🌿</h1>
        <p className="text-slate-500 mt-2">You're doing a great job saving the planet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-coins text-xl"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Available Balance</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{user.balance} Coins</h3>
          <p className="text-xs text-slate-400 mt-2">≈ ${(user.balance / 10).toFixed(2)} USD value</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-box text-xl"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Items Recycled</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{user.totalItems} Items</h3>
          <p className="text-xs text-slate-400 mt-2">Personal Impact</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-weight-hanging text-xl"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Environmental Impact</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{(user.totalWeight / 1000).toFixed(1)} kg</h3>
          <p className="text-xs text-slate-400 mt-2">CO2 emission offset estimated</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to recycle?</h2>
            <p className="text-slate-600 mb-6 max-w-sm">
              Use our AI-powered scanner to identify your items and earn rewards instantly.
            </p>
            <Link to="/recycle" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all">
              <i className="fa-solid fa-camera"></i> Start Scanner
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50 rounded-l-full flex items-center justify-center -mr-10">
            <i className="fa-solid fa-recycle text-6xl text-green-100"></i>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
            <Link to="/history" className="text-green-600 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {history.map(activity => (
              <div key={activity.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === 'RECYCLE' ? (activity.category ? CATEGORY_COLORS[activity.category] : 'bg-green-100 text-green-600') : 'bg-slate-100 text-slate-600'}`}>
                    <i className={`fa-solid ${activity.type === 'RECYCLE' ? 'fa-plus' : 'fa-gift'} text-xs`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 truncate max-w-[150px]">{activity.title}</h4>
                    <p className="text-xs text-slate-500">{new Date(activity.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${activity.amount > 0 ? 'text-green-600' : 'text-slate-600'}`}>
                    {activity.amount > 0 ? '+' : ''}{activity.amount}
                  </span>
                  <p className="text-[10px] text-slate-400 uppercase">coins</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
