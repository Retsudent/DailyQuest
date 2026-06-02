import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export interface HistoryQuestItemProps {
  id: number | string;
  title: string;
  type: string;
  xp: number;
  time: string;
  icon: string;
  iconBg: string;
  status: "completed" | "failed";
}

export default function HistoryQuestItem({ title, type, xp, time, icon, iconBg, status }: HistoryQuestItemProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={itemVariants} className="relative group">
      {/* Content Card */}
      <div 
        className="relative bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-2xl shrink-0 shadow-inner border border-white/10`}>
            {icon}
          </div>
          <div>
            <h4 className="text-lg font-black text-white drop-shadow-md flex items-center gap-2">
              {title}
              {status === "completed" ? (
                <CheckCircle2 className="text-green-500 w-4 h-4" />
              ) : (
                <XCircle className="text-red-500 w-4 h-4" />
              )}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{type}</span>
              <span className="text-zinc-600 text-xs">•</span>
              <span className="text-purple-400/80 text-xs font-bold">{time}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right shrink-0 flex items-center justify-between sm:block">
          <div className="sm:hidden text-xs font-bold uppercase tracking-wider text-zinc-500">EXP</div>
          <div className={`font-black text-xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] ${status === "completed" ? 'text-yellow-400' : 'text-zinc-500'}`}>
            {status === "completed" ? `+${xp}` : `0`}
          </div>
          <div className="hidden sm:block text-yellow-600/70 text-[10px] uppercase font-black tracking-widest mt-0.5 text-right">EXP</div>
        </div>
      </div>
    </motion.div>
  );
}
