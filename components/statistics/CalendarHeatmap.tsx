import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface CalendarHeatmapProps {
  data?: Array<{ date: string; count: number }>;
  loading?: boolean;
}

export default function CalendarHeatmap({ data, loading }: CalendarHeatmapProps) {
  const [mounted, setMounted] = useState(false);
  const daysCount = 84;

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderedData = useMemo(() => {
    if (!mounted || loading || !data) {
      return Array.from({ length: daysCount }).map(() => ({ count: 0, date: "" }));
    }
    return data;
  }, [mounted, loading, data]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-white/5 border-white/5";
    if (count <= 2) return "bg-emerald-900/50 border-emerald-800/50";
    if (count <= 4) return "bg-emerald-600/60 border-emerald-500/50";
    if (count <= 6) return "bg-emerald-400 border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]";
    return "bg-emerald-300 border-emerald-200 shadow-[0_0_15px_rgba(110,231,183,0.8)]"; // Max intensity
  };

  const weeks = [];
  for (let i = 0; i < renderedData.length; i += 7) {
    weeks.push(renderedData.slice(i, i + 7));
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.01 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/50 text-emerald-400">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">Activity Heatmap</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-1">Last 12 weeks of consistency</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5" />
          <div className="w-3 h-3 rounded-sm bg-emerald-900/50 border border-emerald-800/50" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600/60 border border-emerald-500/50" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300" />
          <div className="w-3 h-3 rounded-sm bg-emerald-300 border border-emerald-200" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative z-10 overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[700px]">
          <div className="flex gap-2 mb-2 ml-8">
            <span className="flex-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">3 Months Ago</span>
            <span className="flex-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-center">2 Months Ago</span>
            <span className="flex-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-right">This Month</span>
          </div>

          <div className="flex gap-2">
            {/* Day Labels */}
            <div className="flex flex-col justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest py-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>

            {/* Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={mounted ? "show" : "hidden"}
              className="flex gap-1.5 sm:gap-2 flex-1"
            >
              {mounted && weeks.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-1.5 sm:gap-2">
                  {week.map((day, dIndex) => (
                    <motion.div
                      key={dIndex}
                      variants={itemVariants}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm border relative group cursor-pointer transition-colors duration-300 ${getColor(day.count)}`}
                    >
                      {/* Tooltip */}
                      {day.date && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] text-emerald-400 font-black text-xs py-1.5 px-3 rounded-lg pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 w-max z-50">
                          {day.count} quests on {day.date}
                          {/* Little triangle arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-emerald-500/50" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
