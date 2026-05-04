"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// --- Components ---

const NoiseFilter = () => (
  <svg className="pointer-events-none fixed isolate z-50 opacity-[0.02] mix-blend-soft-light w-full h-full">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

const GlowingOrb = ({ className }) => (
  <div className={`absolute rounded-full mix-blend-screen pointer-events-none opacity-10 ${className}`} />
);

// --- Main Page ---

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <main ref={containerRef} className="relative min-h-screen text-white overflow-x-hidden font-sans">

      <NoiseFilter />

      {/* ════════════ BACKGROUND (FIXED) ════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-right bg-no-repeat"
          style={{ backgroundImage: "url('/ascii-art.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-[#206199]/15" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* HEADER */}
      <nav className="fixed top-0 w-full z-40 p-6 md:p-10 flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent">
        <div className="text-2xl font-bold tracking-tighter text-white">VisaAI</div>
        <div className="flex gap-8 items-center">
          <Link href="/about" className="text-xs uppercase tracking-widest text-white font-bold hover:text-blue-400 transition">About</Link>
          <Link href="/signup" className="text-xs uppercase tracking-widest text-white px-6 py-2 border-2 border-white rounded-full font-bold hover:bg-white hover:text-black transition">
            Sign In
          </Link>
        </div>
      </nav>

      {/* 1. HERO */}
      <section className="relative h-screen flex items-center justify-center">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center max-w-5xl px-6"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-7xl md:text-9xl font-extralight tracking-tighter leading-[0.9] mb-8"
          >
            Master your <br />
            <span className="italic font-serif text-blue-200">interview.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-white/80 mb-12 font-light max-w-2xl mx-auto drop-shadow-sm"
          >
            The world's first AI-powered platform for high-stakes visa interview simulation and background integrity check.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-medium overflow-hidden transition-all hover:scale-105 shadow-xl"
            >
              <span>Begin Your Journey</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-1"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. PRECISION SECTION (HORIZONTAL 4 BOXES) */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter italic font-serif text-white/50 underline decoration-blue-500/20 underline-offset-8">Core Precision</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Voice Biometrics", 
                desc: "Face hyper-realistic AI avatars that respond to your body language and tone.",
                icon: "M12 2v20M17 5v14M7 5v14M22 10v4M2 10v4"
              },
              { 
                title: "Document OCR", 
                desc: "Automatic scanning of global databases to ensure your documentation is compliant.",
                icon: "M9 12l2 2 4-4"
              },
              { 
                title: "Risk Analysis", 
                desc: "Predict potential friction points before they happen based on historical data.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              },
              { 
                title: "Neural Coaching", 
                desc: "Get instant feedback on your sentiment and confidence with actionable insights.",
                icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              }
            ].map((feature, i) => (
              <div
                key={i}a
                className="p-10 bg-white shadow-xl rounded-[32px] border border-white/10 hover:scale-[1.02] transition-all duration-500"
              >
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-8 text-slate-400">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={feature.icon}/></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 tracking-tight italic font-serif">{feature.title}</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VERIFICATION STANDARD (REDESIGNED) */}
      <section className="py-24 relative z-10">
        <GlowingOrb className="top-1/4 -left-20 w-[400px] h-[400px] bg-blue-500/10" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-16">
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter mb-8 italic font-serif">
              Verification <br/>
              <span className="text-blue-300 not-italic font-sans font-extralight tracking-tight underline decoration-blue-500/20 underline-offset-12">Reimagined.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: AI Simulation */}
            <div className="group bg-white p-8 rounded-[32px] shadow-2xl border border-black/5 hover:border-black/10 transition-all duration-700">
               <div className="mb-8 flex justify-between items-start">
                  <div className="space-y-3">
                     <div className="text-xs font-mono uppercase tracking-[0.4em] text-slate-400">Neural Node 01</div>
                     <h3 className="text-5xl font-light text-slate-900 tracking-tight italic font-serif leading-none">Acoustic Simulation</h3>
                  </div>
                  <div className="h-10 w-10 border border-slate-200 rounded-full flex items-center justify-center text-xs font-mono text-slate-400">AI</div>
               </div>
               <p className="text-2xl text-slate-500 font-light leading-relaxed mb-10 max-w-sm">Neural models that adapt to your specific voice patterns, sentiment, and confidence levels in real-time.</p>
               
               <div className="relative h-16 flex items-end gap-1 px-2">
                  {[...Array(32)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: "10%" }}
                      animate={{ height: ["10%", `${Math.random() * 80 + 20}%`, "10%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.05 }}
                      className="flex-1 bg-slate-900/10 rounded-full group-hover:bg-blue-500/40 transition-colors"
                    />
                  ))}
               </div>
            </div>

            {/* Card 2: Document Audit */}
            <div className="group bg-white p-8 rounded-[32px] shadow-2xl border border-black/5 hover:border-black/10 transition-all duration-700">
               <div className="mb-8 flex justify-between items-start">
                  <div className="space-y-3">
                     <div className="text-xs font-mono uppercase tracking-[0.4em] text-slate-400">Module 02</div>
                     <h3 className="text-5xl font-light text-slate-900 tracking-tight italic font-serif leading-none">Integrity Audit</h3>
                  </div>
                  <div className="h-10 w-10 border border-slate-200 rounded-full flex items-center justify-center text-xs font-mono text-slate-400">DOC</div>
               </div>
               <p className="text-2xl text-slate-500 font-light leading-relaxed mb-10 max-w-sm">Automated ingestion of passports to verify compliance with global database standards before you submit.</p>
               
               <div className="space-y-4 font-mono text-xs tracking-tight text-slate-400">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-2">
                     <span className="text-blue-500 font-bold">→</span>
                     <span className="text-slate-900 font-bold uppercase">Passport 772-X</span>
                     <span className="ml-auto opacity-50 italic">Verified 14ms</span>
                  </div>
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-2">
                     <span className="text-blue-500 font-bold">→</span>
                     <span className="text-slate-900 font-bold uppercase">Funding_Statement_Final</span>
                     <span className="ml-auto opacity-50 italic">Validated</span>
                  </div>
               </div>
            </div>

            {/* Card 3: Risk Matrix */}
            <div className="group bg-white p-8 rounded-[32px] shadow-2xl border border-black/5 hover:border-black/10 transition-all duration-700">
               <div className="mb-8 flex justify-between items-start">
                  <div className="space-y-3">
                     <div className="text-xs font-mono uppercase tracking-[0.4em] text-slate-400">Engine 03</div>
                     <h3 className="text-5xl font-light text-slate-900 tracking-tight italic font-serif leading-none">Predictive Risk</h3>
                  </div>
                  <div className="h-10 w-10 border border-slate-200 rounded-full flex items-center justify-center text-xs font-mono text-slate-400">R-X</div>
               </div>
               <p className="text-2xl text-slate-500 font-light leading-relaxed mb-10 max-w-sm">AI-driven vector mapping that identifies approval probability based on historical consular trends.</p>
               
               <div className="flex items-end gap-12">
                  <div className="text-8xl font-extralight tracking-tighter text-slate-900 italic font-serif">94.2%</div>
                  <div className="flex-1 h-px bg-slate-200 mb-6 relative">
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500" />
                  </div>
               </div>
            </div>

            {/* Card 4: Global Sync */}
            <div className="group bg-white p-8 rounded-[32px] shadow-2xl border border-black/5 hover:border-black/10 transition-all duration-700 relative overflow-hidden">
               <div className="relative z-10 max-w-[65%]">
                  <div className="mb-8 flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="text-xs font-mono uppercase tracking-[0.4em] text-slate-400">Module 04</div>
                      <h3 className="text-5xl font-light text-slate-900 tracking-tight italic font-serif leading-none">Global Sync</h3>
                    </div>
                  </div>
                  <p className="text-2xl text-slate-500 font-light leading-relaxed mb-8">Instantly synchronize verified credentials with partner institutions to streamline the process.</p>
                  
                  <div className="flex gap-3">
                    <div className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest">Connect API</div>
                    <div className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-400 text-[9px] font-bold uppercase tracking-widest">WES Network</div>
                  </div>
               </div>
               
               {/* 🔷 SYSTEM GLOBE (REPLACES IMAGE) */}
               <div className="absolute right-4 top-4 w-56 h-56 pointer-events-none opacity-80 drop-shadow-sm">
                  <motion.svg
                    viewBox="0 0 200 200"
                    className="w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <defs>
                      <radialGradient id="sphereGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                        <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
                      </radialGradient>
                    </defs>
                    
                    {/* 3D Sphere Body */}
                    <circle cx="100" cy="100" r="80" fill="url(#sphereGrad)" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                    
                    {/* Rotating longitude lines */}
                    <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} style={{ transformOrigin: "50% 50%" }}>
                      {[...Array(8)].map((_, i) => (
                        <ellipse key={i} cx="100" cy="100" rx={80 - i * 10} ry="80" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
                      ))}
                    </motion.g>
                    
                    {/* Latitude lines */}
                    {[...Array(8)].map((_, i) => (
                      <ellipse key={i} cx="100" cy="100" rx="80" ry={80 - i * 10} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
                    ))}
                    
                    {/* Center point */}
                    <circle cx="100" cy="100" r="3" fill="#3B82F6" />
                  </motion.svg>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-48 relative z-10 text-center overflow-hidden">
        <GlowingOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-6xl md:text-8xl font-extralight tracking-tighter mb-12">
            Opportunity waits for <br/>
            <span className="italic text-blue-200">the prepared.</span>
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="w-full md:w-auto px-12 py-6 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition active:scale-95 shadow-2xl"
            >
              Get Started Now
            </Link>
          </div>
          
          <p className="mt-12 text-white/30 text-sm font-mono uppercase tracking-widest">
            Used by 25,000+ applicants last month
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5 relative z-10 bg-black/40">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-3xl font-bold tracking-tighter text-white">VisaAI</div>
          
          <div className="flex gap-16 text-white/60 text-sm uppercase tracking-widest font-bold">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          
          <div className="text-white/40 text-xs font-mono tracking-widest">
            © {new Date().getFullYear()} VISA AI SYSTEMS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

    </main>
  );
}