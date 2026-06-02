"use client";

import { motion } from "framer-motion";

import { ReactNode } from "react";

type Props = {
  title: string;

  value: string;

  icon: ReactNode;
};

export default function StatCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/5" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-zinc-400 text-sm">
            {title}
          </p>

          <h3 className="text-4xl font-bold text-white mt-2">
            {value}
          </h3>
        </div>

        <div className="text-blue-400">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}