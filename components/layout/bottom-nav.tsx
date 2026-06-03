"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScrollText, BookOpen, BarChart3, Settings } from "lucide-react";
import { motion } from "framer-motion";

const menus = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Quests", href: "/quest", icon: ScrollText },
  { name: "History", href: "/history", icon: BookOpen },
  { name: "Stats", href: "/statistics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-black/80 backdrop-blur-2xl border-t border-white/10 pb-safe">
      <nav className="flex items-center justify-around px-2 py-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = pathname === menu.href;

          return (
            <Link key={menu.name} href={menu.href} className="flex-1 flex flex-col items-center justify-center p-2">
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? "text-purple-400" : "text-zinc-500"}`}>
                {isActive && (
                  <motion.div 
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 bg-purple-500/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={22} className="relative z-10" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider mt-1 ${isActive ? "text-purple-400" : "text-zinc-500"}`}>
                {menu.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
