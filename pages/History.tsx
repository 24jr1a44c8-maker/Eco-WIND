
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
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Activity History</h1>
        <p className="text-slate-500 mt-2">Track your recycling efforts and financial transactions.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase px-3 whitespace-nowrap">Filter by type:</span>
          {(['ALL', 'RECYCLE', 'REDEEM', 'CASH_OUT'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                typeFilter === type
                  ? 'bg-green-600 text-white shadow-md shadow-green-100'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {type === 'ALL' ? 'All Activities' : type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase px-3 whitespace-nowrap">Timeframe:</span>
          {(['all', 'today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateFilter(range)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                dateFilter === range
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-32 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <i className="fa-solid fa-magnifying-glass text-2xl opacity-20"></i>
                      </div>
                      <p className="font-semibold text-slate-500">No activities match your filters</p>
                      <button 
                        onClick={() => { setTypeFilter('ALL'); setDateFilter('all'); }}
                        className="mt-4 text-green-600 font-bold text-sm hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-transform group-hover:scale-110 ${
                           activity.type === 'RECYCLE' ? 'bg-green-100 text-green-600' : 
                           activity.type === 'REDEEM' ? 'bg-blue-100 text-blue-600' :
                           'bg-amber-100 text-amber-600'
                         }`}>
                            <i className={`fa-solid ${
                              activity.type === 'RECYCLE' ? 'fa-recycle' : 
                              activity.type === 'REDEEM' ? 'fa-gift' : 
                              'fa-wallet'
                            }`}></i>
                         </div>
                         <div>
                            <span className="font-bold text-slate-800 block text-sm">{activity.title}</span>
                            {activity.currencyAmount && (
                               <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">Value: ${activity.currencyAmount.toFixed(2)}</span>
                            )}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight ${
                        activity.type === 'RECYCLE' && activity.category ? CATEGORY_COLORS[activity.category] : 
                        activity.type === 'CASH_OUT' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {activity.type === 'RECYCLE' ? activity.category : activity.type === 'CASH_OUT' ? 'MONEY' : 'REWARD'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-slate-600 font-medium">
                        {new Date(activity.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        {new Date(activity.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className={`flex items-center justify-end gap-1.5 font-black text-base ${activity.amount > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                        {activity.amount > 0 ? '+' : ''}{activity.amount}
                        <i className="fa-solid fa-coins text-[10px] text-yellow-500"></i>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
            <i className="fa-solid fa-chart-line text-xl"></i>
          </div>
          <div>
            <h4 className="font-bold text-green-800">Recycling Trends</h4>
            <p className="text-sm text-green-700 opacity-80 mt-1">Filtering your history helps you see which materials you recycle most. Keep it up!</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
            <i className="fa-solid fa-receipt text-xl"></i>
          </div>
          <div>
            <h4 className="font-bold text-blue-900">E-Receipts</h4>
            <p className="text-sm text-blue-800 opacity-80 mt-1">Every transaction is recorded with a unique ID for your security and can be used for warranty claims.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
