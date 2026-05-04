"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedJourney from './AnimatedJourney';

export default function RightCanvas() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full lg:w-[60%] h-[60vh] lg:h-screen relative overflow-hidden bg-[#EEF2F6] flex items-center justify-center border-l border-[#0F172A]/5">
      {/* Background Dotted Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#0F172A 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} 
      />
      
      {/* Subtle parallax container */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center"
        animate={{
          x: mousePos.x * -30,
          y: mousePos.y * -30
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <AnimatedJourney />
      </motion.div>
    </div>
  );
}
