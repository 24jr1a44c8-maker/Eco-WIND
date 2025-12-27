
import React, { useState, useMemo } from 'react';
import { Activity } from '../types';
import { COINS_PER_RUPEE } from '../constants';

interface WalletProps {
  balance: number;
  onCashOut: (coins: number, method: string) => boolean;
  activities: Activity[];
}

const TRANSFER_METHODS = [
  { id: 'upi', name: 'UPI (GPay/PhonePe)', icon: 'fa-bolt', color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'bank', name: 'Direct Bank Transfer', icon: 'fa-building-columns', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'paytm', name: 'Paytm Wallet', icon: 'fa-wallet', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { id: 'amazon', name: 'Amazon Pay', icon: 'fa-amazon', color: 'text-orange-600', bg: 'bg-orange-50' }
];

const Wallet: React.FC<WalletProps> = ({ balance, onCashOut, activities }) => {
  const [amount, setAmount] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState(TRANSFER_METHODS[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const cashOutHistory = useMemo(() => {
    return activities.filter(a => a.type === 'CASH_OUT').slice(0, 5);
  }, [activities]);

  const handleWithdraw = () => {
    if (amount <= 0 || amount > balance) {
      alert("Please enter a valid amount within your balance.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const success = onCashOut(amount, selectedMethod.name);
      setIsProcessing(false);
      if (success) {
        setAmount(0);
      }
    }, 2000);
  };

  const cashValue = (amount / COINS_PER_RUPEE).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">My <span className="text-green-600">Wallet</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Turn your environmental impact into real-world rewards.</p>
        </div>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exchange Rate</p>
              <p className="text-sm font-bold">{COINS_PER_RUPEE} Coins = ₹1.00</p>
           </div>
           <div className="w-px h-8 bg-white/10"></div>
           <i className="fa-solid fa-rotate text-green-500 animate-spin-slow"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Balance & Conversion (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Balance Dashboard */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
               <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Eco-Balance</p>
                  <div className="flex items-center gap-3">
                     <i className="fa-solid fa-coins text-4xl text-yellow-500 group-hover:scale-110 transition-transform"></i>
                     <h2 className="text-6xl font-black text-slate-900 tracking-tighter">{balance}</h2>
                  </div>
               </div>
               
               <div className="hidden md:block w-px h-20 bg-slate-100"></div>
               
               <div className="text-center md:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Cash Equivalent</p>
                  <div className="flex items-center gap-3 justify-end">
                     <h2 className="text-6xl font-black text-green-600 tracking-tighter">₹{(balance / COINS_PER_RUPEE).toFixed(0)}</h2>
                     <i className="fa-solid fa-indian-rupee-sign text-3xl text-green-600 opacity-30"></i>
                  </div>
               </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
               <i className="fa-solid fa-vault text-[15rem]"></i>
            </div>
          </div>

          {/* Cash Out Form */}
          <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <h3 className="text-2xl font-black italic uppercase tracking-tight mb-8">Convert to Cash</h3>
             
             <div className="space-y-8">
                {/* Method Selector */}
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Select Payout Method</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {TRANSFER_METHODS.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all ${selectedMethod.id === m.id ? 'bg-white border-green-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${m.bg} ${m.color}`}>
                             <i className={`fa-solid ${m.icon}`}></i>
                          </div>
                          <span className={`text-[9px] font-black uppercase text-center leading-tight ${selectedMethod.id === m.id ? 'text-slate-900' : 'text-slate-400'}`}>{m.name.split(' ')[0]}</span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Amount Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                   <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Amount to Transfer (Coins)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount || ''}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          max={balance}
                          min={1}
                          className="w-full bg-white/5 border-2 border-transparent focus:border-green-500 px-6 py-5 rounded-[1.5rem] outline-none text-4xl font-black text-white transition-all placeholder:text-white/10"
                          placeholder="0"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                           <button onClick={() => setAmount(balance)} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">Max</button>
                        </div>
                      </div>
                   </div>
                   
                   <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/5 flex items-center justify-between">
                      <div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Payout</p>
                         <p className="text-3xl font-black text-green-500">₹{cashValue}</p>
                      </div>
                      <i className="fa-solid fa-arrow-right-arrow-left text-white/20 text-xl"></i>
                   </div>
                </div>

                <button
                  disabled={isProcessing || amount <= 0 || amount > balance}
                  onClick={handleWithdraw}
                  className={`w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all transform active:scale-[0.98] ${isProcessing || amount <= 0 || amount > balance ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500 shadow-green-500/20'}`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-4">
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      PROCESSING TRANSFER...
                    </span>
                  ) : (
                    `WITHDRAW TO ${selectedMethod.name.split(' ')[0]}`
                  )}
                </button>
             </div>
          </div>
        </div>

        {/* Right Section: Recent Payout Ledger (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm h-full flex flex-col">
              <h3 className="text-2xl font-black italic uppercase tracking-tight mb-8">Recent Payouts</h3>
              
              <div className="flex-1 space-y-4">
                 {cashOutHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-30">
                       <i className="fa-solid fa-receipt text-6xl mb-4"></i>
                       <p className="text-sm font-bold uppercase tracking-widest">No payout records yet</p>
                    </div>
                 ) : (
                    cashOutHistory.map(activity => (
                       <div key={activity.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-lg text-slate-900 shadow-sm">
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                             </div>
                             <div>
                                <h4 className="font-black text-slate-800 text-sm leading-tight">{activity.provider}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                                   {new Date(activity.timestamp).toLocaleDateString()}
                                </p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-black text-green-600">₹{activity.currencyAmount?.toFixed(0)}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">COMPLETED</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                 <div className="flex items-center gap-4 mb-3">
                    <i className="fa-solid fa-shield-check text-blue-600 text-xl"></i>
                    <h4 className="font-black text-blue-900 text-sm uppercase tracking-tight">Security Verified</h4>
                 </div>
                 <p className="text-xs text-blue-800/70 font-medium leading-relaxed">
                    All transfers are encrypted and monitored by EcoVend SafePay. Standard processing time: 5-10 minutes.
                 </p>
              </div>
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Wallet;
