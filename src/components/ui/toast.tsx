'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />,
              error: <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />,
              info: <Info className="h-5 w-5 text-sky-500 flex-shrink-0" />,
            };

            const colors = {
              success: 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-300',
              error: 'border-rose-100 dark:border-rose-900/30 bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-300',
              info: 'border-sky-100 dark:border-sky-900/30 bg-sky-50/95 dark:bg-sky-950/90 text-sky-900 dark:text-sky-300',
            };

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                className={`flex items-start justify-between p-4 rounded-2xl border backdrop-blur-md shadow-lg pointer-events-auto ${colors[t.type]}`}
              >
                <div className="flex gap-3">
                  {icons[t.type]}
                  <p className="text-sm font-medium leading-relaxed">{t.message}</p>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-3 mt-0.5 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
