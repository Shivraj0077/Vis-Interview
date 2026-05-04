"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Zap, Shield, Target, Cpu } from 'lucide-react';

const NoiseFilter = () => (
  <svg className="pointer-events-none fixed isolate z-50 opacity-[0.02] mix-blend-soft-light w-full h-full">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

export default function ShowcasePage() {
  return (
    <div className="min-h-screen relative text-white selection:bg-blue-500/30 font-sans overflow-x-hidden bg-[#02040A]">
      <NoiseFilter />

      {/* ════════════ THEME BACKGROUND (NO IMAGE) ════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#206199]/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        
        {/* Signature Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <nav className="fixed top-0 w-full z-40 p-8 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="text-xl font-light tracking-tighter">VisaAI Showcase</div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-extralight tracking-tighter mb-8"
          >
            The Future of <br/>
            <span className="italic font-serif text-blue-200">Integrity.</span>
          </motion.h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-light">
            Explore the technological pillars that power our high-stakes verification engine.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              title: "Neural Interview Engine",
              desc: "Predictive linguistic analysis that identifies intent with 98% accuracy.",
              icon: Cpu,
              color: "text-blue-400"
            },
            {
              title: "Global Link Validation",
              desc: "Checksum verification across 150+ international government databases.",
              icon: Shield,
              color: "text-emerald-400"
            },
            {
              title: "Behavioral Forensics",
              desc: "Real-time micro-expression mapping during simulated scenarios.",
              icon: Target,
              color: "text-purple-400"
            },
            {
              title: "Instant Risk Inversion",
              desc: "Identify and resolve friction points before human review occurs.",
              icon: Zap,
              color: "text-amber-400"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-12 border border-white/10 bg-black/40 rounded-[40px] hover:bg-white/[0.03] transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <item.icon className={`h-12 w-12 ${item.color} mb-8 opacity-40 group-hover:opacity-100 transition-opacity`} />
              <h3 className="text-3xl font-light tracking-tighter mb-4">{item.title}</h3>
              <p className="text-white/30 text-lg leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <section className="mt-48 text-center">
            <h2 className="text-4xl font-light mb-12 tracking-tight text-white/80">Ready to begin?</h2>
            <Link href="/signup" className="px-12 py-6 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition active:scale-95">
                Initialize Application
            </Link>
        </section>
      </main>

      <footer className="py-24 text-center border-t border-white/5 bg-black/40 relative z-10">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">© 2026 VISA AI SYSTEMS // CLASSIFIED</p>
      </footer>
    </div>
  );
}
