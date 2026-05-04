"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Node from './Node';
import OverlayLabel from './OverlayLabel';

export default function AnimatedJourney() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 4);
    }, 3500); // Sequence loops every 3.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center">
      
      {/* SVG Container for connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
        <AnimatePresence>
          {stage >= 1 && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M 150 300 C 150 100, 450 100, 450 300"
              stroke="#2563EB"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
            />
          )}
          {stage >= 2 && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M 200 400 L 300 200 L 400 400 Z"
              stroke="#F59E0B"
              strokeWidth="1"
              fill="none"
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Centerpiece: SVG Abstract Silhouette */}
      <motion.div 
        className="relative z-10 w-56 h-72 border-[1px] border-[#0F172A]/10 bg-white shadow-sm flex items-center justify-center rounded-sm overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: stage === 3 ? 0.98 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[#0F172A]/[0.02] pointer-events-none" />
        <svg viewBox="0 0 100 100" className="w-32 h-32 text-[#0F172A]/10">
          <path fill="currentColor" d="M50 50C61.0457 50 70 41.0457 70 30C70 18.9543 61.0457 10 50 10C38.9543 10 30 18.9543 30 30C30 41.0457 38.9543 50 50 50ZM50 55C33.3333 55 0 63.3333 0 90V100H100V90C100 63.3333 66.6667 55 50 55Z" />
        </svg>

        {/* Dynamic Overlays on Silhouette based on Stage */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full border border-[#2563EB] flex items-center justify-center text-[#2563EB] bg-[#2563EB]/5">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#2563EB] uppercase font-semibold">Verified</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Nodes around Silhouette */}
      <AnimatePresence>
        {stage >= 1 && (
          <>
            <Node x={-160} y={-100} delay={0.2} label="Biometrics" />
            <Node x={140} y={-60} delay={0.4} label="Financials" color="#F59E0B" />
            <Node x={-100} y={130} delay={0.6} label="Intent" />
            <Node x={160} y={100} delay={0.8} label="Academics" color="#2563EB" />
          </>
        )}
      </AnimatePresence>

      {/* Floating Soft Rectangles / Overlays */}
      <AnimatePresence mode="wait">
        {stage === 0 && <OverlayLabel key="s0" text="Initializing scan..." y={-200} />}
        {stage === 1 && <OverlayLabel key="s1" text="Identity detected" y={-200} color="#2563EB" />}
        {stage === 2 && (
          <>
            <OverlayLabel key="s2a" text="Verifying history..." y={-200} color="#F59E0B" />
            <OverlayLabel key="s2b" text="Intent: Education" x={200} y={0} color="#0F172A" />
            <OverlayLabel key="s2c" text="Funds: Confirmed" x={-200} y={30} color="#0F172A" />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
