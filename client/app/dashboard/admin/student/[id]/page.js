"use client";
import { useEffect, useState } from 'react';
import api from '../../../../../lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Mail,
    CreditCard,
    FileText,
    Mic2,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Loader2,
    Check,
    X
} from 'lucide-react';

const NoiseFilter = () => (
  <svg className="pointer-events-none fixed isolate z-50 opacity-[0.02] mix-blend-soft-light w-full h-full">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

export default function StudentDetailPage({ params }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandingTranscript, setExpandingTranscript] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/admin/student/${params.id}`);
                setData(res.data);
            } catch (error) {
                console.error("Error fetching student details", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchData();
    }, [params.id]);

    const updateStatus = async (status) => {
        try {
            await api.put(`/admin/student/${params.id}/status`, { status });
            // Refresh data
            const res = await api.get(`/admin/student/${params.id}`);
            setData(res.data);
        } catch (error) {
            alert("Failed to update status");
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white text-slate-900">
            <div className="flex flex-col items-center gap-6">
               <div className="h-16 w-16 border-t-4 border-blue-600 rounded-full animate-spin shadow-lg" />
               <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono font-bold">Accessing Subject Matrix...</p>
            </div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center gap-6">
            <XCircle className="h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-light tracking-tighter italic font-serif text-slate-500">Subject vector not found.</h1>
            <button onClick={() => router.back()} className="px-8 py-3 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-900">Go Back</button>
        </div>
    );

    const { student, documents, interview, background } = data;

    return (
        <div className="min-h-screen bg-[#02040A] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            <NoiseFilter />

            {/* ════════════ THEME BACKGROUND (NO IMAGE) ════════════ */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#206199]/10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />
            </div>

            <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/5 px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.back()}
                            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-light tracking-tighter text-white">Subject Audit <span className="text-blue-400/40 font-mono text-sm ml-4">#{params.id.slice(-8).toUpperCase()}</span></h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] border transition-all ${student.applicationStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                student.applicationStatus === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                            <div className={`h-1.5 w-1.5 rounded-full ${student.applicationStatus === 'Approved' ? 'bg-emerald-400' : student.applicationStatus === 'Rejected' ? 'bg-red-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
                            {student.applicationStatus}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8 md:p-12 lg:p-16 space-y-12 relative z-10">
                {/* Profile Overview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-10 border border-white/10 bg-black/40 rounded-[48px] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                        <div className="flex items-center gap-8">
                            <div className="h-28 w-28 rounded-[32px] bg-white/5 flex items-center justify-center text-4xl font-light text-white/30 border border-white/10 uppercase italic font-serif">
                                {student.user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-5xl font-light tracking-tighter text-white mb-4 italic font-serif">{student.user?.name}</h1>
                                <div className="flex flex-wrap gap-6 text-base text-white/70 font-light tracking-wide uppercase">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-blue-400/40" />
                                        {student.user?.email}
                                    </div>
                                    <div className="flex items-center gap-2 font-mono">
                                        <CreditCard className="h-4 w-4 text-blue-400/40" />
                                        {student.passportNumber || 'NULL'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-10 bg-white/[0.02] p-8 rounded-[32px] border border-white/5">
                            <div className="text-center md:text-right">
                                <p className="text-xs font-mono font-bold text-white/50 uppercase tracking-[0.2em] mb-3">Risk Matrix</p>
                                <p className={`text-2xl font-light tracking-tighter ${student.riskLevel === 'Low' ? 'text-emerald-400' : student.riskLevel === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
                                    {student.riskLevel} Degree
                                </p>
                            </div>
                            <div className="h-16 w-[1px] bg-white/5" />
                            <div className="text-center md:text-right">
                                <p className="text-xs font-mono font-bold text-white/50 uppercase tracking-[0.2em] mb-3">Integrity Rating</p>
                                <p className="text-5xl font-extralight tracking-tighter text-white">
                                    {student.finalScore || 0}<span className="text-sm font-mono text-white/30 ml-2">/100</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Documents Analysis */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="space-y-6">
                            <h3 className="text-xs font-mono font-bold text-white/50 uppercase tracking-[0.3em] flex items-center gap-3 px-4">
                                <Mic2 className="h-5 w-5 text-blue-400/60" />
                                Aural Credibility Analysis
                            </h3>
                            <div className="border border-white/10 bg-black/20 rounded-[48px] overflow-hidden">
                                {interview ? (
                                    <div className="divide-y divide-white/5">
                                        <div className="p-10 grid grid-cols-1 sm:grid-cols-3 gap-10 bg-white/[0.01]">
                                            <div className="text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
                                                <p className="text-xs font-mono font-bold uppercase text-white/40 tracking-wider mb-3">Intent</p>
                                                <p className="text-3xl font-light text-white tracking-tighter">{interview.geminiAnalysis?.academicIntentScore}%</p>
                                            </div>
                                            <div className="text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
                                                <p className="text-xs font-mono font-bold uppercase text-white/40 tracking-wider mb-3">Credibility</p>
                                                <p className="text-3xl font-light text-white tracking-tighter">{interview.geminiAnalysis?.credibilityScore}%</p>
                                            </div>
                                            <div className="text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
                                                <p className="text-xs font-mono font-bold uppercase text-white/40 tracking-wider mb-3">Finance</p>
                                                <p className="text-3xl font-light text-white tracking-tighter">{interview.geminiAnalysis?.financialUnderstandingScore}%</p>
                                            </div>
                                        </div>
                                        <div className="p-10">
                                            <p className="text-xs font-mono font-bold text-white/50 uppercase tracking-[0.2em] mb-6">Synthesis Interpretation</p>
                                            <div className="p-10 bg-white text-black rounded-[40px] text-lg leading-relaxed font-bold italic shadow-2xl relative font-serif">
                                                <div className="absolute -top-4 -left-4 p-3 bg-black text-white rounded-2xl border border-white/10">
                                                    <Mic2 className="h-5 w-5" />
                                                </div>
                                                "{interview.geminiAnalysis?.explanation || interview.geminiAnalysis?.summary}"
                                            </div>
                                            <div className="mt-10">
                                                <button
                                                    onClick={() => setExpandingTranscript(!expandingTranscript)}
                                                    className="flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
                                                >
                                                    {expandingTranscript ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                    Raw Aural Vector Transcript
                                                </button>
                                                <AnimatePresence>
                                                    {expandingTranscript && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="mt-6 p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-base text-white/70 leading-relaxed font-mono">
                                                                {interview.transcript}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-24 text-center text-white/30 italic font-light tracking-widest text-base">
                                        Subject has not initiated aural simulation.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Background & Actions Sidebar */}
                    <div className="space-y-12">
                        <section className="space-y-6">
                            <h3 className="text-xs font-mono font-bold text-white/40 uppercase tracking-[0.3em] flex items-center gap-3 px-4">
                                <ShieldAlert className="h-5 w-5 text-blue-400/60" />
                                Security Node
                            </h3>
                            <div className="p-8 border border-white/10 bg-black/40 rounded-[40px] space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-light text-white/80 tracking-wide">Global Clearance</span>
                                    <span className={`px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest border ${background?.status === 'Clear' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {background?.status || 'NULL'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-light text-white/80 tracking-wide">Risk Checksum</span>
                                    <span className="text-3xl font-light tracking-tighter text-white">{background?.riskScore || 0}</span>
                                </div>
                                {background?.flags?.length > 0 && (
                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                        <p className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">Active Anomalies</p>
                                        <div className="space-y-3">
                                            {background.flags.map((flag, i) => (
                                                <div key={i} className="flex items-start gap-3 text-sm font-medium text-red-200/90 bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                                                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                                                    {flag}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-xs font-mono font-bold text-white/40 uppercase tracking-[0.3em] px-4">Decision Portal</h3>
                            <div className="p-8 border-2 border-dashed border-white/5 rounded-[40px] space-y-4 bg-white/[0.01]">
                                <button
                                    onClick={() => updateStatus('Approved')}
                                    className="w-full flex items-center justify-center gap-3 py-6 bg-white text-black rounded-3xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] shadow-2xl active:scale-95"
                                >
                                    <Check className="h-4 w-4" /> Finalize Approval
                                </button>
                                <button
                                    onClick={() => updateStatus('Manual Review')}
                                    className="w-full py-4 bg-white/5 text-amber-400 border border-amber-400/20 rounded-3xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-amber-400/10 active:scale-95"
                                >
                                    Secondary Audit
                                </button>
                                <button
                                    onClick={() => updateStatus('Rejected')}
                                    className="w-full py-4 bg-red-500/5 text-red-400 border border-red-500/20 rounded-3xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-red-500/10 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <X className="h-4 w-4" /> Terminate Profile
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
