"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sword, Shield, Zap, Star, Trophy, Sparkles } from "lucide-react";
import { notify } from "@/lib/ui/toast";

interface AddQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const rarities = [
  { id: "common", name: "Common", icon: Swords, color: "text-slate-400", border: "border-slate-500/30", bg: "bg-slate-500/10" },
  { id: "rare", name: "Rare", icon: Shield, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  { id: "epic", name: "Epic", icon: Zap, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  { id: "legendary", name: "Legendary", icon: Star, color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
] as const;

import { Swords } from "lucide-react";

export default function AddQuestModal({ isOpen, onClose, onCreated }: AddQuestModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Daily Quest",
    rarity: "common",
    xp: 50,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        notify("Quest baru berhasil dibuat", "success");
        onCreated?.();
      } else {
        const data = await res.json().catch(() => ({}));
        notify(data?.error || "Gagal membuat quest", "error");
      }
    } catch (error) {
      console.error("Failed to create quest:", error);
      notify("Terjadi error saat membuat quest", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto themed-scrollbar bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-x-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Top Glow Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x" />

            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <Sword size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">Forge New Quest</h2>
                  <p className="text-zinc-300 text-[10px] uppercase font-bold tracking-widest mt-0.5">Define your objective</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest ml-1">Mission Title</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-zinc-600 group-focus-within:text-blue-400 transition-colors">
                    <Sparkles size={16} />
                  </div>
                  <input 
                    required
                    type="text" 
                    placeholder="E.g. Defeat the Morning Grogginess"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              {/* Type & XP Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest ml-1">Quest Type</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white font-bold focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none cursor-pointer"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Daily Quest">Daily Quest</option>
                    <option value="Side Quest">Side Quest</option>
                    <option value="Epic Quest">Epic Quest</option>
                    <option value="Main Quest">Main Quest</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest ml-1">XP Reward</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-yellow-500">
                      <Trophy size={16} />
                    </div>
                    <input 
                      type="number" 
                      className="w-full bg-black/50 border border-white/10 rounded-2xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base text-white font-bold focus:outline-none focus:border-blue-500/50 shadow-inner"
                      value={formData.xp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          xp: Number.isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Rarity Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest ml-1">Mission Rarity</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {rarities.map((r) => {
                    const RIcon = r.icon;
                    const isSelected = formData.rarity === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setFormData({...formData, rarity: r.id})}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                          ? `${r.border} ${r.bg} ${r.color} shadow-[0_0_15px_rgba(255,255,255,0.05)]` 
                          : 'border-white/5 bg-white/5 text-zinc-500 hover:border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <RIcon size={20} />
                        <span className="text-[9px] font-black uppercase tracking-tighter">{r.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 sm:py-4 rounded-2xl bg-white/5 text-xs sm:text-sm text-zinc-400 font-black uppercase tracking-widest hover:bg-white/10 border border-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-blue-400/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Forging Mission..." : "Confirm Mission"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
