
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity } from '../types';

interface MyVouchersProps {
  activities: Activity[];
}

const MyVouchers: React.FC<MyVouchersProps> = ({ activities }) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const redeemedVouchers = useMemo(() => {
    return activities.filter(a => a.type === 'REDEEM');
  }, [activities]);

  const handleCopy = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const isExpired = (expiry?: number) => {
    if (!expiry) return false;
    return Date.now() > expiry;
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">My <span className="text-green-600">Rewards Vault</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Your active and past redeemed vouchers.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <i className="fa-solid fa-ticket text-green-500 text-xl"></i>
          <span className="font-black text-slate-700">{redeemedVouchers.length} Total Rewards</span>
        </div>
      </div>

      {redeemedVouchers.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="fa-solid fa-vault text-4xl text-slate-200"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Vault is Empty</h2>
          <p className="text-slate-400 mb-8 max-w-xs mx-auto">Start recycling to earn Eco-Coins and redeem amazing rewards from our catalog!</p>
          <Link to="/rewards" className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tight shadow-lg shadow-green-100 hover:bg-green-700 transition-all">
            Browse Rewards
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {redeemedVouchers.map(voucher => {
            const expired = isExpired(voucher.expiryTimestamp);
            
            return (
              <Link 
                to={`/vault/${voucher.id}`}
                key={voucher.id} 
                className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl relative ${expired ? 'opacity-60' : ''}`}
              >
                {/* Perforated Edge Effect */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100 z-10"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100 z-10"></div>
                
                <div className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl text-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-ticket"></i>
                    </div>
                    <div className="text-right">
                       <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${expired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                        {expired ? 'Expired' : 'Active'}
                       </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{voucher.provider}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-4">{voucher.title}</p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <i className="fa-solid fa-calendar-day text-[10px] text-slate-300"></i>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Expires: {voucher.expiryTimestamp ? new Date(voucher.expiryTimestamp).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto p-8 pt-6 bg-slate-50 border-t border-dashed border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Voucher Code</p>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl font-mono text-center font-black text-lg tracking-widest text-slate-800 uppercase">
                      {voucher.code || 'XXXX-XXXX'}
                    </div>
                    <button 
                      onClick={(e) => voucher.code && handleCopy(e, voucher.code)}
                      disabled={expired}
                      className={`w-14 rounded-xl flex items-center justify-center transition-all ${expired ? 'bg-slate-200 text-slate-400' : copySuccess === voucher.code ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                    >
                      <i className={`fa-solid ${copySuccess === voucher.code ? 'fa-check' : 'fa-copy'}`}></i>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Security Tip */}
      <div className="mt-16 p-8 bg-blue-50 rounded-[3rem] border border-blue-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl text-blue-600 shadow-sm shrink-0">
          <i className="fa-solid fa-user-shield"></i>
        </div>
        <div>
          <h4 className="font-black text-blue-900 uppercase tracking-tight mb-1">Protector Privacy Tip</h4>
          <p className="text-sm text-blue-800/70 font-medium">Click on any voucher card to view full details, including detailed terms and usage instructions. Never share your voucher codes until you are ready to use them.</p>
        </div>
      </div>
    </div>
  );
};

export default MyVouchers;
