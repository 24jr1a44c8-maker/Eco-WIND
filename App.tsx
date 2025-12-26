
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Recycle from './pages/Recycle';
import Rewards from './pages/Rewards';
import Wallet from './pages/Wallet';
import Shop from './pages/Shop';
import History from './pages/History';
import { User, Activity, ActivityType, RecycleCategory } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize: Check for session
  useEffect(() => {
    const savedSession = localStorage.getItem('ecovend_session');
    if (savedSession) {
      const users = JSON.parse(localStorage.getItem('ecovend_users') || '[]');
      const user = users.find((u: User) => u.email === savedSession);
      if (user) setCurrentUser(user);
    }
  }, []);

  const handleAuth = (email: string, password: string, isSignup: boolean) => {
    const users = JSON.parse(localStorage.getItem('ecovend_users') || '[]');
    
    if (isSignup) {
      if (users.find((u: User) => u.email === email)) {
        alert("User already exists!");
        return;
      }
      const newUser: User = {
        email,
        password,
        balance: 100, // Starting bonus
        totalItems: 0,
        totalWeight: 0,
        activities: [{
          id: 'welcome',
          type: 'RECYCLE',
          title: 'Welcome Bonus',
          amount: 100,
          timestamp: Date.now(),
          category: RecycleCategory.PAPER
        }]
      };
      users.push(newUser);
      localStorage.setItem('ecovend_users', JSON.stringify(users));
      setCurrentUser(newUser);
      localStorage.setItem('ecovend_session', email);
    } else {
      const user = users.find((u: User) => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('ecovend_session', email);
      } else {
        alert("Invalid credentials");
      }
    }
  };

  const handleQuickLogin = (method: 'QR' | 'FINGERPRINT') => {
    const email = method === 'QR' ? 'scan-user@ecovend.ai' : 'bio-warrior@ecovend.ai';
    const users = JSON.parse(localStorage.getItem('ecovend_users') || '[]');
    let user = users.find((u: User) => u.email === email);

    if (!user) {
      user = {
        email,
        balance: 250,
        totalItems: 12,
        totalWeight: 1500,
        activities: [{
          id: 'init-' + method,
          type: 'RECYCLE',
          title: `${method} Profile Initialized`,
          amount: 50,
          timestamp: Date.now(),
          category: RecycleCategory.PLASTIC
        }]
      };
      users.push(user);
      localStorage.setItem('ecovend_users', JSON.stringify(users));
    }

    setCurrentUser(user);
    localStorage.setItem('ecovend_session', email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ecovend_session');
  };

  const updateUserData = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    const users = JSON.parse(localStorage.getItem('ecovend_users') || '[]');
    const index = users.findIndex((u: User) => u.email === updatedUser.email);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('ecovend_users', JSON.stringify(users));
    }
  };

  const addRecycleActivity = (name: string, category: RecycleCategory, coins: number) => {
    if (!currentUser) return;
    
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'RECYCLE',
      title: name,
      amount: coins,
      timestamp: Date.now(),
      category
    };

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + coins,
      totalItems: currentUser.totalItems + 1,
      totalWeight: currentUser.totalWeight + 250,
      activities: [newActivity, ...currentUser.activities]
    };

    updateUserData(updatedUser);
  };

  const addRedeemActivity = (provider: string, cost: number) => {
    if (!currentUser || currentUser.balance < cost) return false;

    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'REDEEM',
      title: `${provider} Voucher`,
      amount: -cost,
      timestamp: Date.now(),
      provider
    };

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - cost,
      activities: [newActivity, ...currentUser.activities]
    };

    updateUserData(updatedUser);
    return true;
  };

  const handleCashOut = (coins: number, method: string) => {
    if (!currentUser || currentUser.balance < coins) return false;

    const cashValue = coins * 0.1;
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'CASH_OUT',
      title: `Transfer to ${method}`,
      amount: -coins,
      timestamp: Date.now(),
      provider: method,
      currencyAmount: cashValue
    };

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - coins,
      activities: [newActivity, ...currentUser.activities]
    };

    updateUserData(updatedUser);
    return true;
  };

  const handlePurchase = (coinsUsed: number, productName: string, discountValue: number) => {
    if (!currentUser || currentUser.balance < coinsUsed) return false;

    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'PURCHASE',
      title: productName,
      amount: -coinsUsed,
      timestamp: Date.now(),
      provider: 'Vending Slot',
      currencyAmount: discountValue
    };

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - coinsUsed,
      activities: [newActivity, ...currentUser.activities]
    };

    updateUserData(updatedUser);
    return true;
  };

  if (!currentUser) {
    return <Auth onLogin={handleAuth} onQuickLogin={handleQuickLogin} />;
  }

  return (
    <Router>
      <Layout balance={currentUser.balance} email={currentUser.email} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={currentUser} history={currentUser.activities.slice(0, 5)} />} />
          <Route path="/recycle" element={<Recycle onComplete={(name, cat, coins) => addRecycleActivity(name, cat as RecycleCategory, coins)} />} />
          <Route path="/shop" element={<Shop balance={currentUser.balance} onPurchase={handlePurchase} />} />
          <Route path="/wallet" element={<Wallet balance={currentUser.balance} onCashOut={handleCashOut} />} />
          <Route path="/rewards" element={<Rewards balance={currentUser.balance} onRedeem={(cost, provider) => addRedeemActivity(provider, cost)} />} />
          <Route path="/history" element={<History activities={currentUser.activities} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
