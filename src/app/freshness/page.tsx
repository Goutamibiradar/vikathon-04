'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImageIcon, ScanLine, AlertTriangle, CheckCircle2, Info, ArrowRight, ShieldCheck, Leaf, Apple, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type FreshnessResult = {
  foodName: string;
  status: 'Fresh' | 'Stale' | 'Spoiled';
  confidence: number;
  shelfLife: string;
  storageRecommendation: string;
  safetyAdvice: string;
  visualDetails?: string;
};

const stickers = [
  { emoji: '🍎', top: '10%', left: '5%', delay: 0 },
  { emoji: '🥑', top: '25%', left: '85%', delay: 1.5 },
  { emoji: '🍔', top: '60%', left: '10%', delay: 3 },
  { emoji: '🥦', top: '75%', left: '90%', delay: 2 },
  { emoji: '🍕', top: '40%', left: '95%', delay: 0.5 },
  { emoji: '🍣', top: '85%', left: '15%', delay: 2.5 },
  { emoji: '🌮', top: '15%', left: '75%', delay: 4 },
  { emoji: '🥐', top: '50%', left: '5%', delay: 1 },
  // Dark emojis
  { emoji: '🍆', top: '35%', left: '20%', delay: 1.2 },
  { emoji: '🍇', top: '80%', left: '30%', delay: 2.8 },
  { emoji: '🫐', top: '20%', left: '45%', delay: 0.8 },
  { emoji: '🥥', top: '70%', left: '60%', delay: 3.5 },
  { emoji: '🫒', top: '90%', left: '40%', delay: 2.2 },
  { emoji: '🥝', top: '55%', left: '35%', delay: 1.7 },
  { emoji: '🍄', top: '45%', left: '80%', delay: 3.1 },
  { emoji: '🖤', top: '12%', left: '60%', delay: 2.4 },
];

export default function FreshnessDetectorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<FreshnessResult | null>(null);
  const [history, setHistory] = useState<Array<{ image: string; result: FreshnessResult }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setResult(null); // Reset previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setResult(null);

    try {
      const response = await fetch('/api/freshness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data: FreshnessResult = await response.json();
      setResult(data);
      setHistory(prev => [{ image: selectedImage, result: data }, ...prev]);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fresh': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-emerald-500/20';
      case 'Stale': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-amber-500/20';
      case 'Spoiled': return 'text-red-500 bg-red-50 dark:bg-red-900/20 ring-red-500/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20 ring-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Fresh': return <CheckCircle2 className="h-5 w-5" />;
      case 'Stale': return <Clock className="h-5 w-5" />;
      case 'Spoiled': return <AlertTriangle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 relative overflow-hidden">
      
      {/* Floating Food Stickers Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stickers.map((sticker, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl md:text-4xl drop-shadow-xl opacity-60 dark:opacity-40"
            style={{ top: sticker.top, left: sticker.left }}
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 8 + (i % 3), 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: sticker.delay 
            }}
          >
            {sticker.emoji}
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-4"
          >
            <ScanLine className="h-4 w-4" />
            AI-Powered Analysis
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Food Freshness Detector
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Upload a photo of your food (fruits, vegetables, meats) and let our AI determine its freshness, estimate shelf life, and provide safety advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all hover:border-emerald-500/50">
              <CardContent className="p-0">
                <div 
                  className="relative min-h-[400px] flex flex-col items-center justify-center p-8 group cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={!selectedImage ? triggerFileInput : undefined}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {selectedImage ? (
                    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={selectedImage} 
                        alt="Food to analyze" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      {/* Scanning Animation Overlay */}
                      <AnimatePresence>
                        {isScanning && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center"
                          >
                            <motion.div
                              animate={{ y: [-10, 10, -10] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] absolute top-1/2 left-0 z-10"
                            />
                            <ScanLine className="h-16 w-16 text-emerald-400 animate-pulse mb-4" />
                            <p className="text-white font-medium text-lg tracking-wide">Analyzing Freshness...</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Change Image Button */}
                      {!isScanning && (
                        <div className="absolute top-4 right-4">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                            className="bg-white/90 hover:bg-white text-slate-800 shadow-lg"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Change Photo
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center space-y-4 pointer-events-none">
                      <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-all duration-300">
                        <ImageIcon className="h-10 w-10 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                          Click or drag and drop an image
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Supports JPG, PNG, WEBP
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedImage && !isScanning && !result && (
              <div className="flex justify-center">
                <Button 
                  onClick={analyzeImage} 
                  size="lg"
                  className="w-full max-w-md h-14 text-lg rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20"
                >
                  <ScanLine className="h-5 w-5 mr-2" />
                  Analyze Freshness Now
                </Button>
              </div>
            )}

            {/* Results Section */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900">
                    <div className="border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {result.foodName}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-slate-500 font-medium">Confidence:</span>
                          <div className="flex-1 w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full" 
                              style={{ width: `${result.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{result.confidence}%</span>
                        </div>
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ring-1 ring-inset ${getStatusColor(result.status)}`}>
                        {getStatusIcon(result.status)}
                        <span className="font-bold text-lg tracking-wide">{result.status}</span>
                      </div>
                    </div>

                    <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold mb-1">
                          <Clock className="h-4 w-4 text-emerald-500" />
                          Estimated Shelf Life
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{result.shelfLife}</p>
                      </div>

                      <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold mb-1">
                          <ShieldCheck className="h-4 w-4 text-blue-500" />
                          Storage Recommendation
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{result.storageRecommendation}</p>
                      </div>

                      <div className="sm:col-span-2 space-y-2 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-500 font-semibold mb-1">
                          <AlertTriangle className="h-4 w-4" />
                          Food Safety Advice
                        </div>
                        <p className="text-amber-700 dark:text-amber-400/90 leading-relaxed">{result.safetyAdvice}</p>
                      </div>

                      {result.visualDetails && (
                        <div className="sm:col-span-2 space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold mb-1">
                            <ImageIcon className="h-4 w-4 text-purple-500" />
                            Visual Characteristics
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{result.visualDetails}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Sidebar: Scan History */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-lg">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Recent Scans</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{history.length}</span>
              </div>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto p-4 space-y-4">
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      <Leaf className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      No scans yet. Upload an image to start!
                    </div>
                  ) : (
                    <AnimatePresence>
                      {history.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer"
                          onClick={() => {
                            setSelectedImage(item.image);
                            setResult(item.result);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt="scan history" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {item.result.foodName}
                            </p>
                            <p className={`text-xs font-medium mt-0.5 ${
                              item.result.status === 'Fresh' ? 'text-emerald-600 dark:text-emerald-400' :
                              item.result.status === 'Stale' ? 'text-amber-600 dark:text-amber-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {item.result.status} • {item.result.confidence}%
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
