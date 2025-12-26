
import React from 'react';
import { Activity } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface HistoryProps {
  activities: Activity[];
}

const History: React.FC<HistoryProps> = ({ activities }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Unified Activity History</h1>
        <p className="text-slate-500 mt-2">Every item, redemption, and cash-out counts towards your eco-footprint.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                    <i className="fa-solid fa-box-open text-4xl mb-4 block opacity-20"></i>
                    No activities found. Start recycling!
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
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
                            <span className="font-semibold text-slate-800 block">{activity.title}</span>
                            {activity.currencyAmount && (
                               <span className="text-[10px] text-green-600 font-bold">Value: ${activity.currencyAmount.toFixed(2)}</span>
                            )}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                        activity.type === 'RECYCLE' && activity.category ? CATEGORY_COLORS[activity.category] : 
                        activity.type === 'CASH_OUT' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {activity.type === 'RECYCLE' ? activity.category : activity.type === 'CASH_OUT' ? 'CASH' : 'VOUCHER'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(activity.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className={`flex items-center justify-end gap-1 font-bold ${activity.amount > 0 ? 'text-green-600' : 'text-slate-600'}`}>
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
      
      <div className="mt-8 bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
          <i className="fa-solid fa-circle-info text-xl"></i>
        </div>
        <div>
          <h4 className="font-bold text-green-800">Financial Safety</h4>
          <p className="text-sm text-green-700 opacity-80">Withdrawals are processed through EcoVend's secure gateway. Most transfers to online apps and digital wallets are near-instant.</p>
        </div>
      </div>
    </div>
  );
};

export default History;
