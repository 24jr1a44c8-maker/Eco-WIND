
import React, { useState } from 'react';
import { VOUCHERS } from '../constants';

interface RewardsProps {
  balance: number;
  onRedeem: (cost: number, provider: string) => boolean;
}

const Rewards: React.FC<RewardsProps> = ({ balance, onRedeem }) => {
  const [filter, setFilter] = useState<'ALL' | 'FOOD' | 'SHOPPING' | 'MALL'>('ALL');
  const [redeemed, setRedeemed] = useState<string[]>([]);

  const handleRedeem = (id: string, cost: number, provider: string) => {
    if (onRedeem(cost, provider)) {
      setRedeemed(prev => [...prev, id]);
      alert("Voucher redeemed successfully! Check your email/history for the code.");
    } else {
      alert("Insufficient balance to redeem this voucher.");
    }
  };

  const filteredVouchers = filter === 'ALL' 
    ? VOUCHERS 
    : VOUCHERS.filter(v => v.category === filter);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Rewards Marketplace</h1>
          <p className="text-slate-500 mt-2">Spend your hard-earned coins on gift vouchers</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          {(['ALL', 'FOOD', 'SHOPPING', 'MALL'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === cat ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVouchers.map(voucher => {
          const isRedeemed = redeemed.includes(voucher.id);
          return (
            <div key={voucher.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-transform hover:-translate-y-1">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={voucher.image} 
                  alt={voucher.provider} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-md px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                  {voucher.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{voucher.provider}</h3>
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-800">${voucher.amount}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-6">{voucher.description}</p>
                
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-coins text-yellow-500"></i>
                    <span className="font-bold text-slate-800">{voucher.cost}</span>
                  </div>
                  <button 
                    disabled={isRedeemed || balance < voucher.cost}
                    onClick={() => handleRedeem(voucher.id, voucher.cost, voucher.provider)}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${isRedeemed ? 'bg-slate-100 text-slate-400' : balance >= voucher.cost ? 'bg-green-600 text-white shadow-lg shadow-green-100 hover:bg-green-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  >
                    {isRedeemed ? 'Redeemed' : 'Redeem'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;
