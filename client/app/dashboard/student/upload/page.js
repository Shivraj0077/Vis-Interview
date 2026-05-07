"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    UploadCloud,
    Mic2,
    Compass,
    LogOut,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    ShieldCheck,
    Brain,
    Sparkles,
    ArrowRight,
    Eye,
} from 'lucide-react';
import api from '../../../../lib/api';

const NoiseFilter = () => (
  <svg className="pointer-events-none fixed isolate z-50 opacity-[0.02] mix-blend-soft-light w-full h-full">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

const DOC_TYPES = [
    { label: 'Auto-Identify (AI)', value: 'Auto' },
    { label: 'Passport', value: 'Passport' },
    { label: 'I-20 Form', value: 'I-20' },
    { label: 'Bank Statement', value: 'Bank Statement' },
    { label: 'Offer Letter', value: 'Offer Letter' },
    { label: 'Resume / CV', value: 'Resume' },
    { label: 'DS-160', value: 'DS-160' },
];

const ANALYSIS_STEPS = [
    "Initializing neural link...",
    "Decoding vector stream...",
    "Identifying entity patterns...",
    "Cross-referencing global databases...",
    "Validating logic integrity...",
    "Finalizing integrity rating..."
];

export default function UploadPage() {
    const [files, setFiles] = useState([]);
    const [type, setType] = useState('Auto');
    const [phase, setPhase] = useState('upload'); // 'upload' | 'analyzing' | 'results'
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [results, setResults] = useState([]);
    const [crossFlags, setCrossFlags] = useState([]);
    const router = useRouter();
    const pathname = usePathname();
    const fileInputRef = useRef(null);

    const navItems = [
        { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
        { name: 'Upload Documents', href: '/dashboard/student/upload', icon: UploadCloud },
        { name: 'AI Interview', href: '/dashboard/student/interview', icon: Mic2 },
        { name: 'Resources', href: '/dashboard/student/resources', icon: Compass },
    ];

    const handleUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) return;

        setPhase('analyzing');
        setAnalysisProgress(0);
        setAnalysisStep(0);

        const interval = setInterval(() => {
            setAnalysisProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                const next = prev + (100 / (ANALYSIS_STEPS.length * 5));
                setAnalysisStep(Math.min(Math.floor(next / (100 / ANALYSIS_STEPS.length)), ANALYSIS_STEPS.length - 1));
                return next;
            });
        }, 100);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        formData.append('type', type);

        try {
            const res = await api.post('/student/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            clearInterval(interval);
            setAnalysisProgress(100);
            setAnalysisStep(ANALYSIS_STEPS.length - 1);
            
            setTimeout(() => {
                setResults(res.data.documents || []);
                setCrossFlags(res.data.crossFlags || []);
                setPhase('results');
            }, 500);
        } catch (error) {
            clearInterval(interval);
            alert("Upload failed: " + (error.response?.data?.message || error.message));
            setPhase('upload');
        }
    };

    const handleReset = () => {
        setFiles([]);
        setResults([]);
        setCrossFlags([]);
        setPhase('upload');
    };

    return (
        <div className="h-screen overflow-hidden bg-[#02040A] text-white flex font-sans selection:bg-blue-500/30">
            <NoiseFilter />

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-40" style={{ backgroundImage: "url('/ascii-art.png')" }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                <div className="absolute inset-0 bg-[#206199]/20" />
            </div>

            {/* Sidebar */}
            <aside className="w-80 bg-black/60 border-r border-white/5 p-10 flex flex-col hidden lg:flex z-10 relative backdrop-blur-xl">
                <Link href="/" className="flex items-center gap-4 mb-16 px-2">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
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
                                className={`flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white text-black' : 'text-white/60 hover:text-blue-200 hover:bg-white/5'}`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-base font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto pt-10 border-t border-white/5">
                    <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="flex items-center gap-4 py-4 px-6 w-full rounded-2xl text-red-400/60 hover:text-red-400 font-mono text-xs font-bold uppercase tracking-widest">
                        <LogOut className="h-5 w-5" />
                        <span>Terminate</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto z-10 relative">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-10 border-b border-white/5 pb-8">
                        <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">Data Synchronizer</div>
                        <h1 className="text-5xl font-light tracking-tighter text-white mb-2 italic font-serif leading-none">Ingestion</h1>
                    </header>

                    <AnimatePresence mode="wait">
                        {phase === 'upload' && (
                            <motion.div key="u" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <div className="p-12 md:p-16 bg-white rounded-[40px] shadow-2xl relative overflow-hidden">
                                    <form onSubmit={handleUpload} className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500 ml-4 font-bold">Document Category</label>
                                            <select
                                                className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-3xl focus:border-blue-500/50 outline-none appearance-none text-slate-900 text-xl font-light italic font-serif"
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                            >
                                                {DOC_TYPES.map((docType) => (
                                                    <option key={docType.value} value={docType.value}>{docType.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500 ml-4 font-bold">Vector Source</label>
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="mt-1 flex justify-center px-8 pt-10 pb-10 border-2 border-dashed border-slate-100 rounded-[32px] hover:border-blue-500/30 transition-all cursor-pointer relative bg-slate-50/50 group"
                                            >
                                                <div className="space-y-4 text-center relative z-10">
                                                    <div className="mx-auto h-20 w-20 rounded-[24px] bg-white flex items-center justify-center shadow-xl border border-slate-100 group-hover:scale-110 transition-transform">
                                                        <UploadCloud className="h-8 w-8 text-slate-300 group-hover:text-blue-500" />
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-2xl tracking-tighter italic font-serif text-slate-900">
                                                            {files.length > 0 ? `${files.length} vectors selected` : 'Select Vector Files'}
                                                        </span>
                                                        {!files.length && <p className="mt-2 text-slate-500 text-base font-light">or drop into stream</p>}
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            multiple
                                                            onChange={(e) => setFiles(Array.from(e.target.files))}
                                                            className="hidden"
                                                        />
                                                    </div>
                                                </div>
                                                {files.length > 0 && (
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); setFiles([]); }} className="absolute top-8 right-8 p-3 rounded-full bg-white hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all z-20 shadow-lg border border-slate-100">
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <button type="submit" disabled={files.length === 0} className="w-full h-16 bg-slate-900 text-white rounded-[20px] font-bold uppercase tracking-[0.3em] text-xs hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-30">
                                            Execute Analysis
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {phase === 'analyzing' && (
                            <motion.div key="a" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="p-16 bg-white rounded-[40px] text-center shadow-2xl">
                                <div className="max-w-md mx-auto">
                                    <div className="relative mx-auto h-24 w-24 mb-10">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-[40px] bg-blue-50 border-2 border-blue-100" />
                                        <div className="absolute inset-0 flex items-center justify-center"><Brain className="h-14 w-14 text-blue-600" /></div>
                                    </div>
                                    <h2 className="text-4xl font-light tracking-tighter text-slate-900 mb-4 italic font-serif">Synthesizing...</h2>
                                    <div className="w-full bg-slate-50 rounded-full h-1.5 mb-8 overflow-hidden border border-slate-100">
                                        <motion.div className="h-full bg-blue-600" initial={{ width: '0%' }} animate={{ width: `${analysisProgress}%` }} />
                                    </div>
                                    <p className="text-[10px] font-mono text-blue-600 uppercase tracking-[0.5em] mb-6 font-bold">{Math.round(analysisProgress)}% Mapped</p>
                                    <p className="text-xs text-slate-300 font-mono tracking-[0.2em] uppercase font-bold">{ANALYSIS_STEPS[analysisStep]}</p>
                                </div>
                            </motion.div>
                        )}

                        {phase === 'results' && (
                            <motion.div key="r" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                {results.length > 0 ? results.map((res, idx) => (
                                    <div key={idx} className="space-y-10">
                                        <div className="p-12 bg-white rounded-[40px] shadow-2xl relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                                <div className="relative">
                                                    <svg className="h-32 w-32 transform -rotate-90" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f8fafc" strokeWidth="6" />
                                                        <motion.circle cx="50" cy="50" r="45" fill="none" stroke={res.isValid ? '#10B981' : '#EF4444'} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 45}`} initial={{ strokeDashoffset: 2 * Math.PI * 45 }} animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - (res.ocrConfidence || 0) / 100) }} transition={{ duration: 1.5 }} />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-5xl font-extralight tracking-tighter text-slate-900 leading-none">{Math.round(res.ocrConfidence || 0)}</span>
                                                        <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest mt-1">Integrity</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h2 className="text-4xl font-light tracking-tighter text-slate-900 italic font-serif mb-4">{res.isValid ? 'Verified' : 'Anomalies Detected'}</h2>
                                                    <div className="flex gap-4 justify-center md:justify-start">
                                                        <span className={`px-6 py-2 rounded-full text-[10px] font-mono font-bold ${res.isValid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{res.isValid ? 'VALIDATED' : 'FLAGGED'}</span>
                                                        <span className="px-6 py-2 rounded-full text-[10px] font-mono bg-slate-50 text-slate-400 border border-slate-100 font-bold">{res.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {res.validationFlags?.length > 0 && (
                                            <div className="p-12 bg-red-50 border border-red-100 rounded-[48px]">
                                                <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-red-600 mb-8 font-bold">Flagged Vectors</h3>
                                                <div className="space-y-4">
                                                    {res.validationFlags.map((flag, i) => (
                                                        <div key={i} className="p-8 rounded-3xl bg-white border border-red-100 flex items-start gap-5">
                                                            <div className="h-2 w-2 rounded-full bg-red-500 mt-2.5 shrink-0" />
                                                            <p className="text-lg font-light text-red-900 italic font-serif">"{flag}"</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-white rounded-[40px] shadow-xl border border-slate-50 overflow-hidden">
                                            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                                <h3 className="text-lg font-light italic font-serif text-slate-900">Extracted Metadata</h3>
                                            </div>
                                            <div className="p-8">
                                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {Object.entries(res.extractedData || {}).map(([key, value]) => (
                                                        <div key={key} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                            <dt className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 mb-2 font-bold">{key}</dt>
                                                            <dd className="text-lg font-light text-slate-900 italic font-serif">{value?.toString() || 'NULL'}</dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                )) : null}

                                {crossFlags.length > 0 && (
                                    <div className="p-12 bg-amber-50 border border-amber-100 rounded-[48px]">
                                        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-amber-600 mb-8 font-bold">Consistency Audit</h3>
                                        <div className="space-y-4">
                                            {crossFlags.map((flag, i) => (
                                                <div key={i} className="p-8 rounded-3xl bg-white border border-amber-100 flex items-start gap-5">
                                                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-2.5 shrink-0" />
                                                    <p className="text-lg font-light text-amber-900 italic font-serif">"{flag}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-8 pt-12 pb-20">
                                    <button onClick={handleReset} className="flex-1 h-20 bg-slate-900 text-white rounded-full font-bold uppercase tracking-[0.3em] text-sm hover:bg-blue-600 shadow-2xl">New Sequence</button>
                                    <Link href="/dashboard/student" className="flex-1 h-20 bg-white border border-slate-100 rounded-full font-bold uppercase tracking-[0.3em] text-sm flex items-center justify-center text-slate-300 hover:text-blue-600 shadow-xl">Exit Interface</Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
