"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedJourney from './AnimatedJourney';

export default function RightCanvas() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      rafId = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth) - 0.5,
          y: (e.clientY / window.innerHeight) - 0.5,
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="w-full lg:w-[60%] h-[60vh] lg:h-screen relative overflow-hidden bg-[#EEF2F6] flex items-center justify-center border-l border-[#0F172A]/10">
      {/* Background Texture / Grain */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#0F172A 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Subtle parallax container */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center"
        animate={{
          x: mousePos.x * -40,
          y: mousePos.y * -40
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <AnimatedJourney />
      </motion.div>
    </div>
  );
}
