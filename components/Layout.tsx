
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <i className="fa-solid fa-leaf text-xl"></i>
          </div>
          <span className="text-xl font-bold text-slate-800">EcoVend</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fa-solid fa-house"></i> Dashboard
          </NavLink>
          <NavLink to="/recycle" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fa-solid fa-camera"></i> Recycle Item
          </NavLink>
          <NavLink to="/shop" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fa-solid fa-bottle-water"></i> Vending Shop
          </NavLink>
          <NavLink to="/wallet" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fa-solid fa-wallet"></i> Wallet & Cash
          </NavLink>
          <NavLink to="/rewards" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fa-solid fa-gift"></i> Rewards
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fa-solid fa-clock-rotate-left"></i> History
          </NavLink>
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Signed in as</p>
             <p className="text-xs text-slate-600 truncate font-medium">{email}</p>
             <button 
              onClick={onLogout}
              className="mt-2 text-[10px] font-bold text-red-500 hover:text-red-700"
             >
               LOGOUT
             </button>
          </div>
          <div className={`bg-green-600 rounded-2xl p-4 text-white shadow-lg transition-all duration-500 ${shouldAnimate ? 'scale-105 ring-4 ring-yellow-400/30' : ''}`}>
            <p className="text-xs opacity-80 mb-1">Current Balance</p>
            <div className="flex items-center gap-2">
              <i className={`fa-solid fa-coins text-yellow-400 transition-transform duration-700 ${shouldAnimate ? 'rotate-[360deg] scale-125' : ''}`}></i>
              <span className="text-2xl font-bold">{balance}</span>
              <span className="text-sm">coins</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
            <i className="fa-solid fa-leaf text-sm"></i>
          </div>
          <span className="font-bold text-slate-800">EcoVend</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`bg-green-100 px-3 py-1 rounded-full text-green-700 font-bold flex items-center gap-1 text-sm transition-all duration-500 ${shouldAnimate ? 'scale-110 bg-yellow-100' : ''}`}>
            <i className={`fa-solid fa-coins text-yellow-500 transition-transform duration-700 ${shouldAnimate ? 'rotate-[360deg]' : ''}`}></i> {balance}
          </div>
          <button onClick={onLogout} className="text-slate-400"><i className="fa-solid fa-right-from-bracket"></i></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
          <i className="fa-solid fa-house text-lg"></i>
          <span className="text-[10px]">Home</span>
        </NavLink>
        <NavLink to="/recycle" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
          <i className="fa-solid fa-camera text-lg"></i>
          <span className="text-[10px]">Recycle</span>
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
          <i className="fa-solid fa-bottle-water text-lg"></i>
          <span className="text-[10px]">Shop</span>
        </NavLink>
        <NavLink to="/wallet" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
          <i className="fa-solid fa-wallet text-lg"></i>
          <span className="text-[10px]">Wallet</span>
        </NavLink>
        <NavLink to="/rewards" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
          <i className="fa-solid fa-gift text-lg"></i>
          <span className="text-[10px]">Rewards</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
          <i className="fa-solid fa-clock-rotate-left text-lg"></i>
          <span className="text-[10px]">History</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
