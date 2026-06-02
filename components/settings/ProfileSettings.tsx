"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Camera, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { notify } from "@/lib/ui/toast";

export default function ProfileSettings() {
  const { update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/user/settings");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load settings");
        }

        setName(data.name || "");
        setEmail(data.email || "");
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    const storedAvatar = localStorage.getItem("dq:avatar");
    if (storedAvatar) {
      setAvatarPreview(storedAvatar);
    }

    loadSettings();
  }, []);

  const initials = useMemo(() => {
    const value = name.trim();
    if (!value) return "DQ";
    return value
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [name]);

  const handleAvatarPick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) return;
      setAvatarPreview(result);
      localStorage.setItem("dq:avatar", result);
      window.dispatchEvent(new Event("dq:avatar-updated"));
      setMessage("Avatar updated");
      setError(null);
      notify("Avatar berhasil diperbarui", "success");
    };
    reader.onerror = () => {
      setError("Failed to read avatar image");
      setMessage(null);
      notify("Gagal membaca file avatar", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save profile");
      }

      await update({ name: data.name });
      setName(data.name || "");
      setEmail(data.email || "");
      setMessage("Identity saved successfully");
      notify("Profil berhasil disimpan", "success");
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
      notify(err.message || "Gagal menyimpan profil", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <Shield className="text-blue-500" size={24} />
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Player Identity</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8 relative z-10">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group/avatar cursor-pointer" onClick={handleAvatarPick}>
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-40 group-hover/avatar:opacity-70 transition duration-500" />
            <div className="relative w-28 h-28 rounded-full bg-zinc-900 border-2 border-blue-500/50 flex items-center justify-center text-white text-3xl font-black shadow-inner overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {initials}
                </span>
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <span className="text-blue-400/80 text-[10px] font-bold uppercase tracking-widest border border-blue-500/30 px-3 py-1 rounded-full bg-blue-500/10">Change Avatar</span>
        </div>

        {/* Inputs */}
        <div className="flex-1 space-y-6">
          <div className="relative">
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Display Name</label>
            <div className="relative group/input">
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/50" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="relative w-full bg-black/60 border border-white/10 focus:border-blue-500/50 rounded-xl py-3 pl-12 pr-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                placeholder={isLoading ? "Loading..." : "Display name"}
                disabled={isLoading || isSaving}
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative group/input">
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/50" size={18} />
              <input 
                type="email" 
                value={email}
                className="relative w-full bg-black/60 border border-white/10 focus:border-blue-500/50 rounded-xl py-3 pl-12 pr-4 text-zinc-400 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                disabled
              />
            </div>
          </div>

          {(message || error) && (
            <p className={`text-xs font-bold uppercase tracking-wider ${error ? "text-rose-400" : "text-emerald-400"}`}>
              {error || message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-white/10 relative z-10">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveProfile}
          disabled={isSaving || isLoading}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider shadow-[0_4px_0_rgb(37,99,235)] hover:shadow-[0_2px_0_rgb(37,99,235)] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-1"
        >
          {isSaving ? "Saving..." : "Save Identity"}
        </motion.button>
      </div>
    </motion.div>
  );
}
