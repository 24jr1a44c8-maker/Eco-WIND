
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VOUCHERS } from '../constants';

interface RewardsProps {
  balance: number;
  onRedeem: (cost: number, provider: string) => boolean;
}

const Rewards: React.FC<RewardsProps> = ({ balance, onRedeem }) => {
  const [filter, setFilter] = useState<'ALL' | 'FOOD' | 'SHOPPING' | 'MALL'>('ALL');

  const filteredVouchers = filter === 'ALL' 
    ? VOUCHERS 
    : VOUCHERS.filter(v => v.category === filter);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Rewards <span className="text-green-600">Catalog</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Spend your recycling earnings on local shopping & food brands.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto shadow-sm">
          {(['ALL', 'FOOD', 'SHOPPING', 'MALL'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${filter === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVouchers.map(voucher => {
          return (
            <Link 
              to={`/voucher/${voucher.id}`}
              key={voucher.id} 
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={voucher.image} 
                  alt={voucher.provider} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-800 uppercase shadow-lg">
                  {voucher.category}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{voucher.provider}</h3>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">₹{voucher.amount}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed line-clamp-2">{voucher.description}</p>
                
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-coins text-yellow-500"></i>
                    <span className="font-black text-slate-900 tracking-tight">{voucher.cost} Coins</span>
                  </div>
                  <div className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-tight transition-all ${balance >= voucher.cost ? 'bg-green-600 text-white group-hover:bg-green-500' : 'bg-slate-100 text-slate-400'}`}>
                    View Detail
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;
