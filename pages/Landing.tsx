
import React from 'react';

interface LandingProps {
  onSelect: (choice: 'SHOP' | 'RECYCLE') => void;
}

const Landing: React.FC<LandingProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-[2rem] text-white shadow-2xl shadow-green-200 mb-6 animate-bounce">
          <i className="fa-solid fa-leaf text-4xl"></i>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
          Welcome to <span className="text-green-600">EcoVend</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          India's smartest AI-powered recycling vending machine. 
          Earn coins for every item you recycle and spend them on your favorite snacks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Choice: Shop */}
        <button 
          onClick={() => onSelect('SHOP')}
          className="group relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl transition-all hover:scale-[1.02] active:scale-95 text-left"
        >
          <div className="relative h-full w-full rounded-[2.9rem] bg-white/10 p-10 backdrop-blur-xl border border-white/20">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/20 text-white shadow-xl transition-transform group-hover:rotate-12">
              <i className="fa-solid fa-cart-shopping text-5xl"></i>
            </div>
            <h2 className="text-4xl font-black text-white">Buy Items</h2>
            <p className="mt-4 text-blue-100 text-lg opacity-90 leading-relaxed">
              Thirsty or hungry? Use your earned Eco-Coins to get instant discounts on drinks and snacks.
            </p>
            <div className="mt-12 flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest bg-white/20 w-fit px-6 py-3 rounded-2xl">
              I WANT TO BUY <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-2"></i>
            </div>
            
            {/* Background Icons */}
            <div className="absolute top-10 right-10 flex flex-col gap-4 opacity-10">
               <i className="fa-solid fa-bottle-water text-8xl text-white"></i>
               <i className="fa-solid fa-cookie-bite text-6xl text-white ml-12"></i>
            </div>
          </div>
        </button>

        {/* Choice: Recycle */}
        <button 
          onClick={() => onSelect('RECYCLE')}
          className="group relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-green-500 to-emerald-700 p-1 shadow-2xl transition-all hover:scale-[1.02] active:scale-95 text-left"
        >
          <div className="relative h-full w-full rounded-[2.9rem] bg-white/10 p-10 backdrop-blur-xl border border-white/20">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/20 text-white shadow-xl transition-transform group-hover:-rotate-12">
              <i className="fa-solid fa-recycle text-5xl"></i>
            </div>
            <h2 className="text-4xl font-black text-white">Recycle Item</h2>
            <p className="mt-4 text-green-100 text-lg opacity-90 leading-relaxed">
              Got empty bottles or cans? Feed the machine, save the planet, and earn coins for your wallet.
            </p>
            <div className="mt-12 flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest bg-white/20 w-fit px-6 py-3 rounded-2xl">
              I HAVE ITEMS <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-2"></i>
            </div>

            {/* Background Icons */}
            <div className="absolute top-10 right-10 flex flex-col gap-4 opacity-10">
               <i className="fa-solid fa-trash-can text-8xl text-white"></i>
               <i className="fa-solid fa-earth-asia text-6xl text-white ml-12"></i>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-16 flex items-center gap-8 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-shield-halved"></i> SECURE VENDING
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-bolt"></i> AI POWERED
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-heart text-red-400"></i> MADE FOR EARTH
        </div>
      </div>
    </div>
  );
};

export default Landing;
