"use client";

import { Bell, Search, Hexagon, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { useEffect, useMemo, useRef, useState } from "react";

type QuestItem = {
  id: string;
  completed: boolean;
  title: string;
};

type HistoryLog = {
  id: string;
  createdAt: string;
  xpEarned: number;
};

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  kind: "warning" | "success" | "info";
  href: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggle } = useSidebar();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readMap, setReadMap] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") {
      return {};
    }
    try {
      const raw = localStorage.getItem("dq:notif-read");
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });
  const notifRef = useRef<HTMLDivElement | null>(null);
  
  // Format pathname for HUD display (e.g. "/dashboard" -> "SYS // DASHBOARD")
  const hudPath = pathname ? `SYS // ${pathname.replace('/', '').toUpperCase()}` : "SYS // UNKNOWN";

  useEffect(() => {
    const syncPreferences = () => {
      try {
        const raw = localStorage.getItem("dq:preferences");
        if (!raw) {
          setNotificationsEnabled(true);
          return;
        }
        const parsed = JSON.parse(raw);
        setNotificationsEnabled(parsed?.notif !== false);
      } catch {
        setNotificationsEnabled(true);
      }
    };

    syncPreferences();
    window.addEventListener("storage", syncPreferences);
    window.addEventListener("dq:preferences-updated", syncPreferences);
    return () => {
      window.removeEventListener("storage", syncPreferences);
      window.removeEventListener("dq:preferences-updated", syncPreferences);
    };
  }, []);

  useEffect(() => {
    const savedSearch = localStorage.getItem("dq:global-search");
    if (savedSearch) {
      setSearchTerm(savedSearch);
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!notifRef.current) return;
      if (!notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const emitSearch = (value: string) => {
    setSearchTerm(value);
    localStorage.setItem("dq:global-search", value);
    window.dispatchEvent(new CustomEvent("dq:search-updated", { detail: { value } }));
  };

  useEffect(() => {
    if (!notificationsEnabled) return;

    const loadNotifications = async () => {
      try {
        const [questsRes, historyRes] = await Promise.all([
          fetch("/api/quests"),
          fetch("/api/history"),
        ]);

        if (!questsRes.ok || !historyRes.ok) return;

        const quests = (await questsRes.json()) as QuestItem[];
        const history = (await historyRes.json()) as HistoryLog[];
        const now = new Date();
        const todayKey = now.toISOString().slice(0, 10);
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const incompleteCount = quests.filter((quest) => !quest.completed).length;
        const todayLogs = history.filter((log) => new Date(log.createdAt) >= startOfToday);
        const xpToday = todayLogs.reduce((sum, log) => sum + (log.xpEarned || 0), 0);

        const generated: NotificationItem[] = [];
        if (incompleteCount > 0) {
          generated.push({
            id: `pending-${todayKey}`,
            title: "Daily Reminder",
            description: `Kamu masih punya ${incompleteCount} quest aktif hari ini.`,
            createdAt: now.toISOString(),
            kind: "warning",
            href: "/quest",
          });
        }

        if (todayLogs.length === 0 && now.getHours() >= 18) {
          generated.push({
            id: `streak-warning-${todayKey}`,
            title: "Streak Alert",
            description: "Belum ada quest selesai hari ini. Selesaikan 1 quest agar streak aman.",
            createdAt: now.toISOString(),
            kind: "warning",
            href: "/quest",
          });
        }

        if (todayLogs.length > 0) {
          generated.push({
            id: `progress-${todayKey}`,
            title: "Progress Hari Ini",
            description: `${todayLogs.length} quest selesai, +${xpToday} XP didapat hari ini.`,
            createdAt: now.toISOString(),
            kind: "success",
            href: "/history",
          });
        }

        generated.push({
          id: `tips-${todayKey}`,
          title: "Tip of the Day",
          description: "Fokus 1 quest sulit lebih dulu untuk progress yang konsisten.",
          createdAt: now.toISOString(),
          kind: "info",
          href: "/dashboard",
        });

        setNotifications(generated);
      } catch {
        // Ignore temporary notification fetch errors.
      }
    };

    loadNotifications();
    const interval = window.setInterval(loadNotifications, 60_000);
    return () => window.clearInterval(interval);
  }, [notificationsEnabled]);

  const unreadCount = useMemo(() => {
    if (!notificationsEnabled) return 0;
    return notifications.filter((item) => !readMap[item.id]).length;
  }, [notifications, notificationsEnabled, readMap]);

  const visibleNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((item) => !readMap[item.id]);
    }
    return notifications;
  }, [activeFilter, notifications, readMap]);

  const persistReadMap = (next: Record<string, boolean>) => {
    setReadMap(next);
    try {
      localStorage.setItem("dq:notif-read", JSON.stringify(next));
    } catch {
      // Ignore storage write failures.
    }
  };

  const markOneAsRead = (id: string) => {
    const next = { ...readMap, [id]: true };
    persistReadMap(next);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markOneAsRead(item.id);
    setIsNotifOpen(false);
    if (item.href && item.href !== pathname) {
      router.push(item.href);
    }
  };

  const markAllAsRead = () => {
    const next = { ...readMap };
    notifications.forEach((item) => {
      next[item.id] = true;
    });
    persistReadMap(next);
  };

  const kindClass = (kind: NotificationItem["kind"]) => {
    if (kind === "warning") {
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }
    if (kind === "success") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }
    return "border-blue-500/30 bg-blue-500/10 text-blue-300";
  };

  const getRelativeTime = (createdAt: string) => {
    const now = Date.now();
    const time = new Date(createdAt).getTime();
    const diffMs = Math.max(0, now - time);
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  };

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center gap-4">
        {/* Burger Menu for Mobile */}
        <button
          onClick={toggle}
          className="p-2 text-zinc-400 hover:text-white md:hidden bg-white/5 rounded-lg border border-white/10"
        >
          <Menu size={20} />
        </button>

        {/* HUD Path Indicator */}
        <div className="hidden sm:flex items-center gap-3">
          <Hexagon className="text-purple-500/50" size={16} />
          <span className="text-purple-400/50 font-black text-xs uppercase tracking-[0.2em]">
            {hudPath}
          </span>
        </div>

        <div className="flex-1 sm:hidden">
          {/* Mobile Spacer / Path */}
          <span className="text-purple-400/50 font-black text-[10px] uppercase tracking-widest truncate max-w-[150px] inline-block">
            {hudPath}
          </span>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/quest")}
          className="hidden lg:inline-flex px-3 py-1.5 rounded-full border border-blue-500/40 bg-blue-500/15 text-blue-200 text-[10px] font-black uppercase tracking-wider hover:bg-blue-500/25"
        >
          + Quest
        </button>

        {/* Quick Search */}
        <div className="hidden md:flex relative group cursor-text">
          <div className="absolute inset-0 bg-white/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-black/50 border border-white/10 rounded-full px-4 py-2 hover:border-white/20 transition-colors">
            <Search size={14} className="text-zinc-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search quests..." 
              value={searchTerm}
              onChange={(event) => emitSearch(event.target.value)}
              className="bg-transparent text-xs font-bold uppercase tracking-wider text-white placeholder-zinc-600 focus:outline-none w-32 focus:w-48 transition-all"
            />
          </div>
        </div>

        {/* Level Indicator (Mini) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full">
          <span className="text-purple-400 font-black text-[10px] uppercase tracking-widest">LVL</span>
          <span className="text-white font-black text-sm">3</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            {notificationsEnabled && unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 border-2 border-black rounded-full text-[10px] font-black text-white flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
            <Bell size={18} />
          </motion.button>

          {isNotifOpen && notificationsEnabled && (
            <div className="absolute right-0 mt-3 w-[340px] max-h-[420px] overflow-y-auto themed-scrollbar rounded-2xl border border-white/10 bg-[#09090f]/95 backdrop-blur-xl shadow-2xl p-4 z-[90]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold uppercase tracking-wider text-purple-300 hover:text-purple-200"
                  >
                    Mark all read
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    activeFilter === "all"
                      ? "border-purple-500/40 bg-purple-500/20 text-purple-200"
                      : "border-white/10 bg-black/30 text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter("unread")}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    activeFilter === "unread"
                      ? "border-purple-500/40 bg-purple-500/20 text-purple-200"
                      : "border-white/10 bg-black/30 text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  Unread
                </button>
              </div>

              <div className="space-y-2">
                {visibleNotifications.length === 0 && (
                  <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-4 text-center text-xs text-zinc-500">
                    No notifications yet.
                  </div>
                )}

                {visibleNotifications.map((item) => {
                  const isRead = !!readMap[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`w-full text-left rounded-xl border px-3 py-3 transition-all ${kindClass(item.kind)} ${isRead ? "opacity-50" : "opacity-100"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold uppercase tracking-wide">{item.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-white/80">
                            {getRelativeTime(item.createdAt)}
                          </span>
                          {!isRead && <span className="w-2 h-2 rounded-full bg-white/90" />}
                        </div>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}