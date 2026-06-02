"use client";

import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbarin";
import HistoryTimeline from "@/components/history/HistoryTimeline";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  return (
    <main className="h-screen bg-[#0a0a0f] flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        <Navbar />

        <div className="themed-scrollbar flex-1 overflow-y-auto p-6 md:p-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="mb-12 border-b border-white/10 pb-6 text-center sm:text-left">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase flex items-center justify-center sm:justify-start gap-4">
                <BookOpen className="text-purple-500" size={40} />
                Quest History
              </h1>
              <p className="text-purple-400/70 font-medium mt-2 tracking-wide uppercase text-sm">
                Review past glories and accumulated experience
              </p>
            </div>

            <HistoryTimeline />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
