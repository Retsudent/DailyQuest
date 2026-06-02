"use client";

import { motion } from "framer-motion";
import { Sword, Trophy, Flame, Target } from "lucide-react";
import Container from "@/components/layout/container";

const features = [
  {
    icon: Sword,
    title: "Epic Quests",
    description: "Transform mundane chores into heroic missions. Defeat procrastination and claim your rewards.",
    color: "purple"
  },
  {
    icon: Flame,
    title: "Streak Combos",
    description: "Chain your productive days together to build massive multipliers and unlock exclusive achievements.",
    color: "orange"
  },
  {
    icon: Trophy,
    title: "Loot & Badges",
    description: "Earn rare titles, profile borders, and badges to show off your productivity dominance.",
    color: "yellow"
  },
  {
    icon: Target,
    title: "Skill Trees",
    description: "Analyze your combat logs (statistics) and level up specific areas of your life.",
    color: "blue"
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative bg-[#0a0a0f] overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Container>
        {/* Heading */}
        <div className="mx-auto mb-20 max-w-3xl text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 border border-purple-500/30 px-4 py-1.5 rounded-full bg-purple-500/10">
              Game Mechanics
            </span>
          </div>
          <h2 className="text-4xl font-black text-white lg:text-5xl uppercase tracking-tighter">
            Master The <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-500">System</span>
          </h2>
          <p className="mt-6 text-zinc-400 font-medium">
            We've engineered the perfect gameplay loop to keep you hooked on achieving your real-life goals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const bgClass = `bg-${feature.color}-500/10`;
            const borderClass = `border-${feature.color}-500/30`;
            const textClass = `text-${feature.color}-400`;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10 }}
                className={`relative p-8 rounded-3xl bg-black/50 border ${borderClass} backdrop-blur-xl group overflow-hidden shadow-xl`}
              >
                {/* Ambient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className={`relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${bgClass} border ${borderClass} shadow-inner`}>
                  <Icon className={`h-8 w-8 ${textClass}`} />
                </div>

                <h3 className="relative z-10 text-xl font-black text-white uppercase tracking-wider mb-3">
                  {feature.title}
                </h3>

                <p className="relative z-10 text-sm text-zinc-400 font-medium leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-${feature.color}-500/20 to-transparent opacity-50`}></div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}