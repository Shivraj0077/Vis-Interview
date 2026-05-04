"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Text, ContactShadows, Environment, Html } from "@react-three/drei";
import { ArrowRight, Download, Star, Crosshair } from "lucide-react";

// Theme Colors derived from the editorial design
const theme = {
  bg: "#F4EFE6",
  text: "#1A1A1A",
  accent: "#E25A48", // Coral red
  muted: "#8C8A86",
  border: "rgba(0,0,0,0.1)"
};

// 3D Geometry
function ClassicalPrism({ activeMode }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.15;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        
        const targetScale = activeMode === "explode" ? 0.8 : 1.2;
        meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        {/* An elegant geometric shape to represent the intelligence engine */}
        <octahedronGeometry args={[2, 0]} />
        <MeshTransmissionMaterial 
          backside
          backsideThickness={5}
          thickness={2}
          chromaticAberration={0.1}
          anisotropy={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
          color="#ffffff"
          transmission={0.9}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

// Collage-style abstract elements in the background of the 3D scene
function AbstractBackground() {
  return (
    <group position={[0, 0, -5]}>
      {/* Red Circle Accent */}
      <mesh position={[2, 1, -2]}>
        <circleGeometry args={[3, 64]} />
        <meshBasicMaterial color={theme.accent} transparent opacity={0.8} />
      </mesh>
      {/* Dark Gold Circle Accent */}
      <mesh position={[-3, -2, -1]}>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial color="#C59B27" transparent opacity={0.9} />
      </mesh>
      {/* Square Frame outline */}
      <mesh position={[1, -2, 0]}>
        <boxGeometry args={[3, 3, 0.1]} />
        <meshBasicMaterial color={theme.text} wireframe />
      </mesh>
    </group>
  );
}

export default function EditorialLanding() {
  const [activeMode, setActiveMode] = useState("idle");

  return (
    <div className="relative w-full min-h-screen overflow-hidden selection:bg-[#E25A48] selection:text-white" style={{ backgroundColor: theme.bg, color: theme.text }}>
      
      {/* Custom Styles for Fonts to match the exact aesthetic */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
        .font-editorial { font-family: 'Playfair Display', serif; }
        .font-mono-archival { font-family: 'Space Mono', monospace; }
        .font-sans-modern { font-family: 'Inter', sans-serif; }
      `}} />

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 w-full h-10 border-b flex items-center justify-between px-6 z-40 text-[9px] uppercase tracking-[0.2em] font-mono-archival text-black/50" style={{ borderColor: theme.border }}>
        <div>DD / 2026 · VOL. 01 / ISSUE N° 26</div>
        <div className="hidden md:flex gap-8">
          <span className="text-[#E25A48]">FILED UNDER <span className="font-bold text-black/80">INTELLIGENCE</span></span>
          <span>APACHE-2.0 · MADE ON EARTH</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-2 text-black/80"><div className="w-1.5 h-1.5 rounded-full bg-[#E25A48] animate-pulse"/> LIVE · V0.3.0</span>
          <span>EN · DE · 中文 · 日本語</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="absolute top-10 left-0 w-full px-8 py-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center font-editorial italic text-xl">V</div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight font-sans-modern">Visa Verification</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-black/50 font-mono-archival">NODE N° 01 / BORDER / EARTH</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 text-sm font-medium font-sans-modern">
          <span className="cursor-pointer hover:text-[#E25A48] transition-colors flex items-start gap-1">Docs <span className="text-[8px] text-black/40 mt-0.5">31</span></span>
          <span className="cursor-pointer hover:text-[#E25A48] transition-colors flex items-start gap-1">Systems <span className="text-[8px] text-black/40 mt-0.5">72</span></span>
          <span className="cursor-pointer hover:text-[#E25A48] transition-colors flex items-start gap-1">Agents <span className="text-[8px] text-black/40 mt-0.5">12</span></span>
          <span className="cursor-pointer hover:text-[#E25A48] transition-colors">Contact</span>
        </nav>

        <div className="flex items-center gap-4 font-sans-modern">
          <button className="px-5 py-2 rounded-full border border-black/20 text-xs font-medium hover:bg-black/5 transition-colors flex items-center gap-2">
            Dashboard <ArrowRight className="w-3 h-3" />
          </button>
          <button className="px-5 py-2 rounded-full bg-[#1A1A1A] text-white text-xs font-medium flex items-center gap-2 shadow-lg shadow-black/10">
            Star · 21.6K <Star className="w-3 h-3 text-[#E25A48] fill-[#E25A48]" />
          </button>
        </div>
      </header>

      {/* Vertical Side Text */}
      <div className="absolute left-0 top-0 h-full w-8 flex items-center justify-center z-30 opacity-40 mix-blend-multiply pointer-events-none">
        <div className="transform -rotate-90 text-[8px] tracking-[0.4em] font-mono-archival whitespace-nowrap text-black">
          SKILLS • SYSTEMS • AGENTS • BYOK • LOCAL-FIRST
        </div>
      </div>
      <div className="absolute right-0 top-0 h-full w-8 flex items-center justify-center z-30 opacity-40 mix-blend-multiply pointer-events-none">
        <div className="transform -rotate-90 text-[8px] tracking-[0.4em] font-mono-archival whitespace-nowrap text-black">
          OPEN VERIFICATION — VOL. 01 - ISSUE N° 26 • APACHE-2.0
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="relative w-full h-screen pt-36 px-12 md:px-24 flex flex-col lg:flex-row items-center justify-between z-20">
        
        {/* Left Typography Column */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center h-full pb-20 z-20">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-6 h-[1px] bg-[#E25A48]" />
            <span className="text-[9px] tracking-[0.2em] font-mono-archival text-[#E25A48] uppercase font-bold">Adaptive Prescreening Engine</span>
            <span className="text-[9px] tracking-[0.2em] font-mono-archival text-black/30">- N° 01</span>
          </div>

          <h1 className="text-6xl lg:text-[5.5rem] font-editorial text-[#1A1A1A] leading-[0.95] tracking-tight mb-8">
            Verifying<br/>
            <span className="italic font-light">intent</span> with logic,<br/>
            <span className="italic font-light">data</span>, <span className="font-bold tracking-tighter">and code<span className="text-[#E25A48]">.</span></span>
          </h1>

          <p className="text-black/70 text-sm md:text-[15px] leading-relaxed max-w-md mb-10 font-sans-modern font-light">
            The intelligent alternative to manual prescreening. Your existing application workflow becomes the verification engine, driven by real-time intelligence, OCR, and cross-border data systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start font-sans-modern">
            <button className="px-8 py-3.5 rounded-full bg-[#E25A48] text-white font-medium text-sm flex items-center gap-3 hover:bg-[#D44E3D] transition-colors shadow-xl shadow-[#E25A48]/20">
              Initiate Demo <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-3.5 rounded-full border border-black/20 text-black font-medium text-sm flex items-center gap-3 hover:bg-black/5 transition-colors">
              Explore Architecture <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Draggable Interaction element */}
          <motion.div
            className="mt-16 flex items-center gap-4 cursor-grab active:cursor-grabbing p-4 border border-black/10 rounded-xl bg-white/40 backdrop-blur-md w-fit shadow-sm"
            drag
            dragConstraints={{ left: 0, top: -200, right: 600, bottom: 0 }}
            onDrag={(e, info) => {
              if (info.point.x > window.innerWidth / 2) setActiveMode("explode");
              else setActiveMode("idle");
            }}
            onDragEnd={(e, info) => {
              if (info.point.x <= window.innerWidth / 2) setActiveMode("idle");
            }}
          >
            <div className="w-12 h-12 rounded-full bg-[#F4EFE6] border border-black/10 flex items-center justify-center shadow-inner">
              <Crosshair className="w-5 h-5 text-[#E25A48]" />
            </div>
            <div>
              <div className="text-xs font-bold font-sans-modern text-black">Verification Module</div>
              <div className="text-[10px] text-black/50 font-mono-archival mt-1">DRAG INTO VIEW TO ANALYZE</div>
            </div>
          </motion.div>
        </div>

        {/* Right Canvas/Collage Column */}
        <div className="w-full lg:w-[48%] h-[60vh] lg:h-[80vh] relative border-l border-t border-black/10 bg-[#E8E1D3]/40 rounded-tl-3xl shadow-inner mt-10 lg:mt-0">
          
          {/* Corner Archival Markers */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-black/30 pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-black/30 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-black/30 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-black/30 pointer-events-none" />
          
          {/* Labels */}
          <div className="absolute top-6 left-12 text-[9px] font-mono-archival text-black/40 tracking-widest uppercase pointer-events-none">FIG. 01 / DD-26</div>
          <div className="absolute top-6 right-12 text-[9px] font-mono-archival text-black/40 tracking-widest uppercase pointer-events-none">PLATE N° 08</div>
          <div className="absolute bottom-6 right-12 text-[9px] font-mono-archival text-[#E25A48] tracking-widest uppercase pointer-events-none">COMPOSED IN <span className="font-bold">VISA-APP</span></div>

          {/* Floating UI Panel */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-[#F4EFE6]/90 backdrop-blur-md border border-black/10 p-5 rounded z-10 flex flex-col gap-4 shadow-xl">
            <div className="text-[9px] font-mono-archival text-[#E25A48] tracking-widest">01<br/><span className="text-black/50">DETECT</span></div>
            <div className="text-[9px] font-mono-archival text-[#E25A48] tracking-widest">02<br/><span className="text-black font-bold">DISCOVER</span></div>
            <div className="text-[9px] font-mono-archival text-[#E25A48] tracking-widest">03<br/><span className="text-black/50">DIRECT</span></div>
            <div className="text-[9px] font-mono-archival text-[#E25A48] tracking-widest">04<br/><span className="text-black/50">DELIVER</span></div>
          </div>

          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={1} color={theme.accent} />
            <Environment preset="city" />
            
            <AbstractBackground />
            <ClassicalPrism activeMode={activeMode} />
            <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={10} blur={2} far={4} color="#000000" />

            {/* Explosive Data when dragged */}
            {activeMode === "explode" && (
              <Html position={[0, 0, 0]} center zIndexRange={[100, 0]}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-4 w-64 pointer-events-none"
                >
                  <div className="bg-white/90 backdrop-blur-md border border-black/10 p-4 shadow-2xl rounded-sm">
                    <div className="text-[9px] font-mono-archival text-[#E25A48] tracking-widest mb-1">OCR ANALYSIS</div>
                    <div className="text-lg font-serif font-bold text-black mb-2">Confidence: 99.8%</div>
                    <div className="h-[1px] w-full bg-black/10 mb-2" />
                    <div className="text-xs font-sans-modern text-black/60">Passport Identity: MATCHED</div>
                  </div>
                  <div className="bg-[#1A1A1A]/90 backdrop-blur-md border border-black/10 p-4 shadow-2xl rounded-sm ml-12">
                    <div className="text-[9px] font-mono-archival text-white/50 tracking-widest mb-1">SANCTIONS CHECK</div>
                    <div className="text-sm font-sans-modern text-white">STATUS: CLEAR</div>
                  </div>
                </motion.div>
              </Html>
            )}
          </Canvas>

          {/* Dotted Grid Pattern overlay (to simulate newsprint/halftone texture) */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        </div>
      </main>
    </div>
  );
}
