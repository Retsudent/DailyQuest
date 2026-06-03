"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbarin";
import StatsOverview from "@/components/statistics/StatsOverview";
import ActivityChart from "@/components/statistics/ActivityChart";
import LineChartStats from "@/components/statistics/LineChartStats";
import CalendarHeatmap from "@/components/statistics/CalendarHeatmap";
import QuestAnalysis from "@/components/statistics/QuestAnalysis";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function StatisticsPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/statistics");
        if (res.ok) {
          const data = await res.json();
          setStatsData(data);
        } else {
          console.error("Failed to fetch statistics:", res.status);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <main className="h-screen bg-[#0a0a0f] flex overflow-hidden selection:bg-purple-500/30">
      <Sidebar />

      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Background Ambient Glow — matching dashboard */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-800/5 rounded-full blur-[100px] pointer-events-none" />

        <Navbar />

        <div className="flex-1 overflow-y-auto p-4 pb-28 md:p-8 z-10 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto pb-12"
          >
            {/* Header — matches dashboard style */}
            <div className="mb-8 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-white/20">
                  <BarChart3 size={22} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
                    Player Analytics
                  </h1>
                  <p className="text-purple-400/70 font-bold mt-1 tracking-widest uppercase text-[10px] md:text-xs">
                    Monitor your metrics &amp; growth
                  </p>
                </div>
              </div>
            </div>

            {/* 1. High-Level Overview */}
            <StatsOverview data={statsData?.overview} loading={loading} />

            {/* 2. Quest Insights (Analysis) */}
            <QuestAnalysis data={statsData?.insights} loading={loading} />

            {/* 3. Charts Grid (Line & Bar) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <LineChartStats data={statsData?.charts?.exp} loading={loading} />
              <ActivityChart data={statsData?.charts?.missions} loading={loading} />
            </div>

            {/* 4. Consistency Heatmap */}
            <CalendarHeatmap data={statsData?.heatmap} loading={loading} />

          </motion.div>
        </div>
      </div>
    </main>
  );
}
