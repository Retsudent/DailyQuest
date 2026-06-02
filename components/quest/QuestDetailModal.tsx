"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sword, Shield, Zap, Star, Trophy, Trash2, Edit3, CheckCircle2, Clock } from "lucide-react";

interface QuestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: {
    id: string;
    title: string;
    type: string;
    xp: number;
    rarity: string;
    completed: boolean;
    description?: string;
  } | null;
}

const rarities = [
  { id: "common", name: "Common", icon: Sword, color: "text-slate-400", border: "border-slate-500/30", bg: "bg-slate-500/10" },
  { id: "rare", name: "Rare", icon: Shield, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  { id: "epic", name: "Epic", icon: Zap, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  { id: "legendary", name: "Legendary", icon: Star, color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
] as const;

const rarityConfig = {
  common: { color: "text-slate-400", border: "border-slate-500/30", bg: "bg-slate-500/10", icon: Sword },
  rare: { color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", icon: Shield },
  epic: { color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", icon: Zap },
  legendary: { color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10", icon: Star },
} as const;

export default function QuestDetailModal({ isOpen, onClose, quest }: QuestDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    type: "",
    xp: 0,
    rarity: "",
    description: ""
  });

  // Initialize form when editing starts
  const startEditing = () => {
    if (quest) {
      setEditForm({
        title: quest.title,
        type: quest.type,
        xp: quest.xp,
        rarity: quest.rarity,
        description: quest.description || ""
      });
      setIsEditing(true);
    }
  };

  if (!quest) return null;

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quests/${quest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      if (res.ok) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to complete quest:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/quests/${quest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setIsEditing(false);
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update quest:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to abort this mission?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/quests/${quest.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to delete quest:", error);
    } finally {
      setLoading(false);
    }
  };

  const conf = rarityConfig[quest.rarity as keyof typeof rarityConfig] || rarityConfig.common;
  const Icon = conf.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsEditing(false);
              onClose();
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Header / Banner */}
            <div className={`h-32 w-full ${conf.bg} relative flex items-center justify-center overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`w-20 h-20 rounded-2xl ${conf.bg} border ${conf.border} flex items-center justify-center ${conf.color} shadow-2xl relative z-10`}
              >
                <Icon size={40} />
              </motion.div>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => {
                setIsEditing(false);
                onClose();
              }}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-8 space-y-6">
              {!isEditing ? (
                <>
                  <div className="text-center space-y-2">
                    <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${conf.color}`}>{quest.rarity} Mission</div>
                    <h2 className="text-3xl font-black text-white tracking-tight leading-tight">{quest.title}</h2>
                    <div className="flex items-center justify-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest pt-2">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-400" /> {quest.type}</span>
                      <span className="flex items-center gap-1.5"><Trophy size={14} className="text-yellow-500" /> +{quest.xp} EXP</span>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className={`p-4 rounded-2xl border ${quest.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-500/5 border-white/5'} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${quest.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                        <CheckCircle2 size={18} />
                      </div>
                      <span className={`text-xs font-black uppercase tracking-wider ${quest.completed ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        Status: {quest.completed ? 'Mission Cleared' : 'Active Objective'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Mission Intel</label>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 text-sm leading-relaxed italic">
                      {quest.description || "No further details available for this objective. Proceed with caution and ensure all parameters are met for successful completion."}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={startEditing}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 hover:border-blue-500/50 transition-all group disabled:opacity-50"
                    >
                      <Edit3 size={18} className="group-hover:text-blue-400 transition-colors" />
                      Edit
                    </button>
                    <button 
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all group disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                      {loading ? "Aborting..." : "Abort"}
                    </button>
                  </div>

                  {/* Primary Action */}
                  {!quest.completed && (
                    <button 
                      onClick={handleComplete}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-blue-400/50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Complete Objective"}
                    </button>
                  )}
                </>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Mission Title</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-blue-500/50"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Type</label>
                      <select 
                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-blue-500/50 appearance-none"
                        value={editForm.type}
                        onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                      >
                        <option value="Daily Quest">Daily Quest</option>
                        <option value="Side Quest">Side Quest</option>
                        <option value="Epic Quest">Epic Quest</option>
                        <option value="Main Quest">Main Quest</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">XP</label>
                      <input 
                        type="number" 
                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-blue-500/50"
                        value={editForm.xp}
                        onChange={(e) => setEditForm({...editForm, xp: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Rarity</label>
                    <div className="grid grid-cols-4 gap-2">
                      {rarities.map((r) => {
                        const RIcon = r.icon;
                        const isSelected = editForm.rarity === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setEditForm({...editForm, rarity: r.id})}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                              isSelected 
                              ? `${r.border} ${r.bg} ${r.color}` 
                              : 'border-white/5 bg-white/5 text-zinc-500'
                            }`}
                          >
                            <RIcon size={16} />
                            <span className="text-[8px] font-black uppercase">{r.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Add mission details..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 rounded-2xl bg-white/5 text-zinc-400 font-black uppercase tracking-widest hover:bg-white/10 border border-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-blue-400/50"
                    >
                      {loading ? "Saving..." : "Save Intel"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
