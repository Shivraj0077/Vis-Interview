"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function OverlayLabel({ text, x = 0, y = 0, color = "#0F172A", bold = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: y + 10 }}
      animate={{ opacity: 1, y }}
      exit={{ opacity: 0, y: y - 10 }}
      transition={{ duration: 0.8 }}
      className="absolute z-20 pointer-events-none"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
    >
      <div 
        className={`px-4 py-2 bg-white/70 backdrop-blur-md border border-[#0F172A]/5 text-[10px] sm:text-xs font-mono tracking-widest uppercase ${bold ? 'font-bold' : ''} shadow-sm rounded-sm`}
        style={{ color }}
      >
        {text}
      </div>
    </motion.div>
  );
}
