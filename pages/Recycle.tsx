
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
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeminiResponse | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

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
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64Image = dataUrl.split(',')[1];

      try {
        const aiResult = await identifyRecyclable(base64Image);
        setResult(aiResult);
      } catch (err) {
        setError("AI failed to process. Try again with better lighting.");
        console.error(err);
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
      <div className="w-full mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Smart Scanner</h1>
        <p className="text-slate-500">Hold the item in front of the camera</p>
      </div>

      <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        {!result && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        )}
        
        {result && (
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover"
          />
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-bold">Identifying Item...</p>
            <p className="text-sm opacity-70 mt-2">Checking material and recyclability score</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-x-0 bottom-0 bg-red-600 text-white p-4 text-center">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="absolute top-4 right-4 flex gap-2">
          <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-white text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            AI Online
          </div>
        </div>
      </div>

      {result ? (
        <div className="w-full mt-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl animate-in slide-in-from-bottom-10 duration-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md mb-2 inline-block ${CATEGORY_COLORS[result.category]}`}>
                {result.category}
              </span>
              <h2 className="text-2xl font-bold text-slate-800">{result.itemName}</h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-green-600">+{result.estimatedValue}</span>
              <p className="text-xs text-slate-400">COINS</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Recyclability</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${result.recyclabilityScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-slate-700">{result.recyclabilityScore}%</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">AI Confidence</p>
              <p className="text-sm font-bold text-slate-700">{(result.confidence * 100).toFixed(0)}% Match</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleReset}
              className="flex-1 py-4 px-6 rounded-2xl font-bold border-2 border-slate-100 text-slate-500 hover:bg-slate-50 transition-all"
            >
              Scan Again
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-[2] py-4 px-6 rounded-2xl font-bold bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-all"
            >
              Deposit & Earn
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center">
          <button 
            disabled={isProcessing}
            onClick={captureAndAnalyze}
            className={`w-20 h-20 rounded-full border-8 border-slate-100 flex items-center justify-center transition-all ${isProcessing ? 'bg-slate-400 opacity-50' : 'bg-green-600 shadow-xl shadow-green-200 active:scale-95'}`}
          >
            <i className="fa-solid fa-camera text-white text-2xl"></i>
          </button>
          <p className="mt-4 text-slate-400 text-sm font-medium">Tap to identify item</p>
        </div>
      )}

      {/* Helper Canvas Hidden */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Recycle;
