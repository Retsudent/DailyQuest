"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbarin";
import AddQuestModal from "@/components/quest/AddQuestModal";
import QuestDetailModal from "@/components/quest/QuestDetailModal";
import { Flame, Trophy, Star, Shield, Zap, Target, Eye } from "lucide-react";
import { motion } from "framer-motion";



const rarityConfig: Record<string, { bg: string; text: string; border: string; glow: string; icon: any }> = {
  common: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30", glow: "shadow-slate-500/20", icon: Target },
  rare: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", glow: "shadow-blue-500/20", icon: Shield },
  epic: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/50", glow: "shadow-purple-500/40", icon: Zap },
  legendary: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/50", glow: "shadow-amber-500/40", icon: Star },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [quests, setQuests] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [questsRes, statsRes] = await Promise.all([
        fetch("/api/quests"),
        fetch("/api/user/stats"),
      ]);
      
      if (!questsRes.ok || !statsRes.ok) {
        console.error("API error:", questsRes.status, statsRes.status);
        return;
      }

      const questsData = await questsRes.json();
      const statsData = await statsRes.json();
      
      if (Array.isArray(questsData)) setQuests(questsData);
      if (statsData) setUserStats(statsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleComplete = async (id: string) => {
    console.log("Attempting to complete quest:", id);
    try {
      const res = await fetch(`/api/quests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      if (res.ok) {
        console.log("Quest completed successfully!");
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to complete quest:", res.status, err.error);
      }
    } catch (error) {
      console.error("Error in handleComplete:", error);
    }
  };

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const xp = userStats?.xp || 0;
  const level = userStats?.level || 1;
  const streak = userStats?.streak || 0;
  const xpMax = level * 1000; // Example level curve
  const xpPercentage = (xp / xpMax) * 100;

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <main className="h-screen bg-[#0a0a0f] flex overflow-hidden selection:bg-purple-500/30">
        <Sidebar />

        <div className="flex-1 flex flex-col relative min-w-0">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          
          <Navbar />

          <div className="themed-scrollbar flex-1 overflow-y-auto p-4 md:p-8 z-10">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-8">
            
            {/* Character Profile Header */}
            <motion.div variants={item} className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-8 overflow-hidden shadow-2xl">
              {/* Scanline overlay effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-20 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                
                {/* Avatar / Level Badge */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2rem] blur opacity-50 group-hover:opacity-75 transition duration-500" />
                  <div className="relative w-32 h-32 rounded-[2rem] bg-zinc-900 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                    <span className="text-4xl font-black bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      LVL {level}
                    </span>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black border border-purple-500/50 rounded-full text-xs font-bold text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] whitespace-nowrap">
                    {level < 5 ? "Novice Explorer" : "Master Adventurer"}
                  </div>
                </div>

                {/* Info & XP Bar */}
                <div className="flex-1 w-full text-center md:text-left mt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wider mb-3 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                    <Flame size={14} className="animate-pulse" /> {streak} DAY STREAK
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    {session?.user?.name || "Player One"}
                  </h1>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm font-bold text-zinc-400 mb-2">
                      <span className="text-purple-400">EXP</span>
                      <span>{xp} / {xpMax}</span>
                    </div>
                    {/* Animated XP Bar */}
                    <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-purple-400 relative overflow-hidden"
                      >
                        {/* Diagonal stripes overlay for game feel */}
                        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[stripes_1s_linear_infinite]" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RPG Stat Blocks */}
            <motion.div variants={container} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Quests", value: "148", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
                { label: "Current Level", value: "3", icon: Star, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
                { label: "Epic Quests", value: "12", icon: Zap, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
                { label: "Mastery", value: "18%", icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
              ].map((stat, i) => (
                <motion.div key={i} variants={item} whileHover={{ y: -5, scale: 1.02 }} className={`relative p-5 rounded-2xl bg-black/40 border ${stat.border} backdrop-blur-xl group overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                  <div className="text-zinc-500 text-xs font-bold tracking-wider uppercase">{stat.label}</div>
                  <div className="text-2xl font-black text-white mt-1">{stat.value}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Active Quests Mission Board */}
            <motion.div variants={item} className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="w-2 h-8 bg-purple-500 rounded-full" /> Mission Board
                </h2>
                <motion.button 
                  onClick={() => setIsAddModalOpen(true)}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-[0_4px_0_rgb(126,34,206)] hover:shadow-[0_2px_0_rgb(126,34,206)] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-1"
                >
                  ACCEPT NEW
                </motion.button>
              </div>

              <div className="themed-scrollbar max-h-[500px] overflow-y-auto pr-2">
                <div className="space-y-4">
                  {quests.map((quest) => {
                    const conf = rarityConfig[quest.rarity] || rarityConfig.common;
                    const Icon = conf.icon;
                    return (
                      <motion.div 
                        key={quest.id} 
                        onClick={() => setSelectedQuest(quest)}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className={`group relative p-4 rounded-2xl border ${quest.completed ? 'border-zinc-800 bg-zinc-900/50 opacity-50' : conf.border + ' bg-black/50 hover:bg-white/[0.02]'} backdrop-blur-sm transition-all duration-300 flex items-center justify-between cursor-pointer`}
                      >
                        {/* Hover Glow */}
                        {!quest.completed && <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none rounded-2xl`} />}
                        
                        <div className="flex items-center gap-4 z-10">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${quest.completed ? 'bg-zinc-800 text-zinc-600' : conf.bg + ' ' + conf.text} shadow-inner`}>
                            <Icon size={24} />
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${quest.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
                              {quest.title}
                            </h3>
                            <div className="flex gap-2 mt-1">
                              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${quest.completed ? 'border-zinc-700 text-zinc-500' : conf.border + ' ' + conf.text}`}>
                                {quest.rarity}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-500 px-2 py-0.5 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                                +{quest.xp} EXP
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="z-10 flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuest(quest);
                            }}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 text-zinc-400 hover:text-blue-400 flex items-center justify-center transition-all shadow-lg"
                          >
                            <Eye size={18} />
                          </button>

                          {quest.completed ? (
                            <div className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-500 text-sm font-bold">
                              CLEARED
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComplete(quest.id);
                              }}
                              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-all shadow-lg"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes stripes {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </main>
    <AddQuestModal 
      isOpen={isAddModalOpen} 
      onClose={() => setIsAddModalOpen(false)} 
    />
    <QuestDetailModal 
      isOpen={!!selectedQuest} 
      onClose={() => setSelectedQuest(null)} 
      quest={selectedQuest} 
    />
  </>
  );
}