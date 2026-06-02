"use client";

import Container from "@/components/layout/container";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-32 bg-[#050508]">
      {/* Background Ambience */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 blur-[150px] pointer-events-none" />

      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2rem] border border-white/10 bg-black/40 p-16 text-center backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Hex Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSI0OSIgdmlld0JveD0iMCAwIDI4IDQ5Ij48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxwYXRoIGQ9Ik0xMy45OSAxMS40NjJMMCAxOS41Mzh2MTYuMTA4bDEzLjk5IDguMDc2IDEzLjk5LTguMDc2VjE5LjUzOEwxMy45OSAxMS40NjJ6TTI2LjI3IDM0LjY0NmwtMTIuMjggNy4wODktMTIuMjgtNy4wODlWMjAuNThsMTIuMjgtNy4wODkgMTIuMjggNy4wODl2MTQuMDY2eiIgLz48L2c+PC9zdmc+')] opacity-20 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 mb-8 shadow-inner">
              <Gamepad2 size={32} />
            </div>

            <h2 className="text-4xl font-black text-white lg:text-6xl uppercase tracking-tighter">
              Ready To Enter The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Arena?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 font-medium">
              Join thousands of players worldwide. Create your character, accept your first mission, and start leveling up your life today.
            </p>

            <div className="mt-12 flex flex-col items-center">
              <Link href="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-black uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.4)] border border-purple-400/50 hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all"
                >
                  Create Character
                </motion.button>
              </Link>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600 mt-6">
                Free to play. No pay to win.
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}