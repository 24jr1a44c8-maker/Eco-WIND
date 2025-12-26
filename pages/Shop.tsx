
import React, { useState } from 'react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface ShopProps {
  balance: number;
  onPurchase: (price: number, productName: string, discountValue: number) => boolean;
}

const COIN_DISCOUNT_RATE = 1.0; // Each coin reduces price by ₹1.00

const Shop: React.FC<ShopProps> = ({ balance, onPurchase }) => {
  const [filter, setFilter] = useState<'ALL' | 'DRINK' | 'SNACK'>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [coinsToUse, setCoinsToUse] = useState<number>(0);
  const [dispensing, setDispensing] = useState<string | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Suggest using up to the max discount for this product or the user's balance
    setCoinsToUse(Math.min(balance, product.price));
  };

  const handleBuy = () => {
    if (!selectedProduct) return;

    const discountValue = coinsToUse * COIN_DISCOUNT_RATE;
    setDispensing(selectedProduct.id);
    
    setTimeout(() => {
      const success = onPurchase(coinsToUse, selectedProduct.name, discountValue);
      setDispensing(null);
      if (success) {
        alert(`Enjoy your ${selectedProduct.name}! Applied ₹${discountValue.toFixed(2)} discount. Please pick up your item.`);
        setSelectedProduct(null);
      }
    }, 2000);
  };

  const filteredProducts = filter === 'ALL' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  const calculateFinalPrice = (product: Product, coins: number) => {
    const discount = coins * COIN_DISCOUNT_RATE;
    return Math.max(0, product.cashPrice - discount).toFixed(2);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Canteen Shop</h1>
          <p className="text-slate-500 mt-2">Use coins to get cheaper snacks and cold drinks at college/mall.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          {(['ALL', 'DRINK', 'SNACK'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === cat ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {cat}s
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            onClick={() => handleProductSelect(product)}
            className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group relative cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${selectedProduct?.id === product.id ? 'ring-2 ring-green-500' : ''}`}
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${dispensing === product.id ? 'blur-sm grayscale' : ''}`}
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-slate-800 uppercase">
                {product.category}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-bold text-slate-800 truncate">{product.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-black text-slate-900">₹{product.cashPrice.toFixed(2)}</span>
                <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md">
                   <i className="fa-solid fa-coins text-[8px] text-yellow-500"></i>
                   <span className="text-[10px] font-bold text-green-700">Save ₹{(product.price * COIN_DISCOUNT_RATE).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Drawer / Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 md:items-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                   <img src={selectedProduct.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="" />
                   <div>
                      <h2 className="text-xl font-bold text-slate-800">{selectedProduct.name}</h2>
                      <p className="text-sm text-slate-400">Apply coins for instant savings</p>
                   </div>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="text-slate-300 hover:text-slate-500 text-xl"><i className="fa-solid fa-xmark"></i></button>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl mb-6">
                 <div className="flex justify-between mb-4">
                    <span className="text-sm text-slate-500">Market Price:</span>
                    <span className="text-sm font-bold text-slate-700">₹{selectedProduct.cashPrice.toFixed(2)}</span>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-green-600">Eco-Savings (Coins):</span>
                       <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          -{coinsToUse} Coins
                       </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={Math.min(balance, selectedProduct.price)} 
                      value={coinsToUse}
                      onChange={(e) => setCoinsToUse(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                       <span>No Discount</span>
                       <span>Max Discount</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between mb-8 px-2">
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Final To Pay</p>
                    <div className="flex items-center gap-3">
                       <span className="text-3xl font-black text-slate-800">₹{calculateFinalPrice(selectedProduct, coinsToUse)}</span>
                       <span className="text-sm text-slate-400 line-through">₹{selectedProduct.cashPrice.toFixed(2)}</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-green-600 font-bold uppercase mb-1">Total Savings</p>
                    <p className="text-sm font-bold text-green-600">+ ₹{(coinsToUse * COIN_DISCOUNT_RATE).toFixed(2)}</p>
                 </div>
              </div>

              <button 
                onClick={handleBuy}
                disabled={!!dispensing}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${dispensing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black active:scale-[0.98]'}`}
              >
                {dispensing ? (
                   <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Vending...
                   </span>
                ) : `Pay ₹${calculateFinalPrice(selectedProduct, coinsToUse)}`}
              </button>
              
              <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
                Coins remaining: {balance - coinsToUse}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-green-50 rounded-3xl border border-green-100 flex items-start gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
          <i className="fa-solid fa-circle-check text-xl"></i>
        </div>
        <div>
          <h4 className="font-bold text-green-800">Pay with Recycling</h4>
          <p className="text-sm text-green-700 opacity-80 mt-1">Recycle 1 plastic bottle to get 10 coins. Use these 10 coins to get ₹10 off your next drink. It's that simple!</p>
        </div>
      </div>
    </div>
  );
};

export default Shop;
