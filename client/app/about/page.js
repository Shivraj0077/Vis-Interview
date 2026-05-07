"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Brain, FileCheck, Users, Zap, Globe } from 'lucide-react';

const NoiseFilter = () => (
  <svg className="pointer-events-none fixed isolate z-50 opacity-[0.02] mix-blend-soft-light w-full h-full">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

const TEAM = [
  { name: "Aryan Shah", role: "Chief AI Architect", initials: "AS", color: "from-blue-500 to-cyan-500" },
  { name: "Priya Mehta", role: "Lead Visa Compliance Officer", initials: "PM", color: "from-purple-500 to-pink-500" },
  { name: "James Okoye", role: "Senior Backend Engineer", initials: "JO", color: "from-emerald-500 to-teal-500" },
  { name: "Lin Wei", role: "ML Research Lead", initials: "LW", color: "from-amber-500 to-orange-500" },
];

const PILLARS = [
  { icon: Brain, title: "Gemini-Powered AI", desc: "Every interview question is dynamically generated based on the candidate's documents, score, and financial profile — no two interviews are identical.", color: "text-blue-400" },
  { icon: FileCheck, title: "Multi-Document OCR", desc: "Passport, I-20, Bank Statements, Offer Letters, SOPs, and Resumes are parsed with Gemini Vision — extracting structured data with field-level validation.", color: "text-emerald-400" },
  { icon: Shield, title: "Risk Scoring Engine", desc: "A composite scoring model combining document integrity (30pts), background clearance (25pts), and interview credibility (45pts) to produce a final risk rating.", color: "text-purple-400" },
  { icon: Globe, title: "Global Background Check", desc: "Cross-references applicant names against international news and legal databases to surface criminal, fraud, or deportation histories.", color: "text-amber-400" },
  { icon: Users, title: "Officer Review Portal", desc: "Administrators see every document, each interview Q&A with per-answer AI scoring, background flags, and a full recommendation set — enabling informed decisions.", color: "text-rose-400" },
  { icon: Zap, title: "Real-Time Feedback", desc: "Students receive instant per-answer feedback and a comprehensive summary report upon interview completion, with actionable improvement recommendations.", color: "text-cyan-400" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#02040A] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <NoiseFilter />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#206199]/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 px-8 py-6 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">V</span>
          </div>
          <span className="text-lg font-light tracking-tighter">VisaAI</span>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-32 px-6 max-w-6xl mx-auto">

        {/* Hero */}
        <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-32 text-center">
          <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-6">About the Platform</div>
          <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter mb-8 leading-none">
            Built for <br />
            <span className="italic font-serif text-blue-300">High-Stakes</span> Decisions.
          </h1>
          <p className="text-white/40 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            VisaAI is an AI-native visa pre-screening platform that automates document verification, dynamic interviews, and risk assessment — giving officers the intelligence to decide confidently.
          </p>
        </motion.header>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-32 p-16 border border-white/10 bg-white/[0.02] rounded-[48px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-6">Our Mission</div>
              <h2 className="text-4xl font-light tracking-tighter mb-8 leading-tight">Replacing intuition with <span className="italic font-serif text-white/60">evidence.</span></h2>
              <p className="text-white/40 text-lg font-light leading-relaxed">
                Traditional visa interviews rely heavily on an officer's gut. VisaAI changes this by providing a structured, AI-scored data layer — analysing documents, financial history, and verbal responses with the precision of a neural network tuned for credibility detection.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Accuracy Rate", value: "97.4%", sub: "document validation" },
                { label: "Avg Review Time", value: "< 3min", sub: "per application" },
                { label: "Questions Generated", value: "7+", sub: "per interview" },
                { label: "Risk Dimensions", value: "3", sub: "scoring axes" },
              ].map((s, i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-center">
                  <p className="text-3xl font-extralight tracking-tighter text-white mb-2">{s.value}</p>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">{s.label}</p>
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technology Pillars */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-4">Technology Stack</div>
            <h2 className="text-4xl font-light tracking-tighter">Six pillars of verification.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PILLARS.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="p-10 border border-white/10 bg-black/40 rounded-[40px] hover:bg-white/[0.04] hover:border-white/20 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <p.icon className={`h-10 w-10 ${p.color} mb-8 opacity-60 group-hover:opacity-100 transition-opacity`} />
                <h3 className="text-xl font-light tracking-tighter mb-4">{p.title}</h3>
                <p className="text-white/30 text-sm font-light leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-32">
          <div className="text-center mb-16">
            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-4">End-to-End Flow</div>
            <h2 className="text-4xl font-light tracking-tighter">From application to decision.</h2>
          </div>
          <div className="space-y-4">
            {[
              { step: "01", title: "Document Upload & OCR", desc: "Candidates upload Passport, I-20, Bank Statement, Offer Letter, SOP, Photo, and Resume. Gemini Vision extracts structured fields and validates consistency across all documents." },
              { step: "02", title: "Dynamic AI Interview", desc: "7 questions are generated in real-time based on the candidate's score and uploaded documents. Questions adapt per phase: identity, intent, financial, background, and closing." },
              { step: "03", title: "Per-Answer Scoring", desc: "Each answer receives immediate AI feedback — scored on consistency, specificity, and red flags. Students see this feedback after each question." },
              { step: "04", title: "Holistic Report", desc: "Upon completion, a comprehensive summary is generated: academic intent score, financial understanding, post-graduation clarity, credibility score, and recommended improvements." },
              { step: "05", title: "Officer Review", desc: "Admins access the full candidate profile: all documents with extracted data, every Q&A with per-answer scores, background hits, final score, risk level, and one-click approval." },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 p-10 border border-white/5 bg-white/[0.01] rounded-[32px] hover:border-white/10 transition-all group">
                <span className="text-4xl font-extralight text-white/10 group-hover:text-blue-500/30 transition-colors shrink-0 tracking-tighter">{item.step}</span>
                <div>
                  <h3 className="text-xl font-light tracking-tighter text-white mb-3">{item.title}</h3>
                  <p className="text-white/30 font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-4">The Team</div>
            <h2 className="text-4xl font-light tracking-tighter">Built by specialists.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-10 border border-white/10 bg-black/40 rounded-[40px] text-center hover:border-white/20 transition-all group">
                <div className={`h-20 w-20 rounded-[24px] bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-8 text-white font-bold text-xl shadow-2xl group-hover:scale-110 transition-transform`}>
                  {member.initials}
                </div>
                <h3 className="text-lg font-light tracking-tighter mb-2">{member.name}</h3>
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          className="text-center p-20 border border-white/10 bg-white/[0.02] rounded-[56px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <h2 className="text-4xl font-light tracking-tighter mb-8">Ready to verify with confidence?</h2>
          <p className="text-white/30 mb-12 text-lg font-light">Join hundreds of officers already using VisaAI to make better decisions, faster.</p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/signup" className="px-12 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all active:scale-95 shadow-2xl">
              Get Started
            </Link>
            <Link href="/login" className="px-12 py-5 border border-white/20 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:border-white/50 transition-all">
              Sign In
            </Link>
          </div>
        </motion.div>

      </main>

      <footer className="py-16 text-center border-t border-white/5 bg-black/40 relative z-10">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">© 2026 VISAAI SYSTEMS // INTELLIGENT VERIFICATION ENGINE</p>
      </footer>
    </div>
  );
}
