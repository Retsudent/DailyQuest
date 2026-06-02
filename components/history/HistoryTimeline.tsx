import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import HistoryDayItem from "./HistoryDayItem";
import { HistoryQuestItemProps } from "./HistoryQuestItem";

const rarityMap: Record<string, { icon: string; bg: string }> = {
  common: { icon: "⚔️", bg: "bg-slate-500/20 text-slate-400" },
  rare: { icon: "🛡️", bg: "bg-blue-500/20 text-blue-400" },
  epic: { icon: "⚡", bg: "bg-purple-500/20 text-purple-400" },
  legendary: { icon: "🌟", bg: "bg-amber-500/20 text-amber-400" },
};

export default function HistoryTimeline() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        if (!res.ok) {
          console.error("Fetch history failed:", res.status);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Process data: map -> filter -> group by date -> paginate
  const processedData = useMemo(() => {
    // 1. Map API logs to component props
    const mappedQuests = logs.map(log => {
      const r = rarityMap[log.quest.rarity] || rarityMap.common;
      const date = new Date(log.createdAt);
      return {
        id: log.id,
        title: log.quest.title,
        type: log.quest.type,
        xp: log.xpEarned,
        time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        icon: r.icon,
        iconBg: r.bg,
        status: log.status,
        date: date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      };
    });

    // 2. Filter
    const filtered = mappedQuests.filter(quest => {
      const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            quest.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = dateFilter ? quest.date === dateFilter : true;
      return matchesSearch && matchesDate;
    });

    // 3. Group by date
    const grouped = filtered.reduce((acc, quest) => {
      if (!acc[quest.date]) {
        acc[quest.date] = [];
      }
      acc[quest.date].push(quest);
      return acc;
    }, {} as Record<string, any[]>);

    // Convert to array and sort by date descending
    const groupedArray = Object.entries(grouped).map(([date, quests]) => ({
      date,
      quests
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 4. Paginate
    const totalPages = Math.ceil(groupedArray.length / itemsPerPage);
    const paginated = groupedArray.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return { paginated, totalPages, totalItems: groupedArray.length, rawMapped: mappedQuests };
  }, [logs, searchQuery, dateFilter, currentPage]);

  const { paginated: currentDays, totalPages, totalItems, rawMapped } = processedData;

  // Reset page when filters change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic date formatter from YYYY-MM-DD input to "May 10, 2026" style for matching mock.
    // In a real app with ISO strings, this would be robust. For now:
    const val = e.target.value;
    if (!val) {
      setDateFilter("");
    } else {
      const d = new Date(val);
      const formatted = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      // e.g. "May 10, 2026"
      setDateFilter(formatted);
    }
    setCurrentPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header Stats & Filters */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-10 p-6 sm:p-8 rounded-3xl bg-black/40 border-2 border-purple-500/30 backdrop-blur-xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/50">
              <Scroll className="text-purple-400" size={28} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Chronicles of the Week</h2>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-purple-500/30 rounded-xl bg-black/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="Search quests..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            {/* The actual date input is hidden but triggerable, or we use a text input. Using native date input */}
            <input
              type="date"
              className="block w-full pl-10 pr-3 py-3 border border-purple-500/30 rounded-xl bg-black/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm color-scheme-dark"
              style={{ colorScheme: "dark" }}
              onChange={handleDateFilter}
            />
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 mt-6 relative z-10 border-t border-white/10 pt-6">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Missions Cleared</div>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              {rawMapped.filter(q => q.status === "completed").length}
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-yellow-500/20 blur-xl rounded-full" />
            <div className="text-yellow-600/80 text-xs font-bold uppercase tracking-wider">Total EXP Gained</div>
            <div className="text-3xl sm:text-4xl font-black text-yellow-400 mt-1 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
              {rawMapped.reduce((acc, q) => q.status === "completed" ? acc + q.xp : acc, 0)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline List */}
      <div className="relative min-h-[400px]">
        {currentDays.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`page-${currentPage}-${searchQuery}-${dateFilter}`} // Force re-animation on filter/page change
            className="relative"
          >
            {currentDays.map((day, index) => (
              <HistoryDayItem 
                key={day.date} 
                date={day.date}
                quests={day.quests}
                isLast={index === currentDays.length - 1 && currentPage === totalPages}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Scroll className="text-white/20" size={32} />
            </div>
            <h3 className="text-xl font-black text-white">No Chronicles Found</h3>
            <p className="text-zinc-500 mt-2">No quests match your current filters.</p>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 flex items-center justify-between border-t border-white/10 pt-6 px-4"
        >
          <div className="text-sm text-zinc-500 font-bold uppercase tracking-wider hidden sm:block">
            Showing Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 border border-white/10 rounded-xl text-white font-bold transition-all"
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:hover:bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-400 font-bold transition-all"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
