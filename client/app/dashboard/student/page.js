"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    UploadCloud,
    Mic2,
    Compass,
    LogOut,
    CheckCircle2,
    Clock,
    ArrowRight,
    ShieldCheck,
    TrendingUp,
    FileCheck,
    Lightbulb
} from 'lucide-react';
import api from '../../../lib/api';

const NoiseFilter = () => (
  <svg className="pointer-events-none fixed isolate z-50 opacity-[0.02] mix-blend-soft-light w-full h-full">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

export default function StudentDashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/student/profile');
                setProfile(data.student);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const navItems = [
        { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
        { name: 'Upload Documents', href: '/dashboard/student/upload', icon: UploadCloud },
        { name: 'AI Interview', href: '/dashboard/student/interview', icon: Mic2 },
        { name: 'Resources', href: '/dashboard/student/resources', icon: Compass },
    ];

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white text-slate-900">
            <div className="flex flex-col items-center gap-6">
               <div className="h-16 w-16 border-t-4 border-blue-600 rounded-full animate-spin shadow-lg" />
               <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono font-bold">Synchronizing Neural Profile...</p>
            </div>
        </div>
    );

    if (!profile) return null;

    return (
        <div className="h-screen overflow-hidden bg-[#02040A] text-white flex font-sans selection:bg-blue-500/30">
            <NoiseFilter />

            {/* ════════════ BACKGROUND (FIXED) ════════════ */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-40"
                    style={{ backgroundImage: "url('/ascii-art.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                <div className="absolute inset-0 bg-[#206199]/20" />
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />
            </div>

            {/* Sidebar */}
            <aside className="w-80 bg-black/60 border-r border-white/5 p-10 flex flex-col hidden lg:flex z-10 relative backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
                
                <Link href="/" className="flex items-center gap-4 mb-16 px-2 hover:opacity-80 transition-opacity">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <span className="text-black font-bold text-xl tracking-tighter">V</span>
                    </div>
                    <span className="text-2xl font-light tracking-tighter text-white">VisaAI</span>
                </Link>

                <nav className="flex-1 space-y-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-white text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
                                    : 'text-white/60 hover:text-blue-200 hover:bg-white/5 font-medium'
                                    }`}
                            >
                                {isActive && <motion.div layoutId="navGlow" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full" />}
                                <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-black' : 'text-white/50 group-hover:text-blue-200'}`} />
                                <span className="text-base font-medium tracking-wide">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto pt-10 border-t border-white/5">
                    <button
                        onClick={() => { localStorage.clear(); router.push('/login'); }}
                        className="flex items-center gap-4 py-4 px-6 w-full rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-xs font-mono font-bold tracking-widest uppercase">Terminate</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto"
                >
                    <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-8">
                        <div>
                            <div className="text-xs font-mono text-blue-400 uppercase tracking-[0.3em] mb-2 font-bold">Neural Command Center</div>
                            <h1 className="text-5xl font-light tracking-tighter text-white mb-2 italic font-serif leading-none">Portal <span className="italic font-serif text-blue-200">Alpha</span></h1>
                            <p className="text-white/80 text-xl font-light tracking-tight">Active Session: {profile.name} // Status: <span className="text-emerald-400 font-bold">Optimal</span></p>
                        </div>
                        <div className="hidden md:block text-right">
                            <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center ml-auto mb-4 bg-white/5">
                                <ShieldCheck className="h-4 w-4 text-blue-400" />
                            </div>
                            <p className="text-xs font-mono text-white/50 font-bold uppercase tracking-[0.2em]">Integrity Key</p>
                            <p className="text-sm font-mono text-blue-400/80 uppercase">0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                        </div>
                    </header>

                    {/* Status Cards (Converted to White) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                          { label: "Process Vector", value: profile.applicationStatus, icon: ShieldCheck, color: "blue" },
                          { label: "Inertia Level", value: `${profile.riskLevel} Risk`, icon: TrendingUp, color: profile.riskLevel === 'Low' ? 'emerald' : profile.riskLevel === 'High' ? 'red' : 'orange' },
                          { label: "Integrity Rating", value: profile.finalScore, icon: FileCheck, color: "slate", unit: "pts" }
                        ].map((stat, i) => (
                          <div key={i} className="p-10 bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                              <stat.icon className={`absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.03] text-black group-hover:opacity-[0.08] transition-opacity`} />
                              <h3 className="text-slate-500 text-xs font-mono font-bold uppercase tracking-[0.2em] mb-8">{stat.label}</h3>
                              <div className="flex items-baseline gap-3">
                                  {stat.label !== "Integrity Rating" && <div className={`h-2.5 w-2.5 rounded-full bg-${stat.color}-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] mb-1.5`} />}
                                  <p className={`text-4xl font-light tracking-tighter text-slate-900 ${stat.label === 'Integrity Rating' ? 'text-6xl font-extralight' : ''}`}>{stat.value}</p>
                                  {stat.unit && <span className="text-slate-500 text-base font-mono font-medium tracking-widest">{stat.unit}</span>}
                              </div>
                          </div>
                        ))}
                    </div>

                    {/* Progress & Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                        {/* Tracker (White Card) */}
                        <div className="lg:col-span-2 p-10 bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden h-fit">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-3xl font-light tracking-tighter text-slate-900 italic font-serif">Sequence Tracker</h3>
                                {profile.documentsUploaded >= 3 && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await api.post('/student/analyze-all');
                                                window.location.reload();
                                            } catch (err) { alert("Calibration error."); }
                                        }}
                                        className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 border border-slate-200 px-6 py-3 rounded-full transition-all hover:bg-slate-50"
                                    >
                                        Execute Review
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-0 relative">
                                <div className="absolute left-[43px] top-[27px] bottom-[27px] w-px bg-slate-200 z-0"></div>
                                {[
                                    { icon: UploadCloud, title: 'Neural Data Ingestion', sub: 'Passport & Financial records', done: profile.documentsUploaded >= 6, label: `${profile.documentsUploaded} / 6` },
                                    { icon: Mic2, title: 'AI Interview', sub: 'Aural verification module', done: profile.interviewStatus === 'Completed', label: profile.interviewStatus || 'Standby' },
                                    { icon: ShieldCheck, title: 'Global Record Validation', sub: 'Background checksum', done: profile.backgroundScore > 0, label: profile.backgroundScore > 0 ? (profile.backgroundScore >= 20 ? 'Verified' : 'Manual Review') : 'Standby' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-6 px-4 group relative z-10 transition-all duration-500 hover:bg-slate-50/50 rounded-3xl">
                                        <div className="flex items-center gap-8">
                                            <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center transition-all shadow-sm ${item.done ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-4 ring-white' : 'bg-white border border-slate-200 text-slate-400 ring-4 ring-white'}`}>
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-light tracking-tight text-slate-900 mb-1">{item.title}</p>
                                                <p className="text-sm text-slate-500 font-light">{item.sub}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`text-sm font-mono font-bold uppercase tracking-[0.1em] ${item.done ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {item.label}
                                            </span>
                                            {item.done ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Clock className="h-6 w-6 text-slate-200 animate-pulse" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Side Actions */}
                        <div className="space-y-8">
                            {profile.recommendations?.length > 0 && (
                                <div className="p-8 bg-blue-50 border border-blue-100 rounded-[32px] relative overflow-hidden">
                                    <h3 className="text-lg font-bold tracking-tight text-blue-900 mb-6 flex items-center gap-3">
                                        <Lightbulb className="h-5 w-5 text-blue-600" />
                                        Neural Insights
                                    </h3>
                                    <div className="space-y-4">
                                        {profile.recommendations.map((rec, i) => (
                                            <div key={i} className="flex items-start gap-3 text-sm text-blue-900 leading-relaxed font-medium">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                <p>{rec}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Horizontal Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link href="/dashboard/student/upload" className="group relative block overflow-hidden rounded-[40px] bg-slate-900 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(59,130,246,0.2)]">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl group-hover:bg-blue-500/30 transition-colors"></div>
                            
                            <div className="h-16 w-16 bg-white/10 rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/20 transition-colors relative z-10">
                                <UploadCloud className="h-8 w-8 text-white" />
                            </div>
                            
                            <h3 className="text-3xl font-light tracking-tighter mb-4 text-white relative z-10 italic font-serif">Ingest Data</h3>
                            <p className="text-white/60 text-lg mb-10 leading-relaxed relative z-10 font-light">Neural document synchronization and OCR validation.</p>
                            
                            <div className="flex items-center gap-3 text-sm font-mono font-bold uppercase tracking-[0.2em] text-white relative z-10">
                                Execute Sequence <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>

                        <Link href="/dashboard/student/interview" className="group relative block overflow-hidden rounded-[40px] bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(59,130,246,0.15)] border border-slate-100">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
                            
                            <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-blue-50 transition-colors relative z-10">
                                <Mic2 className="h-8 w-8 text-slate-800" />
                            </div>
                            
                            <h3 className="text-3xl font-light tracking-tighter text-slate-900 mb-4 italic font-serif relative z-10">AI Interview</h3>
                            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-light relative z-10">Auditory verification engine and behavioral synthesis.</p>
                            
                            <div className="flex items-center gap-3 text-sm font-mono font-bold uppercase tracking-[0.2em] text-slate-800 group-hover:text-blue-600 transition-colors relative z-10">
                                Initialize <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>

                        <Link href="/dashboard/student/resources" className="group relative block overflow-hidden rounded-[40px] bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(16,185,129,0.15)] border border-slate-100">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
                            
                            <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-emerald-50 transition-colors relative z-10">
                                <ShieldCheck className="h-8 w-8 text-slate-800" />
                            </div>
                            
                            <h3 className="text-3xl font-light tracking-tighter text-slate-900 mb-4 italic font-serif relative z-10">Global Record</h3>
                            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-light relative z-10">Global identity validation and background clearance.</p>
                            
                            <div className="flex items-center gap-3 text-sm font-mono font-bold uppercase tracking-[0.2em] text-slate-800 group-hover:text-emerald-600 transition-colors relative z-10">
                                Access Portal <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
