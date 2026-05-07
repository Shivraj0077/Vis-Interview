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
    X,
    MessageSquare,
    FileCheck,
    TrendingUp,
    Shield,
    History,
    AlertOctagon,
    Target,
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
    const [activeTab, setActiveTab] = useState('interview'); // 'interview' | 'documents' | 'background'
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
        <div className="h-screen flex items-center justify-center bg-[#02040A] text-white">
            <div className="flex flex-col items-center gap-6">
               <div className="h-16 w-16 border-t-4 border-blue-600 rounded-full animate-spin shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
               <p className="text-xs uppercase tracking-[0.3em] text-blue-400 font-mono font-bold">Synchronizing Neural Matrix...</p>
            </div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen bg-[#02040A] text-white flex flex-col items-center justify-center gap-6">
            <XCircle className="h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-light tracking-tighter italic font-serif text-slate-500">Subject vector not found.</h1>
            <button onClick={() => router.back()} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Go Back</button>
        </div>
    );

    const { student, documents, interview, background } = data;

    return (
        <div className="min-h-screen bg-[#02040A] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden pb-20">
            <NoiseFilter />

            {/* ════════════ THEME BACKGROUND ════════════ */}
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
                            <h1 className="text-2xl font-light tracking-tighter text-white uppercase italic">Subject Audit <span className="text-blue-400/40 font-mono text-xs ml-4 tracking-[0.3em]">ID: {params.id.slice(-8).toUpperCase()}</span></h1>
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
                        <div className="flex items-center gap-10 bg-white/[0.02] p-8 rounded-[32px] border border-white/5 shadow-2xl">
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

                <div className="flex gap-4 p-2 bg-white/[0.03] border border-white/5 rounded-3xl w-fit">
                    {[
                        { id: 'interview', icon: Mic2, label: 'Interview' },
                        { id: 'documents', icon: FileCheck, label: 'Documents' },
                        { id: 'background', icon: Shield, label: 'Security' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-2xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {activeTab === 'interview' && (
                                <motion.div 
                                    key="interview" 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: 20 }} 
                                    className="space-y-12"
                                >
                                    <section className="space-y-6">
                                        <h3 className="text-xs font-mono font-bold text-white/50 uppercase tracking-[0.3em] flex items-center gap-3 px-4">
                                            <TrendingUp className="h-5 w-5 text-blue-400/60" />
                                            Analytic Synthesis
                                        </h3>
                                        <div className="border border-white/10 bg-black/20 rounded-[48px] overflow-hidden">
                                            {interview ? (
                                                <div className="divide-y divide-white/5">
                                                    <div className="p-10 grid grid-cols-1 sm:grid-cols-3 gap-10 bg-white/[0.01]">
                                                        {[
                                                            { label: 'Intent', score: interview.geminiAnalysis?.academicIntentScore },
                                                            { label: 'Credibility', score: interview.geminiAnalysis?.credibilityScore },
                                                            { label: 'Finance', score: interview.geminiAnalysis?.financialUnderstandingScore }
                                                        ].map((item, i) => (
                                                            <div key={i} className="text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
                                                                <p className="text-xs font-mono font-bold uppercase text-white/40 tracking-wider mb-3">{item.label}</p>
                                                                <p className="text-3xl font-light text-white tracking-tighter">{item.score || 0}%</p>
                                                            </div>
                                                        ))}
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
                                                                        <div className="mt-6 p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-sm text-white/70 leading-relaxed font-mono whitespace-pre-wrap">
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

                                    {interview?.questions?.length > 0 && (
                                        <section className="space-y-6">
                                            <h3 className="text-xs font-mono font-bold text-white/50 uppercase tracking-[0.3em] flex items-center gap-3 px-4">
                                                <MessageSquare className="h-5 w-5 text-blue-400/60" />
                                                Interrogative Sequence Analysis
                                            </h3>
                                            <div className="space-y-6">
                                                {interview.questions.map((q, i) => (
                                                    <div key={i} className="p-10 border border-white/10 bg-black/40 rounded-[48px] space-y-8 relative overflow-hidden group">
                                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent group-hover:via-blue-500/30 transition-all" />
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-mono text-xs font-bold text-white/40 border border-white/10">
                                                                    {i + 1}
                                                                </div>
                                                                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">Phase {Math.floor(i / 1.5) + 1}</span>
                                                            </div>
                                                            <div className={`px-6 py-2 rounded-full text-[10px] font-mono font-bold border ${q.evaluation?.score > 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : q.evaluation?.score > 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                                INTEGRITY: {q.evaluation?.score || 0}%
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-4">
                                                            <p className="text-2xl font-light tracking-tight text-white leading-tight italic font-serif">"{q.question}"</p>
                                                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6">
                                                                <div className="space-y-2">
                                                                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">Candidate Response</p>
                                                                    <p className="text-base font-light text-white/70 leading-relaxed italic">"{q.answerText || 'Transcript unavailable.'}"</p>
                                                                </div>
                                                                <div className="pt-6 border-t border-white/5 space-y-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <Target className="h-4 w-4 text-blue-400/60" />
                                                                        <p className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] font-bold">Officer Assessment</p>
                                                                    </div>
                                                                    <p className="text-sm text-blue-200/60 leading-relaxed italic">"{q.evaluation?.feedback || 'Synthesizing interpretation...'}"</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'documents' && (
                                <motion.div 
                                    key="documents" 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: 20 }} 
                                    className="space-y-12"
                                >
                                    <section className="space-y-6">
                                        <h3 className="text-xs font-mono font-bold text-white/50 uppercase tracking-[0.3em] flex items-center gap-3 px-4">
                                            <FileCheck className="h-5 w-5 text-emerald-400/60" />
                                            Document Logic Repository
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            {documents?.length > 0 ? documents.map((doc, i) => (
                                                <div key={i} className="p-10 border border-white/10 bg-black/40 rounded-[48px] flex flex-col md:flex-row gap-10 items-start group relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
                                                    <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform">
                                                        <FileText className={`h-10 w-10 ${doc.isValid ? 'text-emerald-400' : 'text-red-400'}`} />
                                                    </div>
                                                    <div className="flex-1 space-y-6 w-full">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="text-2xl font-light tracking-tight italic font-serif">{doc.type}</h4>
                                                            <div className="flex items-center gap-4">
                                                                <span className={`px-4 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border ${doc.isValid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                                    {doc.isValid ? 'VALIDATED' : 'FLAGGED'}
                                                                </span>
                                                                <a href={doc.filePath} target="_blank" className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                            {Object.entries(doc.extractedData || {}).map(([k, v]) => (
                                                                <div key={k} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/item hover:bg-white/[0.04] transition-all">
                                                                    <p className="text-[9px] font-mono text-white/20 uppercase font-bold tracking-widest mb-1 group-hover/item:text-emerald-400/40 transition-colors">{k}</p>
                                                                    <p className="text-sm text-white/80 font-light truncate">{v?.toString() || 'NULL'}</p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {doc.validationFlags?.length > 0 && (
                                                            <div className="pt-4 space-y-3">
                                                                <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">Logic Failures Detected</p>
                                                                {doc.validationFlags.map((f, fi) => (
                                                                    <div key={fi} className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-xs font-medium text-red-200/80 italic">
                                                                        <AlertOctagon className="h-4 w-4 shrink-0 text-red-500" />
                                                                        {f}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-24 text-center text-white/20 italic font-light tracking-widest bg-white/[0.02] border border-dashed border-white/10 rounded-[48px]">
                                                    No vectors uploaded for this subject.
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </motion.div>
                            )}

                            {activeTab === 'background' && (
                                <motion.div 
                                    key="background" 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: 20 }} 
                                    className="space-y-12"
                                >
                                    <section className="space-y-6">
                                        <h3 className="text-xs font-mono font-bold text-white/50 uppercase tracking-[0.3em] flex items-center gap-3 px-4">
                                            <ShieldAlert className="h-5 w-5 text-blue-400/60" />
                                            Security Node Analysis
                                        </h3>
                                        <div className="p-12 border border-white/10 bg-black/40 rounded-[48px] space-y-12 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="space-y-4">
                                                    <p className="text-xs font-mono text-white/30 uppercase tracking-[0.3em] font-bold">Global Clearance Status</p>
                                                    <div className={`p-8 rounded-[32px] border flex items-center justify-between ${background?.status === 'Clear' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                                                        <span className="text-3xl font-light tracking-tighter uppercase italic">{background?.status || 'PENDING'}</span>
                                                        <Shield className="h-10 w-10 opacity-20" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="text-xs font-mono text-white/30 uppercase tracking-[0.3em] font-bold">Anomalous Data points</p>
                                                    <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] flex items-center justify-between">
                                                        <span className="text-5xl font-extralight tracking-tighter text-white">{background?.riskScore || 0}</span>
                                                        <History className="h-10 w-10 text-white/10" />
                                                    </div>
                                                </div>
                                            </div>

                                            {background?.flags?.length > 0 && (
                                                <div className="space-y-6 pt-12 border-t border-white/5">
                                                    <p className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-3">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        Active Security Anomalies
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {background.flags.map((flag, i) => (
                                                            <div key={i} className="flex items-start gap-4 p-6 rounded-3xl bg-red-500/5 border border-red-500/10 text-sm font-medium text-red-200/90 italic font-serif">
                                                                <div className="h-2 w-2 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse" />
                                                                {flag}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-12">
                        <section className="space-y-6">
                            <h3 className="text-xs font-mono font-bold text-white/40 uppercase tracking-[0.3em] px-4">System Recommendations</h3>
                            <div className="p-10 border border-white/10 bg-black/40 rounded-[48px] space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
                                {student.recommendations?.length > 0 ? (
                                    <div className="space-y-4">
                                        {student.recommendations.map((rec, i) => (
                                            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-200/70 font-light leading-relaxed">
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400/60" />
                                                {rec}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm italic text-white/20 text-center py-4">No recommendations generated.</p>
                                )}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-xs font-mono font-bold text-white/40 uppercase tracking-[0.3em] px-4">Decision Portal</h3>
                            <div className="p-10 border-2 border-dashed border-white/5 rounded-[48px] space-y-4 bg-white/[0.01]">
                                <button
                                    onClick={() => updateStatus('Approved')}
                                    className="w-full flex items-center justify-center gap-3 py-6 bg-white text-black rounded-3xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] shadow-2xl active:scale-95 group"
                                >
                                    <Check className="h-4 w-4 group-hover:scale-125 transition-transform" /> 
                                    Authorize Visa
                                </button>
                                <button
                                    onClick={() => updateStatus('Manual Review')}
                                    className="w-full py-5 bg-white/5 text-amber-400 border border-amber-400/20 rounded-3xl font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-amber-400/10 active:scale-95"
                                >
                                    Escalate to Audit
                                </button>
                                <button
                                    onClick={() => updateStatus('Rejected')}
                                    className="w-full py-5 bg-red-500/5 text-red-400 border border-red-500/20 rounded-3xl font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-red-500/10 active:scale-95 flex items-center justify-center gap-3 group"
                                >
                                    <X className="h-4 w-4 group-hover:scale-125 transition-transform" /> 
                                    Terminate Application
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
