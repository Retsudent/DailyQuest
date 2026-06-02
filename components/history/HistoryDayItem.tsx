import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, Target, Award, Skull } from "lucide-react";
import HistoryQuestItem, { HistoryQuestItemProps } from "./HistoryQuestItem";

interface HistoryDayItemProps {
  date: string; // E.g. "May 10, 2026"
  isLast?: boolean;
  quests: HistoryQuestItemProps[];
}

export default function HistoryDayItem({ date, isLast, quests }: HistoryDayItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.status === "completed").length;
  const failedQuests = totalQuests - completedQuests;
  const totalXp = quests.reduce((acc, q) => q.status === "completed" ? acc + q.xp : acc, 0);
  const progressPercent = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={itemVariants} className="relative pl-8 sm:pl-16 py-6 group">
      {/* Timeline Branch Line */}
      {!isLast && (
        <div className="absolute left-[1.125rem] sm:left-[2.125rem] top-12 bottom-[-1.5rem] w-1 bg-gradient-to-b from-purple-500/50 to-purple-500/10 rounded-full" />
      )}

      {/* Timeline Node */}
      <div className="absolute left-[0.5rem] sm:left-[1.5rem] top-[2.2rem] w-6 h-6 rounded-full bg-black border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] group-hover:scale-110 group-hover:border-white transition-all duration-300 z-10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
      </div>

      {/* Day Summary Card */}
      <motion.div 
        className={`relative bg-black/60 border ${isExpanded ? 'border-purple-400' : 'border-purple-500/30'} hover:border-purple-400 backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 shadow-lg overflow-hidden cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.01 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 text-purple-400">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-wide">{date}</h3>
              <div className="flex items-center gap-3 mt-1 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1"><Target size={14} className="text-blue-400" /> {completedQuests}/{totalQuests}</span>
                <span className="flex items-center gap-1"><Skull size={14} className="text-red-400" /> {failedQuests}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <div className="flex-1 sm:w-48">
              <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">
                <span>Progress</span>
                <span className="text-purple-400">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
                />
              </div>
            </div>

            <div className="text-right flex items-center gap-4">
              <div>
                <div className="text-yellow-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                  +{totalXp}
                </div>
                <div className="text-yellow-600/70 text-[10px] uppercase font-black tracking-widest">EXP</div>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 border border-white/10"
              >
                <ChevronDown size={20} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expandable Quest List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="pl-4 sm:pl-8 border-l-2 border-white/5 py-2 flex flex-col gap-3"
            >
              {quests.map((quest, index) => (
                <HistoryQuestItem key={quest.id} {...quest} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
