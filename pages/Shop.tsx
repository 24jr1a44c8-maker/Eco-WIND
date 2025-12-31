
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, COINS_PER_RUPEE } from '../constants';
import { Product } from '../types';

interface ShopProps {
  balance: number;
  onPurchase: (price: number, productName: string, discountValue: number) => boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface FlyingItem {
  id: number;
  x: number;
  y: number;
  icon: string;
}

const Shop: React.FC<ShopProps> = ({ balance, onPurchase }) => {
  const navigate = useNavigate();
  const cartIconRef = useRef<HTMLDivElement>(null);
  
  const [filter, setFilter] = useState<'ALL' | 'DRINK' | 'SNACK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [coinsToUse, setCoinsToUse] = useState<number>(0);
  const [dispensing, setDispensing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<{ items: CartItem[], totalCoins: number } | null>(null);
  
  // Animation states
  const [cartPing, setCartPing] = useState(false);
  const [lastActionId, setLastActionId] = useState<string | null>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = filter === 'ALL' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

  const triggerCartAnimation = () => {
    setCartPing(true);
    setTimeout(() => setCartPing(false), 300);
  };

  const createFlyingParticle = (e: React.MouseEvent, category: string) => {
    const id = Date.now();
    const newItem: FlyingItem = {
      id,
      x: e.clientX,
      y: e.clientY,
      icon: category === 'DRINK' ? 'fa-bottle-water' : 'fa-cookie-bite'
    };
    setFlyingItems(prev => [...prev, newItem]);

    // Cleanup after animation finishes
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== id));
      triggerCartAnimation();
    }, 800);
  };

  const addToCart = (product: Product, e: React.MouseEvent) => {
    if (product.stock <= 0) return;
    
    // Trigger flying animation
    createFlyingParticle(e, product.category);
    
    setLastActionId(product.id);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setLastActionId(productId);
    triggerCartAnimation();
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const cartStats = useMemo(() => {
    const totalCash = cart.reduce((sum, item) => sum + (item.cashPrice * item.quantity), 0);
    const maxDiscountAllowedInCoins = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { totalCash, maxDiscountAllowedInCoins, itemCount };
  }, [cart]);

  useEffect(() => {
    if (coinsToUse > cartStats.maxDiscountAllowedInCoins) {
      setCoinsToUse(cartStats.maxDiscountAllowedInCoins);
    }
  }, [cartStats.maxDiscountAllowedInCoins, coinsToUse]);

  const handleBuy = () => {
    if (cart.length === 0) return;
    const discountValue = coinsToUse / COINS_PER_RUPEE;
    setDispensing(true);
    
    const summaryName = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
    const snapshotCart = [...cart];
    const snapshotCoins = coinsToUse;

    setTimeout(() => {
      const success = onPurchase(snapshotCoins, summaryName, discountValue);
      setDispensing(false);
      if (success) {
        setCart([]);
        setCoinsToUse(0);
        setIsCheckoutOpen(false);
        setPurchaseSuccess({ items: snapshotCart, totalCoins: snapshotCoins });
      }
    }, 2500);
  };

  const getRecycleReward = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + (item.category === 'DRINK' ? 15 : 10) * item.quantity, 0);
  };

  // Calculate destination for particles
  const getCartPosition = () => {
    if (!cartIconRef.current) return { x: window.innerWidth / 2, y: window.innerHeight - 100 };
    const rect = cartIconRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  const target = getCartPosition();

  // Helper for stock visualization
  const getStockInfo = (stock: number) => {
    if (stock <= 0) return { color: 'bg-slate-300', text: 'Sold Out', width: '0%' };
    if (stock < 5) return { color: 'bg-red-500', text: 'Critical Stock', width: '25%' };
    if (stock < 15) return { color: 'bg-orange-400', text: 'Low Stock', width: '60%' };
    return { color: 'bg-emerald-500', text: 'In Stock', width: '100%' };
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-32 relative">
      
      {/* BACKGROUND ANIMATION BLOCK */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-vending-scan"></div>
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-blue-400/10 blur-2xl animate-vending-float"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Flying Particle Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {flyingItems.map(item => (
          <div
            key={item.id}
            className="absolute w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-blue-600 animate-flying-particle"
            style={{
              left: item.x - 24,
              top: item.y - 24,
              '--target-x': `${target.x - item.x}px`,
              '--target-y': `${target.y - item.y}px`,
            } as any}
          >
            <i className={`fa-solid ${item.icon} text-xl`}></i>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes flying-particle {
          0% { transform: scale(1) translate(0, 0); opacity: 1; }
          20% { transform: scale(1.2) translate(0, -20px); opacity: 1; }
          100% { transform: scale(0.2) translate(var(--target-x), var(--target-y)); opacity: 0; }
        }
        @keyframes vending-scan {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes vending-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-flying-particle {
          animation: flying-particle 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-vending-scan {
          animation: vending-scan 4s linear infinite;
        }
        .animate-vending-float {
          animation: vending-float infinite ease-in-out;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Shop <span className="text-blue-600">Items</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Earned Eco-Coins apply as discounts at checkout.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 md:min-w-[300px]">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm font-bold"
            />
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shrink-0 shadow-sm">
            {(['ALL', 'DRINK', 'SNACK'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${filter === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {cat}s
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => {
          const cartItem = cart.find(item => item.id === product.id);
          const quantity = cartItem?.quantity || 0;
          const isOutOfStock = product.stock <= 0;
          const isActive = lastActionId === product.id;
          const stockInfo = getStockInfo(product.stock);
          
          return (
            <div 
              key={product.id} 
              className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-1 ${isOutOfStock ? 'opacity-70' : ''}`}
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-slate-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
                />
                
                <div className="absolute top-4 left-4">
                  <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-800 uppercase shadow-lg">
                    {product.category}
                  </div>
                </div>

                {!isOutOfStock && (
                   <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 bg-white/95 backdrop-blur p-1.5 rounded-2xl shadow-2xl border border-white/20 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-1">
                        {quantity > 0 && (
                          <button 
                            onClick={() => removeFromCart(product.id)}
                            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-90 transition-all"
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                        )}
                        {quantity > 0 && (
                          <span className={`w-10 text-center font-black text-slate-900 text-lg transition-transform duration-300 ${isActive ? 'scale-125' : 'scale-100'}`}>
                            {quantity}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={(e) => addToCart(product, e)}
                        className={`flex-1 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center gap-2 hover:bg-black active:scale-90 transition-all text-xs font-black uppercase ${quantity >= product.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {quantity === 0 ? (
                          <>
                            <i className="fa-solid fa-plus"></i>
                            Add
                          </>
                        ) : (
                          <i className="fa-solid fa-plus"></i>
                        )}
                      </button>
                   </div>
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-white text-slate-900 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">Sold Out</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {/* Stock Level Indicator */}
                <div className="mb-4">
                   <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Availability</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${stockInfo.color.replace('bg-', 'text-')}`}>{stockInfo.text}</span>
                   </div>
                   <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stockInfo.color} transition-all duration-700`} 
                        style={{ width: stockInfo.width }}
                      ></div>
                   </div>
                </div>

                <h3 className="text-sm font-black text-slate-900 truncate tracking-tight">{product.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-black text-slate-900">₹{product.cashPrice.toFixed(0)}</span>
                  <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-xl border border-green-100">
                    <i className="fa-solid fa-coins text-[10px] text-yellow-500"></i>
                    <span className="text-[10px] font-black text-green-700 uppercase">Save ₹{(product.price / COINS_PER_RUPEE).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Summary Bar */}
      {cart.length > 0 && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-lg z-50 transition-all duration-300 ${cartPing ? 'scale-105' : 'scale-100'}`}>
          <div className="bg-slate-950 text-white rounded-[2.5rem] p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center justify-between border border-white/10 backdrop-blur-3xl">
            <div className="flex items-center gap-5 pl-3">
              <div className="relative group" ref={cartIconRef}>
                <div className={`w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl transition-all ${cartPing ? 'rotate-12 scale-110' : ''}`}>
                  <i className="fa-solid fa-cart-shopping"></i>
                </div>
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-black w-7 h-7 flex items-center justify-center rounded-full border-4 border-slate-950 shadow-lg">
                  {cartStats.itemCount}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Total Amount</p>
                <p className="text-2xl font-black tracking-tighter">₹{(cartStats.totalCash - (coinsToUse / COINS_PER_RUPEE)).toFixed(2)}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-sm transition-all hover:bg-green-500 hover:text-white flex items-center gap-3 active:scale-95 shadow-xl"
            >
              CHECKOUT
              <i className="fa-solid fa-arrow-right-long"></i>
            </button>
          </div>
        </div>
      )}

      {/* Checkout Drawer */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-md p-4 md:items-center">
          <div className="bg-white w-full max-w-xl rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Review Order</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">Ready for pickup at Vending Slot 04</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)} 
                  className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              <div className="max-h-[35vh] overflow-y-auto mb-10 pr-4 space-y-4 no-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-5 bg-slate-50/50 p-4 rounded-3xl border border-slate-100 group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 text-base tracking-tight">{item.name}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">₹{item.cashPrice.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                      <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 active:scale-90 transition-all"><i className="fa-solid fa-minus text-xs"></i></button>
                      <span className="text-base font-black text-slate-900 min-w-[1.5rem] text-center">{item.quantity}</span>
                      <button onClick={(e) => addToCart(item, e)} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 active:scale-90 transition-all"><i className="fa-solid fa-plus text-xs"></i></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-10 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <i className="fa-solid fa-coins text-yellow-400 text-lg"></i>
                      Eco-Coin Discount
                    </span>
                    <span className="text-xl font-black text-green-400">-{coinsToUse} <span className="text-xs uppercase ml-1">Coins</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={Math.min(balance, cartStats.maxDiscountAllowedInCoins)} 
                    value={coinsToUse}
                    onChange={(e) => setCoinsToUse(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between mt-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Zero Discount</div>
                    <div className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Max Savings Active</div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <i className="fa-solid fa-tags text-[10rem]"></i>
                </div>
              </div>

              <div className="flex items-end justify-between mb-10 px-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Final Amount</p>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{(cartStats.totalCash - (coinsToUse / COINS_PER_RUPEE)).toFixed(0)}</span>
                    {coinsToUse > 0 && (
                      <span className="text-lg font-black text-slate-300 line-through">₹{cartStats.totalCash.toFixed(0)}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mb-2">You Saved</p>
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl font-black text-lg">
                    ₹{(coinsToUse / COINS_PER_RUPEE).toFixed(0)}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBuy}
                disabled={dispensing}
                className={`w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all transform active:scale-[0.98] ${dispensing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'}`}
              >
                {dispensing ? (
                  <span className="flex items-center justify-center gap-4">
                    <div className="w-6 h-6 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                    VENDING {cartStats.itemCount} ITEMS...
                  </span>
                ) : `CONFIRM & PAY ₹${(cartStats.totalCash - (coinsToUse / COINS_PER_RUPEE)).toFixed(0)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {purchaseSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-2xl p-4">
          <div className="bg-white w-full max-w-md rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500 text-center">
            <div className="p-12">
              <div className="w-28 h-28 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-6xl rotate-3 shadow-xl">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter uppercase italic">Success!</h2>
              <p className="text-slate-500 font-medium mb-10">Items are in the delivery tray. Don't forget to recycle the packaging!</p>

              <div className="bg-slate-900 rounded-[3rem] p-8 text-white mb-10 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/recycle')}>
                <div className="relative z-10">
                   <h3 className="text-xl font-black mb-1 tracking-tight">Earn Back!</h3>
                   <p className="text-xs text-slate-500 font-bold mb-6">Recycle these items to get coins back</p>
                   <div className="inline-flex items-center gap-3 bg-white text-slate-950 px-8 py-3 rounded-2xl text-xl font-black shadow-2xl">
                      <i className="fa-solid fa-coins text-yellow-500"></i>
                      +{getRecycleReward(purchaseSuccess.items)} COINS
                   </div>
                </div>
                <i className="fa-solid fa-recycle absolute -bottom-8 -right-8 text-[12rem] text-white/5 rotate-12"></i>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => navigate('/recycle')}
                  className="w-full py-6 rounded-[2rem] bg-green-600 text-white font-black text-xl hover:bg-green-500 transition-all active:scale-95 shadow-xl shadow-green-200"
                >
                  SCAN & RECYCLE
                </button>
                <button 
                  onClick={() => setPurchaseSuccess(null)}
                  className="w-full py-4 rounded-2xl bg-white text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-900 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
