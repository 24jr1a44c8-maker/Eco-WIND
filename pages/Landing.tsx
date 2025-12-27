
import React, { useState, useEffect } from 'react';

interface LandingProps {
  onSelect: (choice: 'SHOP' | 'RECYCLE') => void;
}

const Landing: React.FC<LandingProps> = ({ onSelect }) => {
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setBooting(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-12 overflow-hidden font-mono">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-black animate-pulse">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <div>
              <h2 className="text-green-500 text-xl font-bold tracking-tighter uppercase">EcoVend OS v4.0.1</h2>
              <p className="text-green-900 text-[10px] font-bold">KERNEL INITIALIZATION...</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-10">
            <div className="flex justify-between text-[10px] text-green-700 font-bold uppercase tracking-widest">
              <span>System Integrity</span>
              <span>{bootProgress}%</span>
            </div>
            <div className="h-1 bg-green-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                style={{ width: `${bootProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] text-green-900 leading-none">CHECKING SENSORS... OK</p>
            <p className="text-[9px] text-green-900 leading-none">AI CORE SYNCING... OK</p>
            <p className="text-[9px] text-green-900 leading-none">VENDING MOTORS... OK</p>
            <p className="text-[9px] text-green-800 leading-none mt-2 animate-pulse">READY FOR USER INPUT</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-0 m-0 overflow-hidden font-sans select-none relative animate-in fade-in duration-1000">
      
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[150px] rounded-full animate-pulse"></div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full h-screen relative z-10">
        
        {/* SHOP MODE (VENDING MACHINE) */}
        <div 
          onClick={() => onSelect('SHOP')}
          className="relative flex-1 group cursor-pointer overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:flex-[1.5] border-b md:border-b-0 md:border-r border-white/5"
        >
          {/* Visual Ambiance */}
          <div className="absolute inset-0 bg-slate-950 transition-colors duration-1000 group-hover:bg-blue-600/10"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.2)_0%,transparent_70%)]"></div>
          
          {/* Animated Element Stack */}
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-12 relative">
               <div className="w-32 h-32 bg-slate-900 border-2 border-white/5 rounded-[3rem] flex items-center justify-center text-blue-500 text-5xl group-hover:text-white group-hover:bg-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl relative z-20">
                  <i className="fa-solid fa-cart-shopping"></i>
               </div>
               {/* Background Glow */}
               <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/40 blur-3xl rounded-full transition-all duration-700 scale-150"></div>
               {/* Floating Snack Icons */}
               <i className="fa-solid fa-cookie-bite absolute -top-10 -right-10 text-4xl text-blue-900 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100 group-hover:translate-x-4 group-hover:-translate-y-4"></i>
               <i className="fa-solid fa-bottle-water absolute -bottom-10 -left-10 text-4xl text-blue-900 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200 group-hover:-translate-x-4 group-hover:translate-y-4"></i>
            </div>

            <div className="space-y-4 mb-10">
               <p className="text-blue-500/60 font-black text-xs uppercase tracking-[0.5em] group-hover:text-blue-400 transition-colors">Digital Kiosk</p>
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none group-hover:scale-105 transition-transform duration-700">
                  VENDING<br/><span className="text-blue-600 not-italic">MACHINE</span>
               </h2>
            </div>

            <p className="text-slate-500 font-bold text-lg max-w-xs group-hover:text-slate-300 transition-colors duration-700">
              Pick your refreshments & redeem saved coins for discounts.
            </p>

            <div className="mt-12 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-8 transition-all duration-700">
               <div className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-tighter shadow-2xl">
                  <span>Enter Store</span>
                  <i className="fa-solid fa-arrow-right-long"></i>
               </div>
            </div>
          </div>

          {/* Side Status Ticker */}
          <div className="absolute bottom-10 left-10 opacity-20 group-hover:opacity-100 transition-opacity">
             <div className="flex items-center gap-3 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Stock Level: Optimal
             </div>
          </div>
        </div>

        {/* RECYCLE MODE (SMART HUB) */}
        <div 
          onClick={() => onSelect('RECYCLE')}
          className="relative flex-1 group cursor-pointer overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:flex-[1.5]"
        >
          {/* Visual Ambiance */}
          <div className="absolute inset-0 bg-slate-950 transition-colors duration-1000 group-hover:bg-green-600/10"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.2)_0%,transparent_70%)]"></div>

          {/* Animated Element Stack */}
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-12 relative">
               <div className="w-32 h-32 bg-slate-900 border-2 border-white/5 rounded-[3rem] flex items-center justify-center text-green-500 text-5xl group-hover:text-white group-hover:bg-green-600 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 shadow-2xl relative z-20">
                  <i className="fa-solid fa-recycle"></i>
               </div>
               {/* Background Glow */}
               <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/40 blur-3xl rounded-full transition-all duration-700 scale-150"></div>
               {/* Floating Eco Icons */}
               <i className="fa-solid fa-leaf absolute -top-10 -left-10 text-4xl text-green-900 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100 group-hover:-translate-x-4 group-hover:-translate-y-4"></i>
               <i className="fa-solid fa-coins absolute -bottom-10 -right-10 text-4xl text-green-900 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200 group-hover:translate-x-4 group-hover:translate-y-4"></i>
            </div>

            <div className="space-y-4 mb-10">
               <p className="text-green-500/60 font-black text-xs uppercase tracking-[0.5em] group-hover:text-green-400 transition-colors">Sustainable Hub</p>
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none group-hover:scale-105 transition-transform duration-700">
                  RECYCLE<br/><span className="text-green-600 not-italic">HUB</span>
               </h2>
            </div>

            <p className="text-slate-500 font-bold text-lg max-w-xs group-hover:text-slate-300 transition-colors duration-700">
              Deposit containers to earn coins. Powered by Real-time Vision AI.
            </p>

            <div className="mt-12 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-8 transition-all duration-700">
               <div className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-tighter shadow-2xl">
                  <span>Start Recycling</span>
                  <i className="fa-solid fa-arrow-right-long"></i>
               </div>
            </div>
          </div>

          {/* Side Status Ticker */}
          <div className="absolute bottom-10 right-10 opacity-20 group-hover:opacity-100 transition-opacity">
             <div className="flex items-center gap-3 text-[10px] font-black text-green-500 uppercase tracking-widest">
                AI Recognition: Ready
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             </div>
          </div>
        </div>

      </div>

      {/* Floating Header */}
      <div className="absolute top-10 left-10 z-50 pointer-events-none">
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-black">
            <i className="fa-solid fa-leaf text-xl"></i>
          </div>
          <div>
            <h1 className="text-white font-black uppercase tracking-tighter leading-none text-xl">EcoVend <span className="text-green-500">AI</span></h1>
            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.3em]">Smart Kiosk Terminal</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Landing;
