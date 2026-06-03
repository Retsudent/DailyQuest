import { useState, useMemo } from "react";
import { motion } from "framer-motion";

type TimeRange = "Weekly" | "Monthly" | "Yearly";

interface LineChartStatsProps {
  data?: {
    weekly: Array<{ label: string; value: number }>;
    monthly: Array<{ label: string; value: number }>;
    yearly: Array<{ label: string; value: number }>;
  };
  loading?: boolean;
}

export default function LineChartStats({ data, loading }: LineChartStatsProps) {
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
            { label: "Week 1", value: 0 }, { label: "Week 2", value: 0 },
            { label: "Week 3", value: 0 }, { label: "Week 4", value: 0 }
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

  // SVG Chart Calculations
  const width = 800;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 30, left: 20 };
  
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const rawMax = Math.max(...chartData.map(d => d.value));
  const maxValue = rawMax === 0 ? 100 : rawMax * 1.1; // 10% headroom, default 100 if all 0
  
  const points = chartData.map((d, i) => {
    const x = padding.left + (i * (innerWidth / (chartData.length - 1 || 1)));
    const y = padding.top + innerHeight - ((d.value / maxValue) * innerHeight);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => 
    (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)
  ).join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding.bottom} L ${points[0].x},${height - padding.bottom} Z`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col min-h-[360px]"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">EXP Progression</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-1">Experience points over time</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="bg-zinc-900/80 border border-purple-500/30 text-purple-300 font-bold text-sm uppercase tracking-wider rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-inner appearance-none cursor-pointer hover:bg-zinc-800 transition-colors"
        >
          <option value="Weekly">This Week</option>
          <option value="Monthly">This Month</option>
          <option value="Yearly">This Year</option>
        </select>
      </div>

      <div className="relative w-full overflow-x-auto overflow-y-hidden themed-scrollbar pb-4 z-10">
        <div className="min-w-[600px] h-[240px] relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
            </div>
          ) : (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Grid Lines */}
            {[0, 0.5, 1].map((ratio) => {
              const y = padding.top + (innerHeight * ratio);
              return (
                <line 
                  key={ratio}
                  x1={padding.left} 
                  y1={y} 
                  x2={width - padding.right} 
                  y2={y} 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area Fill */}
            <motion.path
              key={`area-${timeRange}`}
              d={areaPath}
              fill="url(#lineGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Line */}
            <motion.path
              key={`line-${timeRange}`}
              d={linePath}
              fill="none"
              stroke="#a855f7"
              strokeWidth="3"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Points & Tooltips */}
            {points.map((p, i) => (
              <g key={`point-${i}`} className="group cursor-pointer">
                {/* Invisible larger hit area for hover */}
                <circle cx={p.x} cy={p.y} r="15" fill="transparent" />
                <motion.circle 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + (i * 0.05) }}
                  cx={p.x} 
                  cy={p.y} 
                  r="4" 
                  fill="#000" 
                  stroke="#a855f7" 
                  strokeWidth="2"
                  className="group-hover:scale-150 group-hover:fill-[#a855f7] transition-all duration-300"
                />
                {/* SVG Tooltip */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <rect 
                    x={p.x - 30} 
                    y={p.y - 45} 
                    width="60" 
                    height="26" 
                    rx="4" 
                    fill="#000" 
                    stroke="#a855f7" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={p.x} 
                    y={p.y - 28} 
                    fill="#fff" 
                    fontSize="12" 
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {p.value}
                  </text>
                </g>
              </g>
            ))}

            {/* X Axis Labels */}
            {points.map((p, i) => (
              <text
                key={`label-${i}`}
                x={p.x}
                y={height - 5}
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                className="uppercase tracking-widest"
              >
                {p.label}
              </text>
            ))}
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  );
}
