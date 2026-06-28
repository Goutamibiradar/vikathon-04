'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, FileHeart, Award, HeartPulse, Building2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 flex items-center justify-center bg-radial from-emerald-500/10 via-transparent to-transparent overflow-hidden">
        
        {/* Professional Dot Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto">
          {/* Blobs */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ y: [0, 30, 0], x: [0, -20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-500/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px]"
          />

          {/* Floating Card 1: Hygiene Score */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] lg:left-[5%] bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 rotate-[-6deg]"
          >
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">A</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Hygiene Score</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">96/100 points</p>
            </div>
          </motion.div>

          {/* Floating Card 2: Verified Inspection */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[25%] right-[10%] lg:right-[5%] bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3 rotate-[4deg]"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Inspection Passed</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Just now</p>
            </div>
          </motion.div>

          {/* Floating Card 3: SafeBite Certified */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[65%] left-[15%] lg:left-[8%] hidden md:flex bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl p-3 items-center gap-3 rotate-[-2deg]"
          >
            <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Verified Safe</p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-6 border border-emerald-500/20"
          >
            <Award className="h-3.5 w-3.5" />
            <span>Digitalizing Food Safety Audits</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]"
          >
            Verify Food Safety & Hygiene{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Standards Instantly
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            SafeBite empowers customers with transparent inspection ratings while helping restaurants streamline safety logs, checklists, and safety audits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/restaurants" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto group">
                Search Restaurants
                <Search className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/complaint" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:border-rose-300 dark:hover:border-rose-800">
                File a Safety Complaint
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-12 bg-white dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { number: '1,450+', label: 'Registered Restaurants', icon: Building2, color: 'text-emerald-500' },
              { number: '3,820+', label: 'Digital Inspections Completed', icon: ShieldCheck, color: 'text-blue-500' },
              { number: '98.4%', label: 'Compliance Index', icon: CheckCircle2, color: 'text-teal-500' },
              { number: '100%', label: 'Public Transparency', icon: HeartPulse, color: 'text-rose-500' },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center p-4">
                <div className="mx-auto w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{stat.number}</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Hygiene Monitoring
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            A three-way ecosystem connecting health officers, diner feedback, and food establishments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'For Diners & Public',
              desc: 'Search nearby diners, verify safety grades instantly, and check detailed hygiene summaries before stepping inside.',
              icon: Search,
              color: 'from-emerald-500 to-teal-500',
              link: '/restaurants',
              linkText: 'Search Directory',
            },
            {
              title: 'For Inspectors & Officers',
              desc: 'Perform on-site compliance reports directly from mobile web, fill score sheets, and upload proof pictures.',
              icon: ShieldCheck,
              color: 'from-sky-500 to-blue-500',
              link: '/inspector',
              linkText: 'Access Portal',
            },
            {
              title: 'For Restaurant Admins',
              desc: 'Monitor health records, manage restaurant profiles, view inspection reports, and resolve customer complaints.',
              icon: FileHeart,
              color: 'from-purple-500 to-indigo-500',
              link: '/admin',
              linkText: 'Open Console',
            },
          ].map((card, i) => (
            <Card key={i} className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-t-4 border-t-emerald-500">
              <CardContent className="p-8 flex flex-col h-full justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} text-white flex items-center justify-center mb-6 shadow-md`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{card.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{card.desc}</p>
                </div>
                <Link href={card.link}>
                  <Button variant="ghost" size="sm" className="group p-0 text-emerald-600 dark:text-emerald-400 hover:bg-transparent">
                    {card.linkText}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 SafeBite Smart Food Safety. Built for 12h Hackathon MVP demo.</p>
      </footer>
    </div>
  );
}
