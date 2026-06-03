"use client";

import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbarin";
import ProfileSettings from "@/components/settings/ProfileSettings";
import PreferencesForm from "@/components/settings/PreferencesForm";
import { SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <main className="h-screen bg-[#0a0a0f] flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        <Navbar />

        <div className="themed-scrollbar flex-1 overflow-y-auto p-6 pb-28 md:p-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="mb-10 border-b border-white/10 pb-6">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase flex items-center gap-4">
                <SlidersHorizontal className="text-zinc-400" size={40} />
                System Settings
              </h1>
              <p className="text-zinc-300 font-medium mt-2 tracking-wide uppercase text-sm">
                Configure your interface and player identity
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-2/3">
                <ProfileSettings />
              </div>
              <div className="w-full lg:w-1/3">
                <PreferencesForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
