'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const SUGGESTIONS = [
  "What temperature should chicken be cooked to?",
  "How do I interpret a 'C' hygiene grade?",
  "What are common signs of foodborne illness?",
  "Best practices for cross-contamination?",
];

const assistantStickers = [
  { emoji: '🤖', top: '15%', left: '8%' },
  { emoji: '💬', top: '75%', left: '85%' },
  { emoji: '🧠', top: '40%', left: '92%' },
  { emoji: '💡', top: '85%', left: '12%' },
  { emoji: '🍔', top: '25%', left: '80%' },
  { emoji: '🛡️', top: '65%', left: '5%' },
  { emoji: '🔍', top: '10%', left: '50%' },
  { emoji: '📊', top: '90%', left: '50%' },
  { emoji: '👩‍🍳', top: '50%', left: '15%' },
  { emoji: '🍎', top: '20%', left: '25%' },
  { emoji: '🧼', top: '80%', left: '70%' },
  { emoji: '🦠', top: '35%', left: '75%' },
  { emoji: '🥩', top: '55%', left: '82%' },
  { emoji: '🌡️', top: '12%', left: '90%' },
  { emoji: '🥦', top: '70%', left: '30%' },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your SafeBite Food Safety Assistant. I can help you understand restaurant hygiene scores, FDA safety guidelines, and best practices for safe food handling. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare message history for the API
      const apiMessages = messages.concat(userMessage).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {assistantStickers.map((sticker, i) => (
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

      <div className="max-w-4xl mx-auto px-4 py-8 h-full flex flex-col relative z-10">
        <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
          <Bot className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            SafeBite AI Assistant <Sparkles className="h-4 w-4 text-emerald-500" />
          </h1>
          <p className="text-sm text-slate-500">Your intelligent guide to food safety and hygiene.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl rounded-2xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                    : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[85%]"
            >
              <div className="shrink-0 h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Analyzing knowledge base...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(suggestion)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about food safety..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <AlertCircle className="h-3 w-3" />
            <p>AI Assistant can make mistakes. For official guidance, consult your local health department.</p>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
