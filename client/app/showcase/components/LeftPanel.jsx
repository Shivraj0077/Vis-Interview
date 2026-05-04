"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function LeftPanel() {
  return (
    <div className="w-full lg:w-[40%] h-full flex flex-col justify-center px-12 lg:px-24 py-20 z-10 relative bg-[#EEF2F6]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="mb-6 flex items-center gap-4">
            <div className="w-8 h-[1px] bg-[#F59E0B]" />
            <span className="text-xs uppercase tracking-widest font-mono text-[#F59E0B] font-semibold">Node 01 / Earth</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-serif text-[#0F172A] mb-8 leading-[1.1] tracking-tight">
          The Future<br/>of <span className="italic font-light">Entry.</span>
        </h1>
        <p className="text-[#0F172A]/70 text-base md:text-lg max-w-sm mb-12 leading-relaxed font-light">
          AI-driven interviews and document verification that understand intent and ensure compliance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3.5 bg-[#F59E0B] text-white font-medium text-sm hover:bg-[#D97706] transition-colors shadow-sm flex items-center justify-center gap-2 rounded-sm">
            Explore Architecture
          </button>
          <button className="px-8 py-3.5 border border-[#0F172A]/20 text-[#0F172A] font-medium text-sm hover:bg-[#0F172A]/5 transition-colors flex items-center justify-center gap-2 rounded-sm">
            Initiate Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
