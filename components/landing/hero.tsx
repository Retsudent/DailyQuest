"use client";

import Container from "@/components/layout/container";
import { motion } from "framer-motion";
import { ShieldAlert, Sword, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32 bg-[#050508]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15),transparent_50%)]" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

      <Container>
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <Sparkles size={14} className="animate-pulse text-yellow-400" />
            Season 1 is now live
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight text-white uppercase tracking-tighter"
          >
            Gamify Your{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-purple-600/20 blur-xl" />
              <span className="relative bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                Real Life
              </span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg md:text-xl text-zinc-400 font-medium"
          >
            Stop procrastinating. Turn your boring daily routines into epic quests, earn EXP, level up your stats, and become the hero of your own story.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest shadow-[0_6px_0_rgb(126,34,206)] hover:shadow-[0_3px_0_rgb(126,34,206)] hover:translate-y-[3px] transition-all active:shadow-none active:translate-y-[6px]"
              >
                <Sword size={20} />
                Start Your Journey
              </motion.button>
            </Link>

            <Link href="#features" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-zinc-900 border-2 border-zinc-700 hover:border-purple-500/50 text-white font-black uppercase tracking-widest transition-colors"
              >
                <ShieldAlert size={20} className="text-zinc-400" />
                View Manual
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating Game HUD Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 relative w-full max-w-4xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent z-20" />
            
            <div className="relative z-10 rounded-3xl border-2 border-purple-500/20 bg-black/50 p-2 backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden">
              {/* Fake App Interface Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Player Interface v1.0</div>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <div className="h-4 w-1/3 bg-purple-500/20 rounded animate-pulse" />
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-24 w-full bg-zinc-900/80 rounded-xl border border-white/5 flex items-center p-4 gap-4 shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-1/2 bg-white/10 rounded" />
                      <div className="h-2 w-1/4 bg-white/5 rounded" />
                    </div>
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="h-24 w-full bg-zinc-900/80 rounded-xl border border-white/5 flex items-center p-4 gap-4 shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-3/4 bg-white/10 rounded" />
                      <div className="h-2 w-1/3 bg-white/5 rounded" />
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-1/2 bg-blue-500/20 rounded animate-pulse" />
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="h-40 w-full bg-zinc-900/80 rounded-xl border border-white/5 relative overflow-hidden shadow-lg"
                  >
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-500/20 to-transparent" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}