"use client";

import { useEffect, useState } from "react";
import { Bell, Moon, Volume2, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PreferencesForm() {
  const [prefs, setPrefs] = useState({
    notif: true,
    dark: true,
    sound: false,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dq:preferences");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPrefs((prev) => ({
          notif: typeof parsed.notif === "boolean" ? parsed.notif : prev.notif,
          dark: typeof parsed.dark === "boolean" ? parsed.dark : prev.dark,
          sound: typeof parsed.sound === "boolean" ? parsed.sound : prev.sound,
        }));
      } catch {
        // Ignore broken local storage payload.
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem("dq:preferences", JSON.stringify(prefs));
    document.documentElement.setAttribute("data-theme", prefs.dark ? "dark" : "light");
    window.dispatchEvent(new Event("dq:preferences-updated"));
  }, [prefs, isReady]);

  const handleToggle = (key: "notif" | "dark" | "sound") => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggles = [
    { id: "notif", icon: Bell, title: "Push Notifications", desc: "Quest reminders", color: "blue", checked: prefs.notif },
    { id: "dark", icon: Moon, title: "Dark Mode", desc: "Theme preference", color: "purple", checked: prefs.dark },
    { id: "sound", icon: Volume2, title: "Sound Effects", desc: "Level up audio", color: "pink", checked: prefs.sound },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <Settings2 className="text-purple-500" size={24} />
        <h2 className="text-xl font-black text-white uppercase tracking-widest">System Config</h2>
      </div>

      <div className="space-y-4 relative z-10">
        {toggles.map((item) => {
          const Icon = item.icon;
          const bgClass = `bg-${item.color}-500/10`;
          const textClass = `text-${item.color}-500`;
          const borderClass = `border-${item.color}-500/30`;
          const peerCheckedBg = `peer-checked:bg-${item.color}-600`;
          
          return (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/60 border border-white/5 hover:border-white/10 transition-colors shadow-inner">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${bgClass} ${textClass} ${borderClass}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wide">{item.title}</h3>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={item.checked}
                  onChange={() => handleToggle(item.id as "notif" | "dark" | "sound")}
                />
                <div className={`w-14 h-7 bg-zinc-900 border border-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${peerCheckedBg} shadow-inner`}></div>
              </label>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
