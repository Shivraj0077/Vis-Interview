"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function LeftPanel() {
  return (
    <div className="w-full lg:w-[40%] h-full flex flex-col justify-center px-12 lg:px-24 py-20 z-10 relative bg-[#EEF2F6]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8 flex items-center gap-4 opacity-70">
            <div className="w-6 h-[1px] bg-[#F59E0B]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#F59E0B] font-medium">Intelligence Engine</span>
        </div>
        <h1 className="text-5xl lg:text-[4.5rem] font-serif text-[#0F172A] mb-8 leading-[1.05] tracking-tight">
          Understanding<br/>people beyond <span className="italic font-light">data.</span>
        </h1>
        <p className="text-[#0F172A]/70 text-base md:text-lg max-w-sm mb-12 leading-relaxed font-sans font-light">
          A system that interprets identity, intent, and context — and transforms them into decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 font-sans">
          <button className="px-8 py-3 bg-[#F59E0B] text-white font-medium text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2 rounded-none">
            Explore Architecture
          </button>
          <button className="px-8 py-3 border border-[#0F172A]/20 text-[#0F172A] font-medium text-sm hover:bg-[#0F172A]/5 transition-colors flex items-center justify-center gap-2 rounded-none">
            Initiate Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
