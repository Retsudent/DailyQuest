import { motion } from "framer-motion";

interface HistoryItemProps {
  title: string;
  type: string;
  xp: number;
  date: string;
  time: string;
  icon: string;
  iconBg: string;
  isLast?: boolean;
}

export default function HistoryItem({ title, type, xp, date, time, icon, iconBg, isLast }: HistoryItemProps) {
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={itemVariants} className="relative pl-10 sm:pl-40 py-6 group">
      {/* Skill Tree Branch Line */}
      {!isLast && (
        <div className="absolute left-5 sm:left-[8.5rem] top-12 bottom-[-1.5rem] w-1 bg-gradient-to-b from-purple-500/50 to-blue-500/10 rounded-full" />
      )}
      
      {/* Date/Time (Desktop) */}
      <div className="hidden sm:flex flex-col absolute left-0 top-1/2 -translate-y-1/2 w-28 text-right pr-6">
        <div className="text-purple-300 font-black uppercase tracking-wider text-sm">{date}</div>
        <div className="text-purple-500/70 font-bold text-xs mt-1">{time}</div>
      </div>

      {/* Skill Tree Node */}
      <div className="absolute left-[0.85rem] sm:left-[8.1rem] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] group-hover:scale-125 group-hover:border-white transition-all duration-300 z-10" />

      {/* Content Card */}
      <motion.div 
        whileHover={{ scale: 1.02, x: 5 }}
        className="relative bg-black/60 border border-purple-500/30 hover:border-purple-400 backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 shadow-lg overflow-hidden cursor-default"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="sm:hidden flex items-center justify-between mb-4 pb-4 border-b border-purple-500/20">
          <span className="text-purple-300 font-black uppercase text-xs">{date}</span>
          <span className="text-purple-500/70 font-bold text-xs">{time}</span>
        </div>
        
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center text-3xl shrink-0 shadow-inner border border-white/10`}>
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-white drop-shadow-md">{title}</h3>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mt-1">{type}</p>
            </div>
          </div>
          
          <div className="text-right shrink-0 relative">
            <motion.div 
              initial={{ y: 0, opacity: 0.5 }}
              whileHover={{ y: -10, opacity: 1 }}
              className="text-yellow-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            >
              +{xp}
            </motion.div>
            <div className="text-yellow-600/70 text-[10px] uppercase font-black tracking-widest mt-0.5">EXP</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
