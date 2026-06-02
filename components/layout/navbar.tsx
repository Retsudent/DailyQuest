"use client";

import Container from "./container";
import { Sword, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <Container className="flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-white/20 transition-transform group-hover:scale-110">
            <Sword size={24} className="-rotate-45" />
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-500 tracking-tighter">
            DAILY<span className="text-purple-500">QUEST</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 md:flex">
          {["Features", "Classes", "Rankings"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-purple-400 transition-colors relative group"
            >
              {item}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Action */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider shadow-[0_4px_0_rgb(126,34,206)] hover:shadow-[0_2px_0_rgb(126,34,206)] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-1"
              >
                Play Now
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-400 hover:text-white md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#0a0a0f] overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {["Features", "Classes", "Rankings"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-purple-400 transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="h-px bg-white/5 w-full" />
              <div className="flex flex-col gap-4">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-bold uppercase tracking-widest text-zinc-300 text-center"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="w-full py-4 rounded-xl bg-purple-600 text-white text-sm font-black uppercase tracking-widest shadow-[0_4px_0_rgb(126,34,206)]">
                    Play Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}