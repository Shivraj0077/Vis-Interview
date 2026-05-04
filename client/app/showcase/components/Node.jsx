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
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="absolute"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div 
        className="w-3 h-3 rounded-full cursor-pointer relative"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 w-full h-full rounded-full animate-ping opacity-30" style={{ backgroundColor: color }} />
      </div>

      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-white border border-[#0F172A]/10 text-[10px] uppercase tracking-widest text-[#0F172A] shadow-sm z-20 pointer-events-none rounded-sm"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
