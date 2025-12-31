
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode, balance: number, email: string, onLogout: () => void }> = ({ children, balance, email, onLogout }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Trigger animation when balance changes
  useEffect(() => {
    if (balance > 0) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [balance]);

  const navItemClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-medium text-[15px] ${
      isActive 
      ? 'bg-[#f0fdf4] text-[#16a34a]' 
      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 p-8 sticky top-0 h-screen z-50">
        <div className="flex items-center gap-4 mb-14 px-2">
          <div className="w-11 h-11 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100">
            <i className="fa-solid fa-leaf text-xl"></i>
          </div>
          <span className="text-2xl font-black text-slate-800 italic tracking-tighter uppercase">EcoVend</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <NavLink to="/" className={navItemClass}>
            <i className="fa-solid fa-house text-lg"></i> Dashboard
          </NavLink>
          <NavLink to="/recycle" className={navItemClass}>
            <i className="fa-solid fa-camera text-lg"></i> Recycle Item
          </NavLink>
          <NavLink to="/shop" className={navItemClass}>
            <i className="fa-solid fa-bottle-water text-lg"></i> Vending Shop
          </NavLink>
          <NavLink to="/wallet" className={navItemClass}>
            <i className="fa-solid fa-wallet text-lg"></i> Wallet & Cash
          </NavLink>
          <NavLink to="/rewards" className={navItemClass}>
            <i className="fa-solid fa-gift text-lg"></i> Rewards Catalog
          </NavLink>
          <NavLink to="/my-vouchers" className={navItemClass}>
            <i className="fa-solid fa-ticket text-lg"></i> My Vouchers
          </NavLink>
          <NavLink to="/history" className={navItemClass}>
            <i className="fa-solid fa-clock-rotate-left text-lg"></i> History
          </NavLink>
        </nav>

        <div className="mt-auto space-y-6">
          <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Signed in as</p>
             <p className="text-xs text-slate-600 truncate font-bold">{email}</p>
             <button 
              onClick={onLogout}
              className="mt-4 text-[10px] font-black text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
             >
               LOGOUT
             </button>
          </div>
          
          <div className={`bg-[#16a34a] rounded-[2rem] p-6 text-white shadow-2xl shadow-green-200 transition-all duration-500 relative overflow-hidden group ${shouldAnimate ? 'scale-[1.02] ring-4 ring-yellow-400/20' : ''}`}>
            <p className="text-xs font-bold text-white/60 mb-2 relative z-10">Current Balance</p>
            <div className="flex items-center gap-3 relative z-10">
              <i className={`fa-solid fa-coins text-yellow-400 text-xl transition-transform duration-700 ${shouldAnimate ? 'rotate-[360deg]' : ''}`}></i>
              <span className="text-3xl font-black tracking-tighter">{balance}</span>
              <span className="text-sm font-bold opacity-60 ml-1">coins</span>
            </div>
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <header className="md:hidden bg-white border-b border-slate-100 p-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-white">
            <i className="fa-solid fa-leaf text-sm"></i>
          </div>
          <span className="font-black text-slate-800 uppercase italic tracking-tighter">EcoVend</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`bg-green-50 px-4 py-2 rounded-2xl text-green-600 font-black flex items-center gap-2 text-sm transition-all duration-500 shadow-sm ${shouldAnimate ? 'scale-110 bg-yellow-50' : ''}`}>
            <i className={`fa-solid fa-coins text-yellow-500 transition-transform duration-700 ${shouldAnimate ? 'rotate-[360deg]' : ''}`}></i> {balance}
          </div>
          <button onClick={onLogout} className="text-slate-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-right-from-bracket"></i></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 pb-28 md:pb-12 overflow-y-auto min-h-screen">
        {children}
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white shadow-2xl flex justify-around p-4 z-50 rounded-[2.5rem]">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-[#16a34a] scale-110' : 'text-slate-300'}`}>
          <i className="fa-solid fa-house text-xl"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </NavLink>
        <NavLink to="/recycle" className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-[#16a34a] scale-110' : 'text-slate-300'}`}>
          <i className="fa-solid fa-camera text-xl"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Scan</span>
        </NavLink>
        <NavLink to="/rewards" className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-[#16a34a] scale-110' : 'text-slate-300'}`}>
          <i className="fa-solid fa-gift text-xl"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Catalog</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-[#16a34a] scale-110' : 'text-slate-300'}`}>
          <i className="fa-solid fa-clock-rotate-left text-xl"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">History</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
