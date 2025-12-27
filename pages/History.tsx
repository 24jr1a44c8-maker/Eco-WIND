
import React, { useState, useMemo } from 'react';
import { Activity, ActivityType } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface HistoryProps {
  activities: Activity[];
}

type DateFilter = 'all' | 'today' | 'week' | 'month';

const History: React.FC<HistoryProps> = ({ activities }) => {
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Type Filter
      const matchesType = typeFilter === 'ALL' || activity.type === typeFilter;

      // Date Filter
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      let matchesDate = true;

      if (dateFilter === 'today') {
        const startOfToday = new Date().setHours(0, 0, 0, 0);
        matchesDate = activity.timestamp >= startOfToday;
      } else if (dateFilter === 'week') {
        matchesDate = activity.timestamp >= now - 7 * oneDay;
      } else if (dateFilter === 'month') {
        matchesDate = activity.timestamp >= now - 30 * oneDay;
      }

      return matchesType && matchesDate;
    });
  }, [activities, typeFilter, dateFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1e293b] tracking-tight">Recycling Log</h1>
        <p className="text-slate-400 font-medium mt-2">History of your contributions and earned rewards.</p>
      </div>

      {/* Split Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10 items-center justify-start">
        {/* Left Filter Block */}
        <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto">
          <span className="text-[10px] font-black text-slate-300 uppercase px-4 tracking-widest whitespace-nowrap">FILTER:</span>
          {(['ALL', 'RECYCLE', 'REDEEM', 'CASH_OUT'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                typeFilter === type
                  ? 'bg-[#dcfce7] text-[#166534] shadow-sm ring-1 ring-[#bbf7d0]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {type === 'ALL' ? 'Everything' : type.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Right Filter Block */}
        <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto">
          <span className="text-[10px] font-black text-slate-300 uppercase px-4 tracking-widest whitespace-nowrap">TIME:</span>
          {(['all', 'today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateFilter(range)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                dateFilter === range
                  ? 'bg-[#1e293b] text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table Container */}
      <div className="bg-[#f1f5f9]/50 rounded-[2.5rem] p-8 border border-white/40 shadow-inner min-h-[500px] animate-in fade-in zoom-in-95 duration-1000 delay-200">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date & Time</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <i className="fa-solid fa-clock-rotate-left text-6xl mb-6"></i>
                      <p className="font-black uppercase tracking-widest">Zero entries found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity, index) => (
                  <tr 
                    key={activity.id} 
                    className="hover:bg-slate-50/50 transition-all group animate-in slide-in-from-left-4 fade-in duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-transform group-hover:scale-110 shadow-sm ${
                           activity.type === 'RECYCLE' ? 'bg-[#dcfce7] text-[#166534]' : 
                           activity.type === 'REDEEM' ? 'bg-blue-50 text-blue-600' :
                           activity.type === 'PURCHASE' ? 'bg-slate-900 text-white' :
                           'bg-amber-50 text-amber-600'
                         }`}>
                            <i className={`fa-solid ${
                              activity.type === 'RECYCLE' ? 'fa-recycle' : 
                              activity.type === 'REDEEM' ? 'fa-gift' : 
                              activity.type === 'PURCHASE' ? 'fa-bottle-water' : 
                              'fa-wallet'
                            }`}></i>
                         </div>
                         <span className="font-bold text-[#1e293b] text-base tracking-tight">{activity.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm ring-1 ring-inset ring-slate-100 ${
                        activity.type === 'RECYCLE' && activity.category ? CATEGORY_COLORS[activity.category] : 
                        activity.type === 'CASH_OUT' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-50 text-slate-400'
                      }`}>
                        {activity.type === 'RECYCLE' ? activity.category : activity.type === 'CASH_OUT' ? 'CASH' : activity.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-[#475569] font-bold">
                        {new Date(activity.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className={`flex items-center justify-end gap-2 font-black text-lg ${activity.amount > 0 ? 'text-[#16a34a]' : 'text-slate-400'}`}>
                        {activity.amount > 0 ? '+' : ''}{activity.amount}
                        <i className="fa-solid fa-coins text-[10px] text-yellow-500 shadow-sm"></i>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
