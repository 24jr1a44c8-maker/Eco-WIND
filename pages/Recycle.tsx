
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
      setError("Unable to access camera. Please check your browser permissions.");
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
    
    // Ensure we have actual dimensions before capturing
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError("Camera is still warming up. Please wait a second.");
      setIsProcessing(false);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const base64Image = dataUrl.split(',')[1];

      if (!base64Image || base64Image.length < 100) {
        setError("Failed to capture a clear image. Please try again.");
        setIsProcessing(false);
        return;
      }

      try {
        const aiResult = await identifyRecyclable(base64Image);
        setResult(aiResult);
      } catch (err: any) {
        setError(err.message || "AI Analysis failed. Please check your internet connection.");
        console.error("Analysis failure:", err);
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
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">AI <span className="text-green-600">Scanner</span></h1>
        <p className="text-slate-500 font-medium">Position your item clearly within the frame.</p>
      </div>

      <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
        {!result && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isCameraReady ? 'opacity-100' : 'opacity-30'}`}
          />
        )}
        
        {result && (
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover animate-in fade-in duration-500"
          />
        )}

        {!isCameraReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
             <i className="fa-solid fa-spinner animate-spin text-3xl mb-4"></i>
             <p className="text-xs font-black uppercase tracking-widest">Waking up Camera...</p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-20">
            <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"></div>
            <p className="text-2xl font-black italic tracking-tighter uppercase">Analyzing Material</p>
            <p className="text-xs font-bold text-white/40 mt-3 tracking-widest uppercase">Consulting Gemini AI...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-600/95 backdrop-blur-xl text-white p-10 flex flex-col items-center justify-center text-center z-30">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
            </div>
            <p className="text-xl font-black uppercase italic tracking-tighter mb-4">System Error</p>
            <p className="text-sm font-bold opacity-90 mb-10 max-w-xs leading-relaxed">{error}</p>
            <button 
              onClick={handleReset}
              className="bg-white text-red-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
            >
              Reset & Try Again
            </button>
          </div>
        )}

        {/* Viewfinder Overlay */}
        {!result && !isProcessing && !error && (
           <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/20 rounded-[2rem]">
                 <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1 rounded-tl-xl"></div>
                 <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1 rounded-tr-xl"></div>
                 <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1 rounded-bl-xl"></div>
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1 rounded-br-xl"></div>
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                AI Processor Online
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deposit Reward</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-3">Recyclability</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400" 
                    style={{ width: `${result.recyclabilityScore}%` }}
                  ></div>
                </div>
                <span className="text-lg font-black text-slate-700">{result.recyclabilityScore}%</span>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-3">AI Match</p>
              <p className="text-lg font-black text-slate-700">{(result.confidence * 100).toFixed(0)}% Certainty</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleReset}
              className="flex-1 py-5 px-8 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95"
            >
              Retake
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-[2] py-5 px-8 rounded-2xl font-black text-lg uppercase tracking-tight bg-green-600 text-white shadow-xl shadow-green-200 hover:bg-green-500 transition-all active:scale-95 animate-pulse-grow"
            >
              Deposit Item
            </button>
          </div>
        </div>
      ) : (
        !error && (
          <div className="mt-12 flex flex-col items-center">
            <button 
              disabled={isProcessing || !isCameraReady}
              onClick={captureAndAnalyze}
              className={`w-24 h-24 rounded-full border-[10px] border-slate-100 flex items-center justify-center transition-all ${isProcessing || !isCameraReady ? 'bg-slate-400 opacity-50' : 'bg-green-600 shadow-2xl shadow-green-200 active:scale-90 hover:scale-110'}`}
            >
              <i className="fa-solid fa-shutter-speed text-white text-3xl"></i>
            </button>
            <p className="mt-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Tap to analyze item</p>
          </div>
        )
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Recycle;
