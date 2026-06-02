import { CheckCircle2, Swords, Shield, Zap, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface QuestCardProps {
  id: string;
  title: string;
  type: string;
  xp: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  completed?: boolean;
  onClick?: () => void;
  onComplete?: (id: string) => void;
}

const rarityConfig = {
  common: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30", glow: "shadow-slate-500/20", icon: Swords },
  rare: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/50", glow: "shadow-blue-500/40", icon: Shield },
  epic: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/50", glow: "shadow-purple-500/50", icon: Zap },
  legendary: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/60", glow: "shadow-amber-500/60", icon: Star },
};

export default function QuestCard({ id, title, type, xp, rarity, completed, onClick, onComplete }: QuestCardProps) {
  const conf = rarityConfig[rarity] || rarityConfig.common;
  const Icon = conf.icon;

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      onClick={onClick}
      whileHover={!completed ? { y: -8, scale: 1.02 } : {}}
      className={`relative group rounded-xl sm:rounded-2xl border ${completed ? 'border-zinc-800 bg-zinc-900/40' : conf.border + ' bg-black/60'} backdrop-blur-xl p-3 sm:p-5 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between min-h-[120px] sm:min-h-[160px]`}
    >
      {/* Rarity Background Glow */}
      {!completed && (
        <>
          <div className={`absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 ${conf.bg} blur-2xl -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 opacity-50 pointer-events-none`} />
        </>
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className={`w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${completed ? 'bg-zinc-800 text-zinc-600' : conf.bg + ' ' + conf.text} shadow-inner`}>
          <Icon size={14} />
        </div>
        
        <span className={`text-[6px] sm:text-[10px] uppercase tracking-widest font-black px-1 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg border ${completed ? 'border-zinc-800 text-zinc-600' : conf.border + ' ' + conf.text} whitespace-nowrap`}>
          {rarity}
        </span>
      </div>

      <div className="mt-2 sm:mt-4 relative z-10">
        <h3 className={`text-[10px] sm:text-lg font-black leading-tight mb-0.5 sm:mb-1 ${completed ? 'text-zinc-600 line-through' : 'text-white drop-shadow-md'} break-words px-0.5`}>
          {title}
        </h3>
        <p className="text-zinc-500 text-[8px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-3 px-0.5">{type}</p>
        
        <div className="flex items-center justify-between mt-auto gap-1">
          <div className={`inline-flex items-center gap-1 px-1 py-0.5 sm:px-2 sm:py-1 rounded-md text-[8px] sm:text-xs font-bold ${completed ? 'bg-zinc-800 text-zinc-500' : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'}`}>
            <Star size={8} className={!completed ? 'animate-pulse' : ''} /> +{xp}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              aria-label="View quest details"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 text-zinc-300 hover:text-blue-300 flex items-center justify-center transition-all shadow-lg shrink-0"
            >
              <Eye size={14} />
            </button>
            
            {!completed ? (
              <button
                aria-label="Mark quest as complete"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete?.(id);
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-300 flex items-center justify-center transition-all shadow-lg shrink-0"
              >
                <CheckCircle2 size={14} />
              </button>
            ) : (
              <span className="text-[7px] sm:text-[10px] font-bold text-zinc-600 uppercase tracking-widest shrink-0">V</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Pushable button effect bottom border */}
      {!completed && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
    </motion.div>
  );
}
