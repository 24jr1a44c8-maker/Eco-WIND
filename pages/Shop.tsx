
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface ShopProps {
  balance: number;
  onPurchase: (price: number, productName: string, discountValue: number) => boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const COIN_DISCOUNT_RATE = 1.0; 

const Shop: React.FC<ShopProps> = ({ balance, onPurchase }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'DRINK' | 'SNACK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [coinsToUse, setCoinsToUse] = useState<number>(0);
  const [dispensing, setDispensing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<{ items: CartItem[], totalCoins: number } | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = filter === 'ALL' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
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
    const maxDiscountAllowed = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { totalCash, maxDiscountAllowed, itemCount };
  }, [cart]);

  // Adjust coinsToUse if cart changes and exceeds max allowed
  useMemo(() => {
    if (coinsToUse > cartStats.maxDiscountAllowed) {
      setCoinsToUse(cartStats.maxDiscountAllowed);
    }
  }, [cartStats.maxDiscountAllowed]);

  const handleBuy = () => {
    if (cart.length === 0) return;

    const discountValue = coinsToUse * COIN_DISCOUNT_RATE;
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

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Vending Machine</h1>
          <p className="text-slate-500 mt-2">Pick your items. Recycle later for more coins.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 md:min-w-[300px]">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search drinks or snacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-sm font-medium"
            />
          </div>

          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shrink-0">
            {(['ALL', 'DRINK', 'SNACK'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${filter === cat ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {cat}s
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const cartItem = cart.find(item => item.id === product.id);
          const quantity = cartItem?.quantity || 0;
          const isOutOfStock = product.stock <= 0;
          
          return (
            <div 
              key={product.id} 
              className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl ${isOutOfStock ? 'opacity-70' : ''}`}
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
                />
                
                <div className="absolute top-3 left-3">
                  <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-slate-800 uppercase shadow-sm">
                    {product.category}
                  </div>
                </div>

                {!isOutOfStock && (
                   <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur p-1 rounded-xl shadow-lg">
                      {quantity > 0 && (
                        <>
                          <button 
                            onClick={() => removeFromCart(product.id)}
                            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                          <span className="w-6 text-center font-bold text-slate-800">{quantity}</span>
                        </>
                      )}
                      <button 
                        onClick={() => addToCart(product)}
                        className={`w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white hover:bg-green-700 ${quantity >= product.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                   </div>
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-800 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-black text-slate-900">₹{product.cashPrice.toFixed(2)}</span>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md">
                    <i className="fa-solid fa-coins text-[8px] text-yellow-500"></i>
                    <span className="text-[10px] font-bold text-green-700">Save ₹{product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Summary Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50">
          <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-10">
            <div className="flex items-center gap-4 pl-2">
              <div className="relative">
                <i className="fa-solid fa-cart-shopping text-xl"></i>
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
                  {cartStats.itemCount}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total to pay</p>
                <p className="text-xl font-black">₹{(cartStats.totalCash - (coinsToUse * COIN_DISCOUNT_RATE)).toFixed(2)}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2"
            >
              CHECKOUT
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* Checkout Drawer */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 md:items-center">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800">Your Selection</h2>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-300 hover:text-slate-500 text-2xl">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="max-h-[30vh] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <img src={item.image} className="w-14 h-14 rounded-xl object-cover" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-400">₹{item.cashPrice.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-100">
                      <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:bg-slate-50"><i className="fa-solid fa-minus text-[10px]"></i></button>
                      <span className="text-sm font-bold text-slate-700">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:bg-slate-50"><i className="fa-solid fa-plus text-[10px]"></i></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 p-6 rounded-3xl mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-green-700 flex items-center gap-2">
                    <i className="fa-solid fa-coins text-yellow-500"></i>
                    Apply Eco-Coins
                  </span>
                  <span className="text-xs font-black text-green-800">-{coinsToUse} Coins</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={Math.min(balance, cartStats.maxDiscountAllowed)} 
                  value={coinsToUse}
                  onChange={(e) => setCoinsToUse(parseInt(e.target.value))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between mt-2 text-[10px] font-black text-green-600 uppercase tracking-tighter">
                  <span>No Coins</span>
                  <span>Max Savngs (₹{Math.min(balance, cartStats.maxDiscountAllowed)})</span>
                </div>
              </div>

              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total to pay</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-slate-800">₹{(cartStats.totalCash - (coinsToUse * COIN_DISCOUNT_RATE)).toFixed(2)}</span>
                    {coinsToUse > 0 && (
                      <span className="text-sm text-slate-400 line-through">₹{cartStats.totalCash.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-green-600 font-bold uppercase">Savings</p>
                  <p className="text-lg font-black text-green-600">+ ₹{(coinsToUse * COIN_DISCOUNT_RATE).toFixed(2)}</p>
                </div>
              </div>

              <button 
                onClick={handleBuy}
                disabled={dispensing}
                className={`w-full py-5 rounded-[1.5rem] font-black text-lg shadow-xl transition-all ${dispensing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black active:scale-[0.98]'}`}
              >
                {dispensing ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                    Vending {cartStats.itemCount} Items...
                  </span>
                ) : `Pay ₹${(cartStats.totalCash - (coinsToUse * COIN_DISCOUNT_RATE)).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Purchase Success Screen */}
      {purchaseSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 text-center">
            <div className="p-10">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 mb-2">Items Vended!</h2>
              <p className="text-slate-500 mb-8">Please collect your {purchaseSuccess.items.length} snacks/drinks from the machine tray.</p>

              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-8 text-left">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Order Summary</h4>
                <div className="space-y-2 mb-4 max-h-[100px] overflow-y-auto">
                  {purchaseSuccess.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm font-bold text-slate-700">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{(item.cashPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-green-600">Eco-Coins Saved</span>
                  <span className="text-lg font-black text-green-600">-₹{purchaseSuccess.totalCoins.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-600 rounded-3xl p-6 text-white mb-10 relative overflow-hidden group">
                <div className="relative z-10">
                   <h3 className="text-lg font-bold mb-1">Recycle & Earn!</h3>
                   <p className="text-xs opacity-80 mb-4">You can earn back a lot of coins for these items.</p>
                   <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-2 rounded-2xl text-xl font-black">
                      <i className="fa-solid fa-coins text-yellow-400"></i>
                      +{getRecycleReward(purchaseSuccess.items)} Coins Back
                   </div>
                </div>
                <i className="fa-solid fa-recycle absolute -bottom-4 -right-4 text-8xl text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"></i>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/recycle')}
                  className="w-full py-5 rounded-[1.5rem] bg-slate-900 text-white font-black text-lg hover:bg-black shadow-2xl shadow-slate-200 flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-camera"></i>
                  Recycle Items Now
                </button>
                <button 
                  onClick={() => setPurchaseSuccess(null)}
                  className="w-full py-4 rounded-2xl bg-slate-100 text-slate-400 font-bold hover:bg-slate-200 transition-all"
                >
                  Return to Shop
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
