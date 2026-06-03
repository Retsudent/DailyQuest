"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScrollText,
  BarChart3,
  Settings,
  BookOpen,
  Sword,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import BottomNav from "./bottom-nav";

const menus = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Quests", href: "/quest", icon: ScrollText },
  { name: "History", href: "/history", icon: BookOpen },
  { name: "Statistics", href: "/statistics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];


export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const syncAvatar = () => {
      const savedAvatar = localStorage.getItem("dq:avatar");
      setAvatarPreview(savedAvatar || null);
    };

    syncAvatar();
    window.addEventListener("dq:avatar-updated", syncAvatar);
    window.addEventListener("storage", syncAvatar);

    return () => {
      window.removeEventListener("dq:avatar-updated", syncAvatar);
      window.removeEventListener("storage", syncAvatar);
    };
  }, []);

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  };

  return (
    <>

      <motion.aside
        initial={false}
        animate="open"
        variants={sidebarVariants}
        className="hidden md:flex fixed inset-y-0 left-0 z-[70] flex-col w-72 bg-[#050508] border-r border-white/5 p-6 md:relative md:translate-x-0 transition-none"
      >

        {/* Decorative side border glow */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent opacity-50" />
        
        {/* Logo Area */}
        <div className="mb-12 relative group cursor-pointer">
          <div className="absolute -inset-2 bg-purple-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-500 flex items-center gap-3 tracking-tighter">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-white/20">
              <Sword size={24} className="-rotate-45" />
            </div>
            DAILY<span className="text-purple-500">QUEST</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.href;

            return (
              <Link key={menu.name} href={menu.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                    isActive 
                    ? "bg-purple-500/10 border-purple-500/30 text-white shadow-[inset_4px_0_0_rgb(168,85,247)]" 
                    : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  } border`}
                >
                  {/* Active Glow Background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent pointer-events-none" />
                  )}

                  <Icon 
                    size={20} 
                    className={`relative z-10 transition-colors ${isActive ? "text-purple-400" : "group-hover:text-purple-400/70"}`} 
                  />
                  <span className={`relative z-10 font-bold tracking-widest text-xs uppercase ${isActive ? "text-white" : ""}`}>
                    {menu.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="mb-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-purple-500/50 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : session?.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {session?.user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold truncate max-w-[110px]">
                  {session?.user?.name || "Player One"}
                </span>
                <span className="text-purple-400/80 text-[10px] uppercase tracking-widest font-bold">
                  LVL 3
                </span>
              </div>
            </div>

            <motion.button
              onClick={() => signOut({ callbackUrl: "/login" })}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 transition-colors shadow-inner"
              title="Disconnect"
            >
              <LogOut size={14} />
            </motion.button>
          </div>
        </div>

        {/* Bottom version/status */}
        <div className="pt-8 border-t border-white/5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Server Online
          </div>
          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mt-4">v0.1.0-alpha</p>
        </div>
      </motion.aside>
      <BottomNav />
    </>
  );
}