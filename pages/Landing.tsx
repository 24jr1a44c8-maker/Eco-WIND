
import React from 'react';

interface LandingProps {
  onSelect: (choice: 'SHOP' | 'RECYCLE') => void;
}

const Landing: React.FC<LandingProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-0 m-0 overflow-hidden font-sans select-none relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-green-600/10 blur-[180px] rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      {/* Hero Header */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 text-center w-full pointer-events-none">
        <div className="inline-flex flex-col items-center gap-2 px-10 py-6 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
              <i className="fa-solid fa-leaf text-3xl"></i>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">EcoVend <span className="text-green-500">AI</span></h1>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 block">The Future of Vending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Mode Selection */}
      <div className="flex flex-col md:flex-row w-full h-screen">
        
        {/* SHOP MODE PANEL (VENDING MACHINE) */}
        <button 
          onClick={() => onSelect('SHOP')}
          className="relative flex-1 group overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] hover:flex-[1.8] border-b md:border-b-0 md:border-r border-white/5 outline-none"
        >
          {/* Visual Layer */}
          <div className="absolute inset-0 bg-slate-950 transition-colors duration-1000 group-hover:bg-blue-950/40"></div>
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
          
          {/* Animated Icons Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.12] transition-opacity duration-1000">
             <i className="fa-solid fa-cookie-bite absolute top-1/4 left-1/4 text-8xl -rotate-12 group-hover:scale-125 transition-transform duration-1000"></i>
             <i className="fa-solid fa-bottle-water absolute bottom-1/4 right-1/4 text-[18rem] rotate-12 group-hover:scale-110 transition-transform duration-1000"></i>
             <i className="fa-solid fa-store absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45rem] opacity-10"></i>
          </div>

          {/* Interactive Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center z-10 pt-32 md:pt-12">
            <div className="w-36 h-36 bg-blue-600 rounded-[3.5rem] flex items-center justify-center text-white text-6xl mb-10 shadow-[0_0_60px_rgba(37,99,235,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative">
              <i className="fa-solid fa-cart-shopping"></i>
              <div className="absolute -top-4 -right-4 bg-white text-blue-600 text-[10px] font-black px-4 py-2 rounded-full shadow-xl">OPEN</div>
            </div>
            
            <div className="space-y-2 mb-8">
              <span className="text-blue-400 font-black text-xs uppercase tracking-[0.5em] opacity-70 group-hover:opacity-100 transition-opacity">Select Mode</span>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
                VENDING <span className="text-blue-500 block not-italic mt-2">MACHINE</span>
              </h2>
            </div>
            
            <p className="text-blue-200/40 font-bold text-xl max-w-sm mx-auto uppercase tracking-wide leading-tight group-hover:text-blue-100 transition-colors duration-500">
              Refreshments & Quick Bites<br/>
              <span className="text-blue-500/80">Redeem coins for instant discounts</span>
            </p>

            <div className="mt-16 h-20 overflow-hidden">
               <div className="bg-white text-blue-950 px-16 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all duration-700 transform translate-y-32 group-hover:translate-y-0 uppercase tracking-tighter flex items-center gap-4 hover:bg-blue-600 hover:text-white">
                  <span>Start Shopping</span>
                  <i className="fa-solid fa-arrow-right-long text-lg"></i>
               </div>
            </div>
          </div>

          {/* Glowing Border Hover */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-700 shadow-[0_-15px_40px_rgba(59,130,246,0.6)]"></div>
        </button>

        {/* RECYCLE MODE PANEL (RECYCLE HUB) */}
        <button 
          onClick={() => onSelect('RECYCLE')}
          className="relative flex-1 group overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] hover:flex-[1.8] outline-none"
        >
          {/* Visual Layer */}
          <div className="absolute inset-0 bg-slate-950 transition-colors duration-1000 group-hover:bg-green-950/40"></div>
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
          
          {/* Animated Icons Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.12] transition-opacity duration-1000">
             <i className="fa-solid fa-recycle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45rem] opacity-10"></i>
             <i className="fa-solid fa-leaf absolute top-1/3 right-1/4 text-9xl rotate-12 group-hover:scale-125 transition-transform duration-1000"></i>
             <i className="fa-solid fa-coins absolute bottom-1/4 left-1/4 text-[12rem] -rotate-12 group-hover:scale-110 transition-transform duration-1000"></i>
          </div>

          {/* Interactive Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center z-10 pt-32 md:pt-12">
            <div className="w-36 h-36 bg-green-500 rounded-[3.5rem] flex items-center justify-center text-white text-6xl mb-10 shadow-[0_0_60px_rgba(34,197,94,0.4)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 relative">
              <i className="fa-solid fa-recycle"></i>
              <div className="absolute -top-4 -right-4 bg-white text-green-600 text-[10px] font-black px-4 py-2 rounded-full shadow-xl">ACTIVE</div>
            </div>
            
            <div className="space-y-2 mb-8">
              <span className="text-green-400 font-black text-xs uppercase tracking-[0.5em] opacity-70 group-hover:opacity-100 transition-opacity">Select Mode</span>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
                RECYCLE <span className="text-green-500 block not-italic mt-2">HUB</span>
              </h2>
            </div>
            
            <p className="text-green-200/40 font-bold text-xl max-w-sm mx-auto uppercase tracking-wide leading-tight group-hover:text-green-100 transition-colors duration-500">
              Deposit Plastic, Metal & Glass<br/>
              <span className="text-green-400/80">Earn digital coins instantly</span>
            </p>

            <div className="mt-16 h-20 overflow-hidden">
               <div className="bg-white text-green-950 px-16 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all duration-700 transform translate-y-32 group-hover:translate-y-0 uppercase tracking-tighter flex items-center gap-4 hover:bg-green-600 hover:text-white">
                  <span>Start Recycling</span>
                  <i className="fa-solid fa-arrow-right-long text-lg"></i>
               </div>
            </div>
          </div>

          {/* Glowing Border Hover */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-green-500 opacity-0 group-hover:opacity-100 transition-all duration-700 shadow-[0_-15px_40px_rgba(34,197,94,0.6)]"></div>
        </button>

      </div>

      {/* Footer Instruction */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 animate-bounce">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-white">
               <i className="fa-solid fa-hand-pointer opacity-50"></i>
            </div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Tap to Choose Your Journey</p>
         </div>
      </div>
    </div>
  );
};

export default Landing;
