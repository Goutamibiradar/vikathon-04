'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Utensils, CheckCircle2, Shield, BarChart3 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Mock authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock credentials check
    if (email === 'admin@safebite.com' && password === 'admin123') {
      router.push('/admin/dashboard');
    } else {
      // Accept any credentials for demo purposes
      router.push('/admin/dashboard');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
    setForgotSent(true);
  };

  const features = [
    { icon: Shield, text: 'Real-time safety monitoring' },
    { icon: BarChart3, text: 'Analytics & compliance reports' },
    { icon: CheckCircle2, text: 'Automated inspection tracking' },
    { icon: Utensils, text: 'Restaurant management tools' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full border border-white/20" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/10" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">SafeBite</h2>
                <p className="text-emerald-200 text-xs font-medium tracking-wider uppercase">Admin Portal</p>
              </div>
            </div>

            {/* Tagline */}
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
              Smart Food Safety<br />
              <span className="text-emerald-200">Management Platform</span>
            </h1>
            <p className="text-emerald-100/80 text-lg mb-12 max-w-md leading-relaxed">
              Monitor, manage, and ensure food safety compliance across all your restaurants from one powerful dashboard.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <feature.icon className="h-4 w-4 text-emerald-200" />
                  </div>
                  <span className="text-white/90 font-medium text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom attribution */}
          <div className="absolute bottom-8 left-16 text-emerald-200/50 text-xs">
            © 2026 SafeBite. Secured with enterprise-grade encryption.
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">SafeBite</h2>
              <p className="text-slate-500 text-xs font-medium">Admin Portal</p>
            </div>
          </div>

          {!showForgotPassword ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  Welcome back
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Sign in to access your admin dashboard
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="admin@safebite.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-xl px-4 py-3"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Forgot Password & Remember */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-900" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  id="admin-login-button"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security note */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Shield className="h-3.5 w-3.5" />
                <span>Protected by 256-bit SSL encryption</span>
              </div>
            </>
          ) : (
            /* Forgot Password View */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => { setShowForgotPassword(false); setForgotSent(false); setForgotEmail(''); }}
                className="text-sm text-emerald-600 hover:text-emerald-500 font-medium mb-6 flex items-center gap-1 transition-colors"
              >
                ← Back to login
              </button>

              {!forgotSent ? (
                <>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                    Reset Password
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Enter your email and we&apos;ll send you a password reset link.
                  </p>

                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="admin@safebite.com"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-[0.98]"
                    >
                      Send Reset Link
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    We&apos;ve sent a password reset link to <strong className="text-slate-700 dark:text-slate-300">{forgotEmail}</strong>
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
