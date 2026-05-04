"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function OverlayLabel({ text, x = 0, y = 0, color = "#0F172A", bold = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: y + 5, filter: "blur(4px)" }}
      animate={{ opacity: 1, y, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: y - 5, filter: "blur(4px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute z-20 pointer-events-none"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
    >
      <div 
        className={`px-3 py-1.5 bg-white/60 backdrop-blur-md border border-[#0F172A]/5 text-[9px] font-sans tracking-widest uppercase shadow-sm rounded-none`}
        style={{ color, fontWeight: bold ? 600 : 400 }}
      >
        {text}
      </div>
    </motion.div>
  );
}
