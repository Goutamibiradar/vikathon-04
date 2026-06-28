'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Plus, Minus, Package, ClipboardList, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
};

type LogEntry = {
  id: string;
  timestamp: Date;
  transcript: string;
  status: 'success' | 'error' | 'unrecognized';
  message: string;
};

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'onions', quantity: 25, unit: 'kg', category: 'Vegetables' },
  { id: '2', name: 'tomatoes', quantity: 15, unit: 'kg', category: 'Vegetables' },
  { id: '3', name: 'milk', quantity: 10, unit: 'liters', category: 'Dairy' },
  { id: '4', name: 'chicken', quantity: 20, unit: 'kg', category: 'Meat' },
  { id: '5', name: 'flour', quantity: 50, unit: 'kg', category: 'Pantry' },
];

const voiceStickers = [
  // Audio/Voice emojis
  { emoji: '🎤', top: '15%', left: '8%' },
  { emoji: '🎙️', top: '75%', left: '85%' },
  { emoji: '🗣️', top: '40%', left: '92%' },
  { emoji: '🔊', top: '85%', left: '12%' },
  { emoji: '🎵', top: '25%', left: '80%' },
  { emoji: '🎶', top: '65%', left: '5%' },
  { emoji: '🎧', top: '10%', left: '50%' },
  { emoji: '💬', top: '90%', left: '50%' },
  { emoji: '📣', top: '50%', left: '15%' },
  
  // Inventory/Food emojis
  { emoji: '🍅', top: '20%', left: '25%' },
  { emoji: '🥕', top: '80%', left: '70%' },
  { emoji: '🧅', top: '35%', left: '75%' },
  { emoji: '🥩', top: '55%', left: '82%' },
  { emoji: '🥛', top: '12%', left: '90%' },
  { emoji: '📦', top: '70%', left: '30%' },
  { emoji: '📋', top: '30%', left: '15%' },
];

