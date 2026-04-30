"use client";
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Mic2,
    ShieldCheck,
    ArrowRight,
    Globe,
    Lock,
    CheckCircle2,
    ScanLine,
    Activity,
    Zap,
    Sparkles,
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
    }),
};

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white text-foreground">
            <Navbar />

            {/* ═══════════════════ HERO ═══════════════════ */}
            <section className="relative pt-28 pb-24 md:pt-40 md:pb-36 overflow-hidden">
                {/* subtle background blobs */}
                <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-100/30 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-slate-100/60 to-blue-50/40 blur-3xl" />
                </div>

                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        {/* Left column — copy */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            className="flex-1 text-left max-w-2xl"
                        >
                            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent border border-border mb-7">
                                <Sparkles className="h-3.5 w-3.5 text-foreground" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                                    AI-Powered Platform
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={fadeUp}
                                custom={1}
                                className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-7"
                            >
                                Smarter Visa{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-400">
                                    Verification
                                </span>{' '}
                                for Everyone.
                            </motion.h1>

                            <motion.p
                                variants={fadeUp}
                                custom={2}
                                className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl"
                            >
                                Streamline international student verifications with advanced document OCR, psychometric voice interviews, and automated background checks — all in one platform.
                            </motion.p>

                            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4">
                                <Link href="/signup" className="btn-primary h-14 px-8 gap-3 text-[15px] group shadow-lg shadow-foreground/10">
                                    Get Started Free
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link href="#how-it-works" className="btn-outline h-14 px-8 text-[15px]">
                                    See how it works
                                </Link>
                            </motion.div>

                            <motion.div variants={fadeUp} custom={4} className="mt-12 flex items-center gap-5">
                                <div className="flex -space-x-2.5">
                                    {['bg-indigo-200', 'bg-sky-200', 'bg-emerald-200', 'bg-amber-200'].map((bg, i) => (
                                        <div key={i} className={`h-9 w-9 rounded-full border-[3px] border-white ${bg} flex items-center justify-center text-[10px] font-bold text-slate-600`}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-bold text-foreground">50,000+</span> students verified
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Right column — hero image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex-1 relative w-full max-w-lg lg:max-w-none"
                        >
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/40 border border-border/50 bg-white">
                                <Image
                                    src="/hero-visa.png"
                                    alt="EduVerify AI platform interface"
                                    width={700}
                                    height={700}
                                    className="w-full h-auto"
                                    priority
                                />
                            </div>
                            {/* floating accents */}
                            <div className="absolute -top-6 -right-6 w-48 h-48 bg-blue-100/50 rounded-full blur-2xl animate-float" />
                            <div className="absolute -bottom-8 -left-8 w-56 h-56 bg-indigo-50/60 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ TRUST BAR ═══════════════════ */}
            <section className="py-10 border-y border-border bg-accent/40">
                <div className="container mx-auto px-6">
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground mb-7">
                        Trusted by leading institutions worldwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-30">
                        {['MIT', 'Stanford', 'Oxford', 'Cambridge', 'NUS'].map((name) => (
                            <span key={name} className="text-xl md:text-2xl font-black tracking-tight select-none">
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
            <section id="how-it-works" className="py-28 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">
                            The Process
                        </p>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            From application to approval, <span className="text-muted-foreground">effortlessly.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Upload Documents',
                                desc: 'Submit your passport, transcripts, and academic records. Our OCR engine extracts and validates every data point instantly.',
                                icon: ScanLine,
                            },
                            {
                                step: '02',
                                title: 'AI Interview',
                                desc: 'Complete a brief voice interview. Gemini AI analyzes speech patterns, intent, and credibility in real-time.',
                                icon: Mic2,
                            },
                            {
                                step: '03',
                                title: 'Get Verified',
                                desc: 'Receive a comprehensive risk assessment and background verification report. Fast-tracked decisions in minutes.',
                                icon: ShieldCheck,
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                                whileHover={{ y: -6 }}
                                className="minimal-card p-10 relative overflow-hidden group cursor-default"
                            >
                                {/* Step number watermark */}
                                <span className="absolute top-4 right-5 text-7xl font-black text-foreground/[0.03] group-hover:text-foreground/[0.07] transition-colors select-none">
                                    {item.step}
                                </span>
                                <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mb-7 group-hover:scale-110 transition-transform">
                                    <item.icon className="h-7 w-7 text-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-[15px]">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════ FEATURES ═══════════════════ */}
            <section id="features" className="py-28 bg-accent/30">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        {/* Feature grid */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex-1 grid grid-cols-2 gap-5"
                        >
                            {[
                                { icon: Zap, label: 'Real-time OCR', bg: 'bg-blue-50 hover:bg-blue-100/70' },
                                { icon: Globe, label: 'Global Checks', bg: 'bg-emerald-50 hover:bg-emerald-100/70' },
                                { icon: Lock, label: 'Encrypted Data', bg: 'bg-slate-100 hover:bg-slate-200/70' },
                                { icon: Activity, label: 'Risk Scoring', bg: 'bg-orange-50 hover:bg-orange-100/70' },
                            ].map((f, i) => (
                                <div
                                    key={i}
                                    className={`rounded-2xl p-8 text-center flex flex-col items-center gap-4 border border-transparent transition-all duration-300 cursor-default ${f.bg}`}
                                >
                                    <f.icon className="h-8 w-8 text-foreground" />
                                    <span className="font-bold text-xs uppercase tracking-widest">
                                        {f.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Copy */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex-1 space-y-7"
                        >
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                Built for speed,{' '}
                                <span className="text-muted-foreground">designed for trust.</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our platform combines multi-modal AI analysis with global security compliance, reducing verification times by up to 85% while maintaining the highest accuracy standards.
                            </p>
                            <ul className="space-y-4 pt-2">
                                {[
                                    'Automated Passport & Academic Extraction',
                                    'Advanced Psychometric Voice Analysis',
                                    'Multi-Regional Background Verification',
                                    'Enterprise API Integration',
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[15px] font-medium">
                                        <CheckCircle2 className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4">
                                <Link href="/signup" className="btn-primary h-12 px-8 gap-2 text-sm shadow-lg shadow-foreground/10">
                                    Start Verifying <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ ABOUT / CTA ═══════════════════ */}
            <section id="about" className="py-28 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">
                            About EduVerify AI
                        </p>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                            The future of visa verification is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">intelligent.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                            We believe that no student should be held back by slow, opaque verification processes.
                            EduVerify AI combines cutting-edge machine learning with a human-centered approach to deliver
                            fast, fair, and transparent decisions.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/signup" className="btn-primary h-14 px-10 text-[15px] gap-2 group shadow-lg shadow-foreground/10">
                                Create Free Account
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link href="/login" className="btn-secondary h-14 px-10 text-[15px]">
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════ FOOTER ═══════════════════ */}
            <footer className="bg-foreground text-white pt-20 pb-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        {/* Brand */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center">
                                    <span className="text-foreground font-bold text-lg">E</span>
                                </div>
                                <span className="text-lg font-extrabold tracking-tight">EduVerify</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                Empowering the next generation of international students through secure, fast, AI-driven verification.
                            </p>
                        </div>

                        {/* Product */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Product</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">API Docs</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Company</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Stay Updated</h4>
                            <p className="text-sm text-slate-400">Subscribe for the latest in AI verification.</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="you@email.com"
                                    className="h-10 flex-1 px-4 text-sm rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                                />
                                <button className="h-10 w-10 flex items-center justify-center bg-white text-foreground rounded-lg hover:scale-105 transition-transform shrink-0">
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
                        <p className="text-xs text-slate-500">
                            © 2026 EduVerify AI Inc. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-xs text-slate-500">
                            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
