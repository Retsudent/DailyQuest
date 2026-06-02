import { useState, useEffect } from "react";
import QuestCard from "./QuestCard";
import QuestDetailModal from "./QuestDetailModal";
import { motion } from "framer-motion";
import { notify } from "@/lib/ui/toast";

interface Quest {
  id: string;
  title: string;
  type: string;
  xp: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  completed: boolean;
  description?: string;
}

type QuestFilter = "all" | "daily" | "side" | "epic" | "cleared";

interface QuestListProps {
  search: string;
  filter: QuestFilter;
  reloadToken?: number;
}

export default function QuestList({ search, filter, reloadToken = 0 }: QuestListProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuests = async () => {
    try {
      const res = await fetch("/api/quests");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Fetch quests failed:", res.status, errorData.error || "Unknown Error");
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        const ordered = [...data].sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return b.xp - a.xp;
        });
        setQuests(ordered);
      }
    } catch (error) {
      console.error("Failed to fetch quests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [reloadToken]);

  const handleComplete = async (id: string) => {
    console.log("Attempting to complete quest:", id);
    try {
      const res = await fetch(`/api/quests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      if (res.ok) {
        notify("Quest selesai. XP kamu bertambah!", "success");
        fetchQuests(); // Refresh
      } else {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to complete quest:", res.status, err.error);
        notify(err.error || "Gagal menyelesaikan quest", "error");
      }
    } catch (error) {
      console.error("Failed to complete quest:", error);
      notify("Terjadi error saat menyelesaikan quest", "error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredQuests = quests.filter((quest) => {
    const searchMatched =
      normalizedSearch.length === 0 ||
      quest.title.toLowerCase().includes(normalizedSearch) ||
      quest.type.toLowerCase().includes(normalizedSearch);

    if (!searchMatched) return false;

    if (filter === "all") return true;
    if (filter === "daily") return quest.type.toLowerCase().includes("daily");
    if (filter === "side") return quest.type.toLowerCase().includes("side");
    if (filter === "epic") return quest.rarity === "epic" || quest.rarity === "legendary";
    if (filter === "cleared") return quest.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
      >
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            id={quest.id}
            title={quest.title}
            type={quest.type}
            xp={quest.xp}
            rarity={quest.rarity}
            completed={quest.completed}
            onClick={() => setSelectedQuest(quest)}
            onComplete={handleComplete}
          />
        ))}
      </motion.div>

      {filteredQuests.length === 0 && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-8 text-center">
          <h3 className="text-white font-black text-lg">Belum ada quest yang cocok</h3>
          <p className="text-zinc-300 mt-2 text-sm">
            Coba ubah filter atau buat quest baru untuk mulai progress.
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event("dq:open-add-quest"))}
            className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black uppercase tracking-wider"
          >
            + Forge Quest
          </button>
        </div>
      )}

      <QuestDetailModal 
        isOpen={!!selectedQuest}
        onClose={() => setSelectedQuest(null)}
        quest={selectedQuest as any}
      />
    </>
  );
}
