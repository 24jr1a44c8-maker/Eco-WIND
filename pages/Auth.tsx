
import React, { useState, useRef, useEffect } from 'react';

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
  const [visible, setVisible] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden font-sans">
      {/* Dynamic Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>
      
      <style>{`
        @keyframes float-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .stagger-1 { animation: float-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .stagger-2 { animation: float-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .stagger-3 { animation: float-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .stagger-4 { animation: float-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .stagger-5 { animation: float-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        
        .shimmer-btn {
          background: linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite linear;
        }

        .input-glow:focus-within {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
        }
      `}</style>

      <div className={`max-w-md w-full bg-white/95 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.7)] border border-white/20 overflow-hidden relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'}`}>
        
        {/* Header Section */}
        <div className="bg-slate-950 p-12 text-white text-center relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-110 group-hover:scale-100 transition-transform duration-1000"></div>
          
          <button 
            onClick={onCancel}
            className="absolute left-8 top-12 text-white/30 hover:text-white transition-all active:scale-90 z-20 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </button>

          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-green-600 to-emerald-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.5)] group-hover:rotate-6 transition-all duration-700 animate-[breathing_4s_ease-in-out_infinite]">
              <i className="fa-solid fa-leaf text-5xl"></i>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">EcoVend <span className="text-green-500">AI</span></h1>
            <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Auth Terminal v2.4</p>
          </div>
        </div>

        {/* Auth Body */}
        <div className="p-12">
          {authMode === 'FORM' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter italic stagger-1">
                {isSignup ? 'Create Profile' : 'Secure Login'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="stagger-2 input-glow transition-all rounded-3xl">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Eco Identity (Email)</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors">
                      <i className="fa-solid fa-at text-lg"></i>
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-green-500 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-200"
                      placeholder="hero@ecovend.ai"
                    />
                  </div>
                </div>
                
                <div className="stagger-3 input-glow transition-all rounded-3xl">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Secure Key (Password)</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors">
                      <i className="fa-solid fa-shield-halved text-lg"></i>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-green-500 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-200"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="stagger-4 pt-4">
                  <button
                    type="submit"
                    className="w-full shimmer-btn text-white py-6 rounded-[2rem] font-black text-xl shadow-[0_25px_50px_-12px_rgba(22,163,74,0.4)] hover:shadow-[0_30px_60px_-12px_rgba(22,163,74,0.6)] transition-all active:scale-[0.97] uppercase tracking-tighter italic"
                  >
                    {isSignup ? 'Initialize Account' : 'Authenticate'}
                  </button>
                </div>
              </form>

              <div className="relative my-12 stagger-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-white px-6 text-slate-300 tracking-[0.4em]">Biometric Access</span></div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12 stagger-5">
                <button 
                  onClick={startQRScanner}
                  className="flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 hover:border-green-100 hover:bg-green-50/50 hover:-translate-y-2 transition-all text-slate-400 hover:text-green-600 group"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:rotate-3 transition-all">
                    <i className="fa-solid fa-qrcode text-3xl"></i>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">QR Sync</span>
                </button>
                <button 
                  onClick={() => setAuthMode('FINGERPRINT')}
                  className="flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 hover:border-green-100 hover:bg-green-50/50 hover:-translate-y-2 transition-all text-slate-400 hover:text-green-600 group"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-rotate-3 transition-all">
                    <i className="fa-solid fa-fingerprint text-3xl"></i>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Touch ID</span>
                </button>
              </div>

              <div className="text-center stagger-5">
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-xs font-black text-slate-400 hover:text-green-600 transition-colors uppercase tracking-[0.2em] underline underline-offset-8 decoration-slate-100 hover:decoration-green-200"
                >
                  {isSignup ? 'Already a member? Login' : "New protector? Join now"}
                </button>
              </div>
            </div>
          )}

          {authMode === 'QR' && (
            <div className="text-center animate-in zoom-in-95 fade-in duration-700">
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter italic">Scan Profile</h2>
              <p className="text-xs font-bold text-slate-400 mb-10 uppercase tracking-widest">Align QR Code in the frame</p>
              
              <div className="relative w-full aspect-square bg-slate-950 rounded-[3rem] overflow-hidden mb-10 border-[10px] border-slate-50 shadow-2xl group ring-1 ring-slate-100">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-50 contrast-125" />
                
                {/* Dynamic Scanner Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-12">
                   <div className="w-full h-full border-2 border-green-500/20 rounded-3xl relative">
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1 rounded-tl-2xl"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1 rounded-tr-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1 rounded-bl-2xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1 rounded-br-2xl"></div>
                      
                      {/* Laser Line */}
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent shadow-[0_0_20px_rgba(34,197,94,1)] absolute top-0 animate-[scan_2.5s_infinite_linear]"></div>
                   </div>
                </div>

                {isSimulating && (
                   <div className="absolute inset-0 bg-green-950/40 backdrop-blur-xl flex flex-col items-center justify-center z-20">
                      <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                         <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                         <span className="font-black text-green-700 text-sm uppercase tracking-widest">Verifying Identity</span>
                      </div>
                   </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => simulateAuth('QR')}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:bg-black transition-all active:scale-95 uppercase italic tracking-tighter"
                >
                  Verify Now
                </button>
                <button onClick={stopQRScanner} className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 transition-colors pt-4">Return to Passkey</button>
              </div>
            </div>
          )}

          {authMode === 'FINGERPRINT' && (
            <div className="text-center animate-in zoom-in-95 fade-in duration-700">
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter italic">Touch ID</h2>
              <p className="text-xs font-bold text-slate-400 mb-12 uppercase tracking-widest">Place thumb on the scanner</p>
              
              <div className="relative inline-block mb-16">
                <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-1000 border-8 ${isSimulating ? 'bg-green-50 border-green-200 ring-[15px] ring-green-500/10' : 'bg-slate-50 border-slate-100 shadow-[inset_0_10px_20px_rgba(0,0,0,0.05)]'}`}>
                   <i className={`fa-solid fa-fingerprint text-8xl transition-all duration-700 ${isSimulating ? 'text-green-600 scale-110 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'text-slate-200'}`}></i>
                   
                   {/* Radar Pulse Effect */}
                   {isSimulating && (
                      <>
                        <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-ping opacity-30"></div>
                        <div className="absolute inset-[-20px] border border-green-500 rounded-full animate-ping opacity-10 [animation-delay:0.5s]"></div>
                      </>
                   )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => simulateAuth('FINGERPRINT')}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:bg-black transition-all active:scale-95 uppercase italic tracking-tighter"
                >
                  Contact Sensor
                </button>
                <button onClick={() => setAuthMode('FORM')} className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 transition-colors pt-4">Return to Passkey</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Auth;
