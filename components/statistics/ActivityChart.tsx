import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TimeRange = "Weekly" | "Monthly" | "Yearly";

interface ActivityChartProps {
  data?: {
    weekly: Array<{ label: string; value: number }>;
    monthly: Array<{ label: string; value: number }>;
    yearly: Array<{ label: string; value: number }>;
  };
  loading?: boolean;
}

export default function ActivityChart({ data, loading }: ActivityChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("Weekly");

  const chartData = useMemo(() => {
    if (!data) {
      switch (timeRange) {
        case "Weekly":
          return [
            { label: "Mon", value: 0 }, { label: "Tue", value: 0 }, { label: "Wed", value: 0 },
            { label: "Thu", value: 0 }, { label: "Fri", value: 0 }, { label: "Sat", value: 0 }, { label: "Sun", value: 0 }
          ];
        case "Monthly":
          return [
            { label: "W1", value: 0 }, { label: "W2", value: 0 },
            { label: "W3", value: 0 }, { label: "W4", value: 0 }
          ];
        case "Yearly":
          return [
            { label: "Jan", value: 0 }, { label: "Feb", value: 0 }, { label: "Mar", value: 0 },
            { label: "Apr", value: 0 }, { label: "May", value: 0 }, { label: "Jun", value: 0 },
            { label: "Jul", value: 0 }, { label: "Aug", value: 0 }, { label: "Sep", value: 0 },
            { label: "Oct", value: 0 }, { label: "Nov", value: 0 }, { label: "Dec", value: 0 }
          ];
      }
    }

    switch (timeRange) {
      case "Weekly":
        return data.weekly;
      case "Monthly":
        return data.monthly;
      case "Yearly":
        return data.yearly;
    }
  }, [timeRange, data]);

  const rawMax = Math.max(...chartData.map(d => d.value));
  const maxValue = rawMax === 0 ? 10 : rawMax * 1.2; // 20% headroom, default to 10 if all 0

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden min-h-[360px]"
    >
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 relative z-10 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">Missions Cleared</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-1">Quests completed over time</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="bg-zinc-900 border border-white/10 text-blue-400 font-bold text-sm uppercase tracking-wider rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner appearance-none cursor-pointer hover:bg-zinc-800 transition-colors"
        >
          <option value="Weekly">This Week</option>
          <option value="Monthly">This Month</option>
          <option value="Yearly">This Year</option>
        </select>
      </div>

      <div className="h-60 sm:h-72 flex items-end justify-between gap-2 sm:gap-4 relative z-10">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {chartData.map((data, i) => {
              const heightPercent = (data.value / maxValue) * 100;
              return (
                <motion.div 
                  key={`${timeRange}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex-1 flex flex-col items-center gap-4 group h-full justify-end"
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)] text-blue-400 font-black text-xs py-1.5 px-3 rounded-lg pointer-events-none transform -translate-y-2 group-hover:-translate-y-4 duration-300 whitespace-nowrap z-20 relative">
                    {data.value} Quests
                  </div>
                  
                  {/* Energy Bar (RPG style segmented) */}
                  <div className="w-full max-w-[2.5rem] relative rounded-t-sm bg-zinc-900/80 border-b-0 border border-white/5 overflow-hidden flex items-end h-[calc(100%-3rem)]">
                    {/* Background horizontal stripes */}
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px]" />
                    
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className="w-full relative bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 group-hover:from-blue-500 group-hover:via-cyan-400 group-hover:to-teal-300 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    >
                      {/* Overlay horizontal stripes to make it look like a battery/energy meter */}
                      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.2)_1px,transparent_1px)] bg-[size:100%_8px]" />
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white/50 blur-[1px]" />
                    </motion.div>
                  </div>
                  
                  {/* X Axis Label */}
                  <span className="text-zinc-500 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest truncate w-full text-center">
                    {data.label}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
