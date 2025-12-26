
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface AuthProps {
  onLogin: (email: string, password: string, isSignup: boolean) => void;
  onQuickLogin: (method: 'QR' | 'FINGERPRINT') => void;
  onCancel: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onQuickLogin, onCancel }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'FORM' | 'QR' | 'FINGERPRINT'>('FORM');
  const [isSimulating, setIsSimulating] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password, isSignup);
    }
  };

  const startQRScanner = async () => {
    setAuthMode('QR');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopQRScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setAuthMode('FORM');
  };

  const simulateAuth = (method: 'QR' | 'FINGERPRINT') => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      if (method === 'QR') stopQRScanner();
      onQuickLogin(method);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-green-600 p-8 text-white text-center relative">
          <button 
            onClick={onCancel}
            className="absolute left-6 top-8 text-white/50 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <i className="fa-solid fa-leaf text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold">EcoVend AI</h1>
          <p className="opacity-80 text-sm mt-1">Identity & Rewards Hub</p>
        </div>

        {/* Auth Body */}
        <div className="p-8">
          {authMode === 'FORM' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                    placeholder="warrior@environment.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all mt-4"
                >
                  {isSignup ? 'Sign Up' : 'Log In'}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">Or Quick Access</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={startQRScanner}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-50 hover:border-green-100 hover:bg-green-50 transition-all text-slate-600"
                >
                  <i className="fa-solid fa-qrcode text-2xl"></i>
                  <span className="text-xs font-bold">QR Code</span>
                </button>
                <button 
                  onClick={() => setAuthMode('FINGERPRINT')}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-50 hover:border-green-100 hover:bg-green-50 transition-all text-slate-600"
                >
                  <i className="fa-solid fa-fingerprint text-2xl"></i>
                  <span className="text-xs font-bold">Fingerprint</span>
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-sm font-medium text-slate-500 hover:text-green-600 transition-colors"
                >
                  {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </>
          )}

          {authMode === 'QR' && (
            <div className="text-center animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Scan QR Identity</h2>
              <p className="text-sm text-slate-500 mb-6">Hold your EcoVend card or app QR code to the scanner</p>
              
              <div className="relative w-full aspect-square bg-slate-900 rounded-3xl overflow-hidden mb-6 border-4 border-slate-50 shadow-inner">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-60" />
                <div className="absolute inset-0 border-2 border-green-500/50 m-12 rounded-xl">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1"></div>
                  <div className="w-full h-1 bg-green-500/50 absolute top-1/2 -translate-y-1/2 animate-bounce"></div>
                </div>

                {isSimulating && (
                   <div className="absolute inset-0 bg-green-600/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                         <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                         <span className="font-bold text-green-700">Verifying...</span>
                      </div>
                   </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => simulateAuth('QR')}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700"
                >
                  Simulate Scan
                </button>
                <button onClick={stopQRScanner} className="text-slate-400 font-bold text-sm">Cancel</button>
              </div>
            </div>
          )}

          {authMode === 'FINGERPRINT' && (
            <div className="text-center animate-in zoom-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Biometric Access</h2>
              <p className="text-sm text-slate-500 mb-10">Place your finger on the machine's scanner</p>
              
              <div className="relative inline-block mb-10">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isSimulating ? 'bg-green-100' : 'bg-slate-50'}`}>
                   <i className={`fa-solid fa-fingerprint text-6xl transition-all duration-700 ${isSimulating ? 'text-green-600 scale-110' : 'text-slate-300'}`}></i>
                   
                   {/* Glowing rings */}
                   {isSimulating && (
                      <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
                   )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => simulateAuth('FINGERPRINT')}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700"
                >
                  Simulate Fingerprint
                </button>
                <button onClick={() => setAuthMode('FORM')} className="text-slate-400 font-bold text-sm">Use Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
