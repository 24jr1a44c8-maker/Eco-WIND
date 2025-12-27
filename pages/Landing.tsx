
import React, { useState, useEffect } from 'react';

interface LandingProps {
  onSelect: (choice: 'SHOP' | 'RECYCLE') => void;
}

const Landing: React.FC<LandingProps> = ({ onSelect }) => {
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [accessing, setAccessing] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setBooting(false), 300);
          return 100;
        }
        return prev + 4; // Faster boot sequence
      });
    }, 15);
    return () => clearInterval(timer);
  }, []);

  const handleSelection = (choice: 'SHOP' | 'RECYCLE') => {
    setAccessing(choice);
    setTimeout(() => onSelect(choice), 800);
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-12 overflow-hidden font-mono">
        <div className="max-w-md w-full animate-in fade-in duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-black animate-pulse">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <div>
              <h2 className="text-green-500 text-xl font-bold tracking-tighter uppercase">EcoVend OS v4.0.1</h2>
              <p className="text-green-900 text-[10px] font-bold uppercase">System Initialization...</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-10">
            <div className="flex justify-between text-[10px] text-green-700 font-bold uppercase tracking-widest">
              <span>Syncing AI Cores</span>
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
            <p className="text-[9px] text-green-900 leading-none">VENDING MOTORS... OK</p>
            <p className="text-[9px] text-green-800 leading-none mt-2 animate-pulse font-black uppercase">Ready for User</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-0 m-0 overflow-hidden font-sans select-none relative animate-in fade-in duration-1000">
      
      {/* Accessing Overlay */}
      {accessing && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className={`w-24 h-24 rounded-full border-4 border-t-transparent animate-spin mb-8 ${accessing === 'SHOP' ? 'border-blue-500' : 'border-green-500'}`}></div>
           <p className="text-white font-black uppercase tracking-[0.5em] text-sm animate-pulse">Initializing {accessing} Terminal...</p>
        </div>
      )}

      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[150px] rounded-full animate-pulse"></div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full h-screen relative z-10">
        
        {/* SHOP MODE (VENDING MACHINE) */}
        <button 
          onClick={() => handleSelection('SHOP')}
          className="relative flex-1 group cursor-pointer overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:flex-[1.5] border-b md:border-b-0 md:border-r border-white/5 outline-none text-left"
        >
          <div className="absolute inset-0 bg-slate-950 transition-colors duration-1000 group-hover:bg-blue-600/10"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.2)_0%,transparent_70%)]"></div>
          
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-12 relative">
               <div className="w-32 h-32 bg-slate-900 border-2 border-white/5 rounded-[3rem] flex items-center justify-center text-blue-500 text-5xl group-hover:text-white group-hover:bg-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl relative z-20">
                  <i className="fa-solid fa-cart-shopping"></i>
               </div>
               <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/40 blur-3xl rounded-full transition-all duration-700 scale-150"></div>
            </div>

            <div className="space-y-4 mb-10">
               <p className="text-blue-500/60 font-black text-xs uppercase tracking-[0.5em] group-hover:text-blue-400 transition-colors">Digital Kiosk</p>
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none group-hover:scale-105 transition-transform duration-700">
                  VENDING<br/><span className="text-blue-600 not-italic">MACHINE</span>
               </h2>
            </div>

            <p className="text-slate-500 font-bold text-lg max-w-xs group-hover:text-slate-300 transition-colors duration-700">
              Refreshments & snacks. Use coins for discounts.
            </p>

            <div className="mt-12 group-hover:translate-y-0 translate-y-8 opacity-0 group-hover:opacity-100 transition-all duration-700">
               <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-tighter shadow-2xl">
                  <span>Enter Store</span>
                  <i className="fa-solid fa-arrow-right-long"></i>
               </div>
            </div>
          </div>
        </button>

        {/* RECYCLE MODE (SMART HUB) */}
        <button 
          onClick={() => handleSelection('RECYCLE')}
          className="relative flex-1 group cursor-pointer overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:flex-[1.5] outline-none text-left"
        >
          <div className="absolute inset-0 bg-slate-950 transition-colors duration-1000 group-hover:bg-green-600/10"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.2)_0%,transparent_70%)]"></div>

          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-12 relative">
               <div className="w-32 h-32 bg-slate-900 border-2 border-white/5 rounded-[3rem] flex items-center justify-center text-green-500 text-5xl group-hover:text-white group-hover:bg-green-600 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 shadow-2xl relative z-20">
                  <i className="fa-solid fa-recycle"></i>
               </div>
               <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/40 blur-3xl rounded-full transition-all duration-700 scale-150"></div>
            </div>

            <div className="space-y-4 mb-10">
               <p className="text-green-500/60 font-black text-xs uppercase tracking-[0.5em] group-hover:text-green-400 transition-colors">Sustainable Hub</p>
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none group-hover:scale-105 transition-transform duration-700">
                  RECYCLE<br/><span className="text-green-600 not-italic">HUB</span>
               </h2>
            </div>

            <p className="text-slate-500 font-bold text-lg max-w-xs group-hover:text-slate-300 transition-colors duration-700">
              Deposit containers & earn rewards via Vision AI.
            </p>

            <div className="mt-12 group-hover:translate-y-0 translate-y-8 opacity-0 group-hover:opacity-100 transition-all duration-700">
               <div className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-tighter shadow-2xl">
                  <span>Start Earning</span>
                  <i className="fa-solid fa-arrow-right-long"></i>
               </div>
            </div>
          </div>
        </button>

      </div>

      {/* Top Navigation Overlay */}
      <div className="absolute top-10 left-10 right-10 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 shadow-2xl">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-black">
            <i className="fa-solid fa-leaf text-xl"></i>
          </div>
          <div>
            <h1 className="text-white font-black uppercase tracking-tighter leading-none text-xl">EcoVend <span className="text-green-500">AI</span></h1>
            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.3em]">Smart Terminal</p>
          </div>
        </div>

        <button 
          onClick={() => handleSelection('RECYCLE')} // Defaults to recycle if just logging in
          className="pointer-events-auto flex items-center gap-4 bg-white/5 backdrop-blur-xl pl-6 pr-2 py-2 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group shadow-2xl"
        >
          <span className="text-white font-black text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Returning Protector?</span>
          <div className="bg-white text-black px-6 py-2 rounded-2xl font-black text-[11px] uppercase tracking-tighter shadow-xl group-hover:bg-green-500 group-hover:text-white transition-all">
            Sign In
          </div>
        </button>
      </div>

    </div>
  );
};

export default Landing;
