"use client";

import Container from "@/components/layout/container";
import { motion } from "framer-motion";
import { CheckCircle2, Trophy, Star } from "lucide-react";

export default function BeforeAfter() {
  return (
    <section className="py-24 bg-[#050508] relative overflow-hidden">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Stop Playing <span className="text-zinc-500">Boring</span> Games
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">Turn your daily tasks into an epic adventure.</p>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Before: Boring To-Do */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/5 bg-zinc-900/30 p-8 grayscale opacity-70 relative z-10"
          >
            <h3 className="text-xl font-bold text-zinc-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-zinc-500 rounded-full" /> The Old Way
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-500" />
                  <div className="h-4 w-3/4 bg-zinc-700 rounded" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* VS Badge for desktop */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-purple-600 border-4 border-[#050508] items-center justify-center z-20 text-white font-black italic shadow-xl">
            VS
          </div>

          {/* After: DailyQuest */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-purple-500/30 bg-purple-900/10 p-8 relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)] z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                <Trophy className="text-yellow-400" size={24} /> DailyQuest
              </h3>
              
              <div className="space-y-4">
                {[
                  { text: "Drink 2L Water", rarity: "Common", exp: "+50", color: "text-slate-400", border: "border-slate-500/30" },
                  { text: "Finish Homework", rarity: "Epic", exp: "+200", color: "text-purple-400", border: "border-purple-500/50" },
                  { text: "Workout 30 mins", rarity: "Rare", exp: "+100", color: "text-blue-400", border: "border-blue-500/30" }
                ].map((quest, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center justify-between p-4 rounded-xl border ${quest.border} bg-black/40 backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className={quest.color} size={20} />
                      <div>
                        <div className="font-bold text-white">{quest.text}</div>
                        <div className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${quest.color}`}>{quest.rarity}</div>
                      </div>
                    </div>
                    <div className="font-black text-yellow-400 flex items-center gap-1">
                      {quest.exp} <Star size={12} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