export default function VoiceInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let tempInterim = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              tempInterim += event.results[i][0].transcript;
            }
          }
          
          setInterimTranscript(tempInterim);

          if (finalTranscript) {
            processCommand(finalTranscript.trim().toLowerCase());
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };
      } else {
        console.warn('Speech recognition not supported in this browser.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInterimTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const processCommand = (transcript: string) => {
    // Basic regex to match: (add|remove) (number) (unit) (item name)
    // e.g., "add 10 kg onions"
    const regex = /(add|remove|use)\s+(\d+)\s*(kg|kilos|liters|boxes|grams|g|l|ml)?\s+(.+)/i;
    const match = transcript.match(regex);

    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      transcript,
      status: 'unrecognized',
      message: 'Could not understand command. Format: "Add [amount] [unit] [item]"'
    };

    if (match) {
      const action = match[1];
      const amountStr = match[2];
      const amount = parseInt(amountStr, 10);
      const itemName = match[4].trim();

      if (isNaN(amount) || amount <= 0) {
        newLog.status = 'error';
        newLog.message = 'Invalid amount specified.';
      } else {
        setInventory(prev => {
          const itemIndex = prev.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
          
          if (itemIndex >= 0) {
            const updated = [...prev];
            const currentItem = updated[itemIndex];
            
            if (action === 'add') {
              currentItem.quantity += amount;
              newLog.status = 'success';
              newLog.message = `Added ${amount} to ${currentItem.name}. New total: ${currentItem.quantity}`;
            } else if (action === 'remove' || action === 'use') {
              if (currentItem.quantity < amount) {
                newLog.status = 'error';
                newLog.message = `Cannot remove ${amount} from ${currentItem.name}. Only ${currentItem.quantity} available.`;
                return prev; // abort update
              }
              currentItem.quantity -= amount;
              newLog.status = 'success';
              newLog.message = `Removed ${amount} from ${currentItem.name}. New total: ${currentItem.quantity}`;
            }
            return updated;
          } else {
            // Item not found, auto-create it if it's an 'add' command
            if (action === 'add') {
              const unit = match[3] || 'units';
              const newItem: InventoryItem = {
                id: Date.now().toString(),
                name: itemName,
                quantity: amount,
                unit: unit,
                category: 'Uncategorized'
              };
              newLog.status = 'success';
              newLog.message = `Created new item ${itemName} with amount ${amount} ${unit}.`;
              return [...prev, newItem];
            } else {
              newLog.status = 'error';
              newLog.message = `Item "${itemName}" not found in inventory.`;
              return prev; // abort update
            }
          }
        });
      }
    }

    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated Orbs */}
        <div className="max-w-7xl mx-auto relative h-full">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[20%] right-[5%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] right-[40%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"
          />
        </div>
        
        {/* Floating Voice Emojis */}
        {voiceStickers.map((sticker, i) => (
          <motion.div
            key={`sticker-${i}`}
            className="absolute text-5xl md:text-6xl drop-shadow-xl opacity-80 dark:opacity-60 z-0"
            style={{ top: sticker.top, left: sticker.left }}
            animate={{ 
              y: [0, -25, 0], 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 9 + (i % 4), 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.8 
            }}
          >
            {sticker.emoji}
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-4"
          >
            <Mic className="h-4 w-4" />
            Voice-Activated
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Smart Inventory
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Keep your hands free in the kitchen. Update stock levels instantly using simple voice commands like "Add 10 kg onions" or "Remove 2 liters milk".
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Voice Control Panel */}
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 overflow-hidden relative">
              {isListening && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 pointer-events-none" 
                />
              )}
              <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                
                <button
                  onClick={toggleListening}
                  className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 shadow-xl ${
                    isListening 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/50 scale-105' 
                      : 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-100 dark:hover:bg-slate-200 shadow-slate-900/20'
                  }`}
                >
                  {isListening ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-full border-2 border-blue-400/50 pointer-events-none"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full border border-blue-300/30 pointer-events-none"
                      />
                      <Mic className="h-12 w-12 text-white" />
                    </>
                  ) : (
                    <MicOff className="h-12 w-12 text-white dark:text-slate-900" />
                  )}
                </button>

                <div className="mt-8 text-center h-16">
                  {isListening ? (
                    <div>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-1 animate-pulse">Listening for commands...</p>
                      {interimTranscript && (
                        <p className="text-xl text-slate-700 dark:text-slate-300 italic">"{interimTranscript}"</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Click the microphone to start</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Inventory Table */}
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Package className="h-5 w-5" /> Current Stock
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Item</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Category</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {inventory.map((item) => (
                          <motion.tr 
                            key={item.id}
                            layout
                            initial={{ opacity: 0, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                            animate={{ opacity: 1, backgroundColor: 'transparent' }}
                            className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                          >
                            <td className="p-4 font-medium text-slate-900 dark:text-slate-100 capitalize">{item.name}</td>
                            <td className="p-4 text-sm text-slate-500">{item.category}</td>
                            <td className="p-4 text-right">
                              <div className="inline-flex items-baseline gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                <span className="font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                                <span className="text-xs text-slate-500 font-medium">{item.unit}</span>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar: Activity Log */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-lg h-[calc(100vh-8rem)]">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="text-lg flex items-center justify-between text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" /> Activity Log
                  </div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">{logs.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto h-[calc(100%-4rem)]">
                <div className="p-4 space-y-4">
                  {logs.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      No commands recognized yet.
                    </div>
                  ) : (
                    <AnimatePresence>
                      {logs.map((log) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-slate-400">
                              {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            {log.status === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            {log.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                            {log.status === 'unrecognized' && <Activity className="h-4 w-4 text-amber-500" />}
                          </div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic mb-1.5">
                            "{log.transcript}"
                          </p>
                          <p className={`text-xs ${
                            log.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                            log.status === 'error' ? 'text-red-600 dark:text-red-400' :
                            'text-amber-600 dark:text-amber-400'
                          }`}>
                            {log.message}
                          </p>
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
