"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbarin";
import AddQuestModal from "@/components/quest/AddQuestModal";
import QuestDetailModal from "@/components/quest/QuestDetailModal";
import { Flame, Trophy, Star, Shield, Zap, Target, Eye, Lock } from "lucide-react";
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

  const totalXp = userStats?.xp || 0;
  const level = Math.floor(totalXp / 1000) + 1;
  const currentLevelXp = totalXp % 1000;
  const xpMax = 1000;
  const xpPercentage = Math.min(100, Math.max(0, (currentLevelXp / xpMax) * 100));
  const streak = userStats?.streak || 0;

  const getTitle = (lvl: number) => {
    if (lvl < 5) return "Novice Explorer";
    if (lvl < 10) return "Seasoned Adventurer";
    if (lvl < 20) return "Quest Master";
    return "Legendary Hero";
  };

  const totalQuests = quests.length;
  const epicQuests = quests.filter(q => q.rarity === "epic" || q.rarity === "legendary").length;
  const mastery = quests.length > 0 ? Math.round((quests.filter(q => q.completed).length / quests.length) * 100) : 0;

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
                    {getTitle(level)}
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
                      <span>{currentLevelXp} / {xpMax}</span>
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
                { label: "Total Quests", value: totalQuests.toString(), icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
                { label: "Current Level", value: level.toString(), icon: Star, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
                { label: "Epic Quests", value: epicQuests.toString(), icon: Zap, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
                { label: "Mastery", value: `${mastery}%`, icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
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
              <div className="flex flex-row items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3 leading-tight">
                  <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-purple-500 rounded-full shrink-0" /> 
                  <span>Mission<br className="sm:hidden" /> Board</span>
                </h2>
                <motion.button 
                  onClick={() => setIsAddModalOpen(true)}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-[0_4px_0_rgb(126,34,206)] hover:shadow-[0_2px_0_rgb(126,34,206)] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-1 text-sm sm:text-base shrink-0"
                >
                  ACCEPT NEW
                </motion.button>
              </div>

              <div className="themed-scrollbar max-h-[500px] overflow-y-auto pr-2">
                <div className="space-y-4">
                  {quests.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/10 rounded-2xl bg-black/20">
                      <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 border border-purple-500/20 shadow-lg">
                        <Flame className="text-purple-400/50" size={32} />
                      </div>
                      <h3 className="text-xl font-black text-zinc-300 uppercase tracking-widest mb-2">No Active Quests</h3>
                      <p className="text-zinc-500 mb-6 max-w-sm text-sm">Your mission board is empty. Accept a new quest to continue your journey and earn EXP.</p>
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/50 text-purple-300 hover:text-white font-bold uppercase tracking-wider transition-all"
                      >
                        Find Quests
                      </button>
                    </div>
                  ) : (
                    quests.map((quest) => {
                      const conf = rarityConfig[quest.rarity] || rarityConfig.common;
                      const Icon = conf.icon;
                      return (
                        <motion.div 
                          key={quest.id} 
                          onClick={() => setSelectedQuest(quest)}
                          whileHover={{ scale: 1.01, x: 5 }}
                          className={`group relative p-3 sm:p-4 rounded-2xl border ${quest.completed ? 'border-zinc-800 bg-zinc-900/50 opacity-50' : conf.border + ' bg-black/50 hover:bg-white/[0.02]'} backdrop-blur-sm transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 justify-between cursor-pointer overflow-hidden`}
                        >
                          {/* Hover Glow */}
                          {!quest.completed && <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none rounded-2xl`} />}
                          
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 z-10 w-full sm:w-auto flex-1 min-w-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center ${quest.completed ? 'bg-zinc-800 text-zinc-600' : conf.bg + ' ' + conf.text} shadow-inner`}>
                              <Icon size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                              <h3 className={`font-bold text-base sm:text-lg leading-tight mb-1.5 ${quest.completed ? 'text-zinc-500 line-through' : 'text-white'} break-words`}>
                                {quest.title}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${quest.completed ? 'border-zinc-700 text-zinc-500' : conf.border + ' ' + conf.text}`}>
                                  {quest.rarity}
                                </span>
                                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-yellow-500 px-2 py-0.5 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                                  +{quest.xp} EXP
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="z-10 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end shrink-0 sm:pl-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedQuest(quest);
                              }}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 text-zinc-400 hover:text-blue-400 flex items-center justify-center transition-all shadow-lg shrink-0"
                            >
                              <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>

                            {quest.completed ? (
                              <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-zinc-800 text-zinc-500 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0">
                                CLEARED
                              </div>
                            ) : (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleComplete(quest.id);
                                }}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-all shadow-lg shrink-0"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </div>
              </div>
            </motion.div>

            {/* Milestones & Rewards */}
            <motion.div variants={item} className="mt-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8">
              <div className="flex flex-row items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <span className="w-2 h-8 bg-yellow-500 rounded-full shrink-0" />
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase tracking-tighter">
                  Unlockables Roadmap
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { lvl: 5, title: "Novice Title", desc: "Unlock the Novice Explorer title.", unlocked: level >= 5 },
                  { lvl: 10, title: "Seasoned Title", desc: "Unlock the Seasoned Adventurer title.", unlocked: level >= 10 },
                  { lvl: 20, title: "Quest Master", desc: "Unlock the Quest Master title.", unlocked: level >= 20 },
                ].map((reward, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${reward.unlocked ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-white/5 bg-white/5'} flex flex-col items-center text-center relative overflow-hidden transition-all hover:scale-105 group`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${reward.unlocked ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-black text-zinc-600 border border-white/10'}`}>
                      {reward.unlocked ? <Shield size={24} /> : <Lock size={24} />}
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${reward.unlocked ? 'text-yellow-500' : 'text-zinc-500'}`}>
                      Level {reward.lvl}
                    </div>
                    <div className={`font-bold mb-2 ${reward.unlocked ? 'text-white' : 'text-zinc-400'}`}>{reward.title}</div>
                    <div className="text-xs text-zinc-500">{reward.desc}</div>
                    
                    {reward.unlocked && (
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-500/20 blur-2xl rounded-full pointer-events-none group-hover:bg-yellow-500/30 transition-colors" />
                    )}
                  </div>
                ))}
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