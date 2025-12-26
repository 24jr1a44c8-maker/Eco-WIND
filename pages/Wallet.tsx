
import React, { useState } from 'react';

interface WalletProps {
  balance: number;
  onCashOut: (coins: number, method: string) => boolean;
}

const COIN_RATE = 1.0; // 1 Coin = ₹1.00

const Wallet: React.FC<WalletProps> = ({ balance, onCashOut }) => {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>('UPI (PhonePe/GPay)');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = () => {
    if (amount <= 0 || amount > balance) {
      alert("Please enter a valid amount within your balance.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const success = onCashOut(amount, method);
      setIsProcessing(false);
      if (success) {
        alert(`Successfully transferred ₹${(amount * COIN_RATE).toFixed(2)} to your ${method} account!`);
        setAmount(0);
      }
    }, 1500);
  };

  const cashValue = (amount * COIN_RATE).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Digital Wallet</h1>
        <p className="text-slate-500 mt-2">Withdraw your recycling earnings to your bank or UPI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Balance */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-green-600 p-8 rounded-3xl text-white shadow-xl shadow-green-100">
            <p className="text-sm opacity-80 mb-1">Withdrawable Balance</p>
            <h2 className="text-4xl font-bold mb-6">₹{(balance * COIN_RATE).toFixed(2)}</h2>
            <div className="flex items-center gap-2 bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <i className="fa-solid fa-coins text-yellow-400"></i>
              <span className="font-bold">{balance} Eco-Coins</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Transfer Via</h3>
            <div className="space-y-3">
              {['UPI (PhonePe/GPay)', 'Paytm Wallet', 'Net Banking', 'Amazon Pay'].map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${method === m ? 'border-green-600 bg-green-50' : 'border-slate-50 hover:bg-slate-50'}`}
                >
                  <span className={`font-semibold ${method === m ? 'text-green-700' : 'text-slate-600'}`}>{m}</span>
                  {method === m && <i className="fa-solid fa-circle-check text-green-600"></i>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Convert to Cash</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Amount of Coins to Convert</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    max={balance}
                    min={1}
                    className="w-full bg-slate-50 px-6 py-5 rounded-2xl border-2 border-transparent focus:border-green-600 outline-none text-2xl font-bold text-slate-800 transition-all"
                    placeholder="0"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                    <button 
                      onClick={() => setAmount(Math.floor(balance / 2))}
                      className="px-3 py-1 rounded-lg bg-slate-200 text-slate-600 text-[10px] font-bold"
                    >
                      50%
                    </button>
                    <button 
                      onClick={() => setAmount(balance)}
                      className="px-3 py-1 rounded-lg bg-slate-200 text-slate-600 text-[10px] font-bold"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">You will receive</p>
                  <p className="text-3xl font-bold text-green-600">₹{cashValue}</p>
                </div>
                <div className="text-right text-slate-400">
                  <p className="text-[10px] font-bold uppercase mb-1">Exchange Rate</p>
                  <p className="text-sm font-semibold">1 Coin = ₹1.00</p>
                </div>
              </div>

              <button
                disabled={isProcessing || amount <= 0 || amount > balance}
                onClick={handleWithdraw}
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg transition-all ${isProcessing || amount <= 0 || amount > balance ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-green-600 text-white shadow-green-100 hover:bg-green-700 active:scale-[0.98]'}`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payout...
                  </span>
                ) : (
                  `Withdraw to ${method}`
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                <i className="fa-solid fa-lock mr-2"></i>
                Verified by EcoVend Payments India.
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <i className="fa-solid fa-indian-rupee-sign"></i>
             </div>
             <div>
                <h4 className="font-bold text-blue-900">UPI Instant Transfer</h4>
                <p className="text-sm text-blue-800 opacity-80 mt-1">
                  Once you confirm, the amount is usually credited to your linked UPI ID within 5-10 minutes. Use it for snacks, chai, or mobile recharges!
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
