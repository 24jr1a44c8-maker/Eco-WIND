
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { identifyRecyclable } from '../services/geminiService';
import { GeminiResponse } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface RecycleProps {
  onComplete: (name: string, category: string, coins: number) => void;
}

const Recycle: React.FC<RecycleProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeminiResponse | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      setError("Unable to access camera. Please allow camera permissions in your browser settings.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraReady) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const base64Image = dataUrl.split(',')[1];

      try {
        const aiResult = await identifyRecyclable(base64Image);
        setResult(aiResult);
      } catch (err: any) {
        // If it's a configuration error, we want to show the full detail
        const msg = err.message || "Analysis failed due to a system error.";
        setError(msg);
        console.error("Recycle Page Error:", err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleConfirm = () => {
    if (result) {
      onComplete(result.itemName, result.category, result.estimatedValue);
      navigate('/');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <style>{`
        @keyframes pulse-grow {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.2); }
          50% { transform: scale(1.04); box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.3); }
        }
        .animate-pulse-grow {
          animation: pulse-grow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full mb-6 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Eco <span className="text-green-600">Scanner</span></h1>
        <p className="text-slate-500 font-medium">Verify your item for recycling rewards.</p>
      </div>

      <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white ring-1 ring-slate-100">
        {!result && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover transition-opacity duration-700 ${isCameraReady ? 'opacity-100' : 'opacity-20'}`}
          />
        )}
        
        {result && (
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover animate-in fade-in duration-500"
          />
        )}

        {!isCameraReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
             <i className="fa-solid fa-spinner animate-spin text-3xl mb-4"></i>
             <p className="text-[10px] font-black uppercase tracking-widest">Warming Up...</p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-20">
            <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-black italic tracking-tighter uppercase">Analyzing...</p>
            <p className="text-[10px] font-bold text-white/40 mt-3 tracking-widest uppercase">Consulting AI Engine</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-600/95 backdrop-blur-xl text-white p-10 flex flex-col items-center justify-center text-center z-30">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
            </div>
            <p className="text-xl font-black uppercase italic tracking-tighter mb-4">Device Error</p>
            <p className="text-sm font-bold opacity-90 mb-10 max-w-xs leading-relaxed">{error}</p>
            <button 
              onClick={handleReset}
              className="bg-white text-red-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95"
            >
              Retry
            </button>
          </div>
        )}

        {/* Viewfinder overlay */}
        {!result && !isProcessing && !error && (
           <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/10 rounded-[2.5rem]">
                 <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1 rounded-tl-xl"></div>
                 <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1 rounded-tr-xl"></div>
                 <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1 rounded-bl-xl"></div>
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1 rounded-br-xl"></div>
              </div>
           </div>
        )}
      </div>

      {result ? (
        <div className="w-full mt-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full mb-3 inline-block uppercase tracking-widest ${CATEGORY_COLORS[result.category]}`}>
                {result.category}
              </span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{result.itemName}</h2>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <i className="fa-solid fa-coins text-yellow-500 text-xl"></i>
                <span className="text-4xl font-black text-green-600 tracking-tighter">+{result.estimatedValue}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coins</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleReset}
              className="flex-1 py-5 px-8 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-slate-100 text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
            >
              Reset
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-[2] py-5 px-8 rounded-2xl font-black text-lg uppercase tracking-tight bg-green-600 text-white shadow-xl shadow-green-200 hover:bg-green-500 transition-all active:scale-95 animate-pulse-grow"
            >
              Confirm Deposit
            </button>
          </div>
        </div>
      ) : (
        !error && (
          <div className="mt-12 flex flex-col items-center">
            <button 
              disabled={isProcessing || !isCameraReady}
              onClick={captureAndAnalyze}
              className={`w-24 h-24 rounded-full border-[10px] border-slate-100 flex items-center justify-center transition-all ${isProcessing || !isCameraReady ? 'bg-slate-400 opacity-50' : 'bg-green-600 shadow-2xl shadow-green-200 active:scale-90 hover:scale-105'}`}
            >
              <i className="fa-solid fa-shutter-speed text-white text-3xl"></i>
            </button>
            <p className="mt-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Tap to analyze item</p>
          </div>
        )
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Recycle;
