import { motion } from "framer-motion";
import { Trophy, Skull, Crown, CheckCircle2, XCircle, TrendingUp, ShieldCheck } from "lucide-react";

interface QuestAnalysisProps {
  data?: {
    topCompleted: Array<{ name: string; count: number; icon: string; color: string; bg: string }>;
    topFailed: Array<{ name: string; count: number; icon: string; color: string; bg: string }>;
    mostProductiveDay: { day: string; avgQuests: number; bestTime: string };
  };
  loading?: boolean;
}

export default function QuestAnalysis({ data, loading }: QuestAnalysisProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-black/40 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden animate-pulse shadow-md h-72 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-white/5" />
                <div className="h-4 bg-white/10 rounded w-28" />
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-white/5 rounded-xl w-full" />
                <div className="h-10 bg-white/5 rounded-xl w-full" />
                <div className="h-10 bg-white/5 rounded-xl w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { topCompleted, topFailed, mostProductiveDay } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      
      {/* Top Completed */}
      <motion.div variants={itemVariants} className="bg-black/40 border border-blue-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-4 sm:mb-6 relative z-10">
          <div className="p-2 sm:p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/50 text-blue-400">
            <Trophy size={18} />
          </div>
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Top Triumphs</h3>
        </div>

        <div className="space-y-3 sm:space-y-4 relative z-10">
          {topCompleted.length > 0 ? (
            topCompleted.map((quest, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-2.5 sm:p-3 hover:bg-white/10 hover:border-blue-500/30 transition-colors duration-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${quest.bg} ${quest.color} flex items-center justify-center text-xs sm:text-sm shadow-inner`}>
                    {quest.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs sm:text-sm truncate max-w-[150px]">{quest.name}</div>
                    <div className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={10} className="text-blue-400" /> {quest.count} Clears
                    </div>
                  </div>
                </div>
                <div className="text-zinc-600 font-black text-base sm:text-lg italic">#{i + 1}</div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-white/5 border border-white/5 rounded-2xl">
              <span className="text-2xl mb-2">⚔️</span>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">No quests completed yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Top Failed */}
      <motion.div variants={itemVariants} className="bg-black/40 border border-red-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-4 sm:mb-6 relative z-10">
          <div className="p-2 sm:p-2.5 bg-red-500/20 rounded-xl border border-red-500/50 text-red-400">
            <Skull size={18} />
          </div>
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Top Defeats</h3>
        </div>

        <div className="space-y-3 sm:space-y-4 relative z-10 h-[calc(100%-4rem)] flex flex-col justify-center">
          {topFailed && topFailed.length > 0 ? (
            topFailed.map((quest, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-2.5 sm:p-3 hover:bg-white/10 hover:border-red-500/30 transition-colors duration-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${quest.bg} ${quest.color} flex items-center justify-center text-xs sm:text-sm shadow-inner`}>
                    {quest.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs sm:text-sm truncate max-w-[150px]">{quest.name}</div>
                    <div className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      <XCircle size={10} className="text-red-400" /> {quest.count} Fails
                    </div>
                  </div>
                </div>
                <div className="text-zinc-600 font-black text-base sm:text-lg italic">#{i + 1}</div>
              </div>
            ))
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center p-4 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden group-hover:border-emerald-500/40 transition-colors duration-300"
            >
              <div className="p-3 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-emerald-400 mb-3 relative z-10 animate-pulse">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-white font-black text-xs sm:text-sm uppercase tracking-wider relative z-10">Flawless Run</h4>
              <p className="text-emerald-400/80 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest mt-1.5 relative z-10 leading-relaxed max-w-[180px]">
                No defeats registered! Keep up the clean run, player!
              </p>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Most Productive */}
      <motion.div variants={itemVariants} className="bg-black/40 border border-yellow-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.1),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500/10 blur-3xl rounded-full" />
        
        <div className="flex items-center gap-3 mb-4 sm:mb-6 relative z-10">
          <div className="p-2 sm:p-2.5 bg-yellow-500/20 rounded-xl border border-yellow-500/50 text-yellow-400">
            <Crown size={18} />
          </div>
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Peak Performance</h3>
        </div>

        <div className="relative z-10 flex flex-col h-[calc(100%-4rem)] justify-center">
          <div className="text-center mb-6">
            <div className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Most Productive Day</div>
            <div className="text-4xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
              {mostProductiveDay.day}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/5 border border-yellow-500/20 rounded-xl p-3">
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={12} className="text-yellow-400" /> Average Quests
              </span>
              <span className="text-white font-black">{mostProductiveDay.avgQuests}</span>
            </div>
            <div className="flex items-center justify-between bg-white/5 border border-yellow-500/20 rounded-xl p-3">
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Crown size={12} className="text-yellow-400" /> Prime Time
              </span>
              <span className="text-white font-black text-xs truncate max-w-[150px]">{mostProductiveDay.bestTime}</span>
            </div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
