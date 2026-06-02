import { Trophy, Target, Flame, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

interface StatsOverviewProps {
  data?: {
    totalExp: number;
    missionsCleared: number;
    highestStreak: number;
    activeDays: number;
    expThisWeek: number;
    missionsThisWeek: number;
    streak: number;
    rank: string;
  };
  loading?: boolean;
}

export default function StatsOverview({ data, loading }: StatsOverviewProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative bg-black/40 border border-white/5 rounded-xl sm:rounded-3xl p-3 sm:p-6 overflow-hidden animate-pulse shadow-md backdrop-blur-xl"
          >
            <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-white/5 mb-3 sm:mb-6" />
            <div className="h-2.5 sm:h-3 bg-white/10 rounded w-20 mb-2" />
            <div className="h-6 sm:h-8 bg-white/15 rounded w-16 mb-2" />
            <div className="h-4 bg-white/5 rounded w-24 mt-2 sm:mt-4" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total EXP Earned",
      value: data.totalExp.toLocaleString(),
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-400/15",
      border: "border-yellow-400/30",
      glow: "shadow-[0_0_20px_rgba(250,204,21,0.2)]",
      trend: `+${data.expThisWeek.toLocaleString()} this week`,
    },
    {
      title: "Missions Cleared",
      value: data.missionsCleared.toString(),
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-500/15",
      border: "border-purple-500/30",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
      trend: `+${data.missionsThisWeek} this week`,
    },
    {
      title: "Highest Streak",
      value: data.highestStreak.toString(),
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/15",
      border: "border-orange-500/30",
      glow: "shadow-[0_0_20px_rgba(249,115,22,0.2)]",
      trend: `Current: ${data.streak} days`,
    },
    {
      title: "Active Days",
      value: data.activeDays.toString(),
      icon: CalendarDays,
      color: "text-blue-400",
      bg: "bg-blue-500/15",
      border: "border-blue-500/30",
      glow: "shadow-[0_0_20px_rgba(96,165,250,0.2)]",
      trend: data.rank,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`relative bg-black/40 border ${stat.border} rounded-xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-xl group overflow-hidden transition-all duration-300 ${stat.glow}`}
        >
          {/* Corner ambient glow */}
          <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-2xl -mr-8 -mt-8 opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Scanline texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50" />

          <div className="relative z-10">
            <div className={`w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl ${stat.bg} flex items-center justify-center mb-3 sm:mb-6 shadow-inner border border-white/10`}>
              <stat.icon className={`${stat.color} sm:w-6 sm:h-6 w-4 h-4`} />
            </div>

            <h3 className="text-zinc-400 text-[9px] sm:text-xs font-bold uppercase tracking-wider truncate">
              {stat.title}
            </h3>
            <div className="flex items-end gap-1.5 mt-1">
              <div className="text-lg sm:text-4xl font-black text-white drop-shadow-md">{stat.value}</div>
              {stat.title === "Highest Streak" && (
                <span className="text-zinc-500 font-bold text-[8px] sm:text-xs mb-0.5">DAYS</span>
              )}
            </div>

            <div className={`inline-block mt-2 sm:mt-4 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${stat.border} ${stat.color} bg-white/5`}>
              {stat.trend}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
