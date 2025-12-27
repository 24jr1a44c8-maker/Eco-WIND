
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { VOUCHERS, COINS_PER_RUPEE } from '../constants';
import { Activity } from '../types';

interface VoucherDetailProps {
  activities: Activity[];
  balance: number;
  onRedeem: (cost: number, provider: string) => boolean;
}

const VoucherDetail: React.FC<VoucherDetailProps> = ({ activities, balance, onRedeem }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Determine if we are viewing a template (from rewards) or an instance (from vault)
  const isFromVault = location.pathname.includes('/vault/');
  
  const voucherData = useMemo(() => {
    if (isFromVault) {
      // Find the specific redeemed activity
      const activity = activities.find(a => a.id === id);
      if (!activity) return null;
      
      // Also try to find the template for terms
      const template = VOUCHERS.find(v => v.provider === activity.provider);
      
      return {
        isRedeemed: true,
        provider: activity.provider,
        title: activity.title,
        code: activity.code,
        expiryTimestamp: activity.expiryTimestamp,
        amount: Math.abs(activity.amount), // cost in coins
        terms: template?.terms || ['Standard voucher terms apply.'],
        image: template?.image || 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=400',
        description: template?.description || 'Redeemed digital voucher.'
      };
    } else {
      // Find the template
      const template = VOUCHERS.find(v => v.id === id);
      if (!template) return null;
      
      return {
        isRedeemed: false,
        id: template.id,
        provider: template.provider,
        title: `₹${template.amount} Voucher`,
        cost: template.cost,
        amountValue: template.amount,
        terms: template.terms || ['Standard voucher terms apply.'],
        image: template.image,
        description: template.description
      };
    }
  }, [id, isFromVault, activities]);

  if (!voucherData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <i className="fa-solid fa-circle-exclamation text-6xl text-slate-200 mb-6"></i>
        <h2 className="text-2xl font-black text-slate-800">Voucher Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 text-green-600 font-bold uppercase">Go Back</button>
      </div>
    );
  }

  const handleRedeemClick = () => {
    if (!voucherData.cost) return;
    setIsRedeeming(true);
    setTimeout(() => {
      const success = onRedeem(voucherData.cost!, voucherData.provider!);
      setIsRedeeming(false);
      if (success) {
        navigate('/my-vouchers');
      }
    }, 1500);
  };

  const handleCopy = () => {
    if (voucherData.code) {
      navigator.clipboard.writeText(voucherData.code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const isExpired = voucherData.expiryTimestamp ? Date.now() > voucherData.expiryTimestamp : false;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase text-xs tracking-widest"
      >
        <i className="fa-solid fa-arrow-left-long"></i>
        Back
      </button>

      <div className="bg-white rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden">
        {/* Brand Banner */}
        <div className="h-64 relative overflow-hidden bg-slate-950">
          <img 
            src={voucherData.image} 
            className={`w-full h-full object-cover transition-transform duration-[2s] hover:scale-110 ${isExpired ? 'grayscale' : ''}`} 
            alt={voucherData.provider} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Digital Reward</p>
              <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">{voucherData.provider}</h1>
            </div>
            {voucherData.isRedeemed && (
               <div className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest ${isExpired ? 'bg-red-500 text-white' : 'bg-green-500 text-white animate-pulse'}`}>
                  {isExpired ? 'Expired' : 'Active Reward'}
               </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Details Content */}
          <div className="lg:col-span-7 p-10 lg:p-14 border-r border-slate-50">
            <h2 className="text-3xl font-black text-slate-900 mb-4">{voucherData.title}</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10">{voucherData.description}</p>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Terms & Conditions</h3>
                <ul className="space-y-4">
                  {voucherData.terms?.map((term, i) => (
                    <li key={i} className="flex gap-4 text-sm font-medium text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-[10px] text-green-500"></i>
                      </div>
                      {term}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">How to Use</h3>
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    1. Copy the code provided on the right.<br/>
                    2. Open the {voucherData.provider} app or website.<br/>
                    3. Apply the code at the checkout or payment section.<br/>
                    4. Enjoy your eco-reward!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-5 p-10 lg:p-14 bg-slate-50/50 flex flex-col justify-center">
            {voucherData.isRedeemed ? (
              <div className="space-y-10 text-center">
                <div className="relative group">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Redemption Code</p>
                   <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-8 shadow-inner font-mono text-3xl font-black text-slate-900 tracking-[0.2em] relative overflow-hidden">
                      {voucherData.code}
                      {isExpired && <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-[2px] flex items-center justify-center rotate-6 text-red-500 font-black text-xl uppercase italic">Expired</div>}
                   </div>
                   {!isExpired && (
                     <button 
                      onClick={handleCopy}
                      className={`mt-6 w-full py-4 rounded-2xl font-black uppercase tracking-tight text-sm shadow-xl transition-all active:scale-95 ${copySuccess ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                     >
                        {copySuccess ? 'Copied to Clipboard!' : 'Copy Code'}
                     </button>
                   )}
                </div>

                <div className="flex flex-col items-center">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Valid Until</p>
                   <p className="font-black text-slate-600 text-xl">
                      {voucherData.expiryTimestamp ? new Date(voucherData.expiryTimestamp).toLocaleDateString() : 'Lifetime'}
                   </p>
                </div>
              </div>
            ) : (
              <div className="space-y-10 text-center">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Required Coins</p>
                    <div className="flex items-center justify-center gap-3">
                       <i className="fa-solid fa-coins text-yellow-500 text-3xl"></i>
                       <span className="text-6xl font-black text-slate-900 tracking-tighter">{voucherData.cost}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 mt-4 italic">Equivalent to ₹{voucherData.amountValue}</p>
                 </div>

                 <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">My Balance</p>
                    <div className={`text-2xl font-black ${balance >= (voucherData.cost || 0) ? 'text-green-600' : 'text-red-500'}`}>
                       {balance} Coins
                    </div>
                 </div>

                 <button
                    disabled={isRedeeming || balance < (voucherData.cost || 0)}
                    onClick={handleRedeemClick}
                    className={`w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all transform active:scale-[0.98] ${isRedeeming || balance < (voucherData.cost || 0) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500 shadow-green-200/50'}`}
                 >
                    {isRedeeming ? (
                      <span className="flex items-center justify-center gap-4">
                        <div className="w-6 h-6 border-4 border-slate-300 border-t-white rounded-full animate-spin"></div>
                        REDEEMING...
                      </span>
                    ) : (
                      balance >= (voucherData.cost || 0) ? 'REDEEM NOW' : 'INSUFFICIENT BALANCE'
                    )}
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">EcoVend Loyalty Program &copy; 2024</p>
      </div>
    </div>
  );
};

export default VoucherDetail;
