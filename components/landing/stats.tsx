"use client";

import Container from "@/components/layout/container";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

const stats = [
  { value: "10K+", label: "Active Players", color: "blue" },
  { value: "500K+", label: "Missions Cleared", color: "purple" },
  { value: "98%", label: "Player Satisfaction", color: "emerald" },
];

export default function Stats() {
  return (
    <section className="py-10 bg-[#0a0a0f] relative z-10 border-y border-white/5">
      <Container>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative grid gap-8 rounded-3xl border border-purple-500/30 bg-black/60 p-10 backdrop-blur-xl md:grid-cols-3 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]"
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Globe2 size={400} />
          </div>

          <div className="absolute top-0 left-0 px-4 py-1 bg-purple-500/20 border-b border-r border-purple-500/30 rounded-br-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Global Server Stats</span>
          </div>

          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center relative z-10 pt-4">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-md"
              >
                {stat.value}
              </motion.h3>

              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
              >
                {stat.label}
              </motion.p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}