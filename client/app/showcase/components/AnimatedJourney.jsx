"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Node from './Node';
import OverlayLabel from './OverlayLabel';

export default function AnimatedJourney() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 1000));
      setStage(1); // Emergence
      await new Promise(r => setTimeout(r, 3000));
      setStage(2); // Analytical
      await new Promise(r => setTimeout(r, 3500));
      setStage(3); // Context
      await new Promise(r => setTimeout(r, 4000));
      setStage(4); // Resolution
      await new Promise(r => setTimeout(r, 4500));
      setStage(0);
    };
    
    let isMounted = true;
    const run = async () => {
      while(isMounted) {
        await sequence();
      }
    };
    run();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center">
      
      {/* Structural Geometries (Background) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
        <motion.circle 
          cx="300" cy="300" r="180" 
          stroke="#0F172A" strokeWidth="0.5" strokeOpacity="0.1" fill="none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.circle 
          cx="300" cy="300" r="260" 
          stroke="#0F172A" strokeWidth="0.5" strokeOpacity="0.05" fill="none" strokeDasharray="4 4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
        />
        
        {/* Analytical Paths */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M 120 300 C 120 100, 480 100, 480 300"
              stroke="#2563EB"
              strokeWidth="1"
              fill="none"
            />
          )}
          {stage >= 2 && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              d="M 200 450 L 300 120 L 400 450 Z"
              stroke="#F59E0B"
              strokeWidth="1"
              fill="none"
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Abstract Centerpiece */}
      <motion.div 
        className="relative z-10 w-64 h-80 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {/* Silhouette Vector */}
        <svg viewBox="0 0 100 100" className="w-48 h-48 text-[#0F172A] opacity-90 drop-shadow-2xl">
          <path fill="currentColor" d="M50 48C59.9411 48 68 39.9411 68 30C68 20.0589 59.9411 12 50 12C40.0589 12 32 20.0589 32 30C32 39.9411 40.0589 48 50 48ZM50 56C30 56 12 68 12 92H88C88 68 70 56 50 56Z" />
        </svg>

        {/* Bounding box layer */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 border border-[#0F172A]/10 mix-blend-multiply flex items-center justify-center pointer-events-none"
            >
              <div className="w-full h-full border border-[#2563EB]/20 scale-90" />
              <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-[#2563EB]" />
              <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-[#2563EB]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resolution Layer */}
        <AnimatePresence>
          {stage === 4 && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/40 flex items-center justify-center z-20"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="w-16 h-16 rounded-full border border-[#2563EB] bg-white shadow-xl flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Nodes */}
      <AnimatePresence>
        {stage >= 2 && (
          <>
            <Node x={-140} y={-90} delay={0.2} label="Biometrics" color="#0F172A" />
            <Node x={140} y={-50} delay={0.4} label="Financial History" color="#F59E0B" />
            <Node x={-100} y={150} delay={0.6} label="Cognitive Intent" color="#0F172A" />
            <Node x={150} y={120} delay={0.8} label="Academic Record" color="#2563EB" />
          </>
        )}
      </AnimatePresence>

      {/* Context Labels */}
      <AnimatePresence mode="wait">
        {stage === 1 && <OverlayLabel key="s1" text="Subject isolated." y={-180} />}
        {stage >= 2 && stage < 4 && (
          <>
            <OverlayLabel key="s2a" text="Parsing behavioral vectors..." y={-180} color="#0F172A" />
            <OverlayLabel key="s2b" text="Intent: Education" x={190} y={-10} color="#2563EB" />
            <OverlayLabel key="s2c" text="Funds: Verified" x={-190} y={40} color="#F59E0B" />
          </>
        )}
        {stage === 4 && <OverlayLabel key="s4" text="Resolution Achieved" y={-180} color="#2563EB" bold />}
      </AnimatePresence>

      {/* Technical Annotations */}
      <div className="absolute top-10 left-10 text-[9px] font-mono text-[#0F172A]/30 uppercase tracking-[0.2em] pointer-events-none">
        FIG. 01 — IDENTITY TOPOLOGY
      </div>
      <div className="absolute bottom-10 right-10 text-[9px] font-mono text-[#0F172A]/30 uppercase tracking-[0.2em] pointer-events-none">
        LATENCY: 14MS
      </div>
    </div>
  );
}
