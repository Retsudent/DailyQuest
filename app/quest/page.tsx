"use client";

import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbarin";
import QuestFilters from "@/components/quest/QuestFilters";
import QuestList from "@/components/quest/QuestList";
import AddQuestModal from "@/components/quest/AddQuestModal";
import { Sword } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type QuestFilter = "all" | "daily" | "side" | "epic" | "cleared";

export default function QuestsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<QuestFilter>("all");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const savedSearch = localStorage.getItem("dq:global-search");
    const savedFilter = localStorage.getItem("dq:quest-filter") as QuestFilter | null;
    if (savedSearch) setSearch(savedSearch);
    if (savedFilter) setFilter(savedFilter);

    const onSearchUpdate = (event: Event) => {
      const custom = event as CustomEvent<{ value: string }>;
      setSearch(custom.detail?.value || "");
    };
    const onOpenAdd = () => setIsModalOpen(true);

    window.addEventListener("dq:search-updated", onSearchUpdate as EventListener);
    window.addEventListener("dq:open-add-quest", onOpenAdd);
    return () => {
      window.removeEventListener("dq:search-updated", onSearchUpdate as EventListener);
      window.removeEventListener("dq:open-add-quest", onOpenAdd);
    };
  }, []);

  const handleFilterChange = (nextFilter: QuestFilter) => {
    setFilter(nextFilter);
    localStorage.setItem("dq:quest-filter", nextFilter);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    localStorage.setItem("dq:global-search", value);
    window.dispatchEvent(new CustomEvent("dq:search-updated", { detail: { value } }));
  };

  return (
    <>
      <main className="h-screen bg-[#0a0a0f] flex overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col relative min-w-0">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
          <Navbar />

          <div className="themed-scrollbar flex-1 overflow-y-auto p-4 md:p-8 z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
                <div>
                  <h1 className="text-xl sm:text-4xl md:text-5xl font-black text-white tracking-normal sm:tracking-tighter uppercase flex items-center gap-3 flex-wrap">
                    <Sword className="text-blue-500 shrink-0" size={24} />
                    <span className="leading-tight">Quest Log</span>
                  </h1>
                  <p className="text-blue-400/70 font-medium mt-2 tracking-wide uppercase text-[10px] sm:text-xs md:text-sm">
                    Active missions & side objectives
                  </p>
                </div>
                <motion.button 
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/50 w-fit self-start sm:w-auto md:self-auto"
                >
                  + Forge
                </motion.button>
              </div>

              <QuestFilters
                value={search}
                onSearchChange={handleSearchChange}
                filter={filter}
                onFilterChange={handleFilterChange}
              />
              <QuestList search={search} filter={filter} reloadToken={reloadToken} />
            </motion.div>
          </div>
        </div>
      </main>
      <AddQuestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          setIsModalOpen(false);
          setReloadToken((prev) => prev + 1);
        }}
      />
    </>
  );
}
