"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Node({ x, y, delay, label, color = "#0F172A" }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className="absolute"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div 
        className="w-2.5 h-2.5 rounded-full cursor-crosshair relative shadow-sm"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 w-full h-full rounded-full animate-ping opacity-20" style={{ backgroundColor: color }} />
      </div>

      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
            className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-white/90 backdrop-blur-sm border border-[#0F172A]/10 text-[9px] uppercase tracking-widest font-sans text-[#0F172A] shadow-sm z-30 pointer-events-none"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
