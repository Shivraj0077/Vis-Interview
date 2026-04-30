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
    Trash2,
    Check,
    X
} from 'lucide-react';

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
        <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
    );

    if (!data) return (
        <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center gap-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <h1 className="text-xl font-bold">Student records not found.</h1>
            <button onClick={() => router.back()} className="btn-secondary">Go Back</button>
        </div>
    );

    const { student, documents, interview, background } = data;

    return (
        <div className="min-h-screen bg-[#FDFDFF]">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border/50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <h1 className="text-xl font-extrabold text-foreground tracking-tight">Application Review<span className="text-muted-foreground font-medium ml-2">#{params.id.slice(-8)}</span></h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${student.applicationStatus === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                student.applicationStatus === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                    'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                            {student.applicationStatus}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
                {/* Profile Overview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="minimal-card p-8 bg-white border-foreground/5"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-3xl bg-accent flex items-center justify-center text-3xl font-black text-foreground border border-border uppercase shadow-inner">
                                {student.user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-foreground leading-tight tracking-tight mb-2">{student.user?.name}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="h-4 w-4" />
                                        {student.user?.email}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono">
                                        <CreditCard className="h-4 w-4" />
                                        {student.passportNumber || 'PASSPORT: NOT_SET'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 bg-muted/30 p-6 rounded-3xl border border-border/40">
                            <div className="text-center md:text-right">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Risk Profile</p>
                                <p className={`text-2xl font-black ${student.riskLevel === 'Low' ? 'text-green-600' : student.riskLevel === 'High' ? 'text-red-500' : 'text-amber-500'}`}>
                                    {student.riskLevel} Degree
                                </p>
                            </div>
                            <div className="h-12 w-px bg-border/60" />
                            <div className="text-center md:text-right">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Credibility Score</p>
                                <p className="text-4xl font-black text-foreground tracking-tighter">
                                    {student.finalScore || 0}<span className="text-sm font-bold text-muted-foreground ml-1">/100</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Documents Analysis */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Verified Repository ({documents.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {documents.map(doc => (
                                    <div key={doc._id} className="minimal-card p-5 bg-white flex items-center justify-between group">
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-foreground text-sm">{doc.type}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono uppercase">OCR_VERIFIED</p>
                                        </div>
                                        <a
                                            href={`http://localhost:5000/${doc.filePath}`}
                                            target="_blank"
                                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background transition-all border border-border/50 group-hover:scale-105"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-2">
                                <Mic2 className="h-4 w-4" />
                                Psychometric Voice Analysis
                            </h3>
                            <div className="minimal-card bg-white overflow-hidden p-0">
                                {interview ? (
                                    <div className="divide-y divide-border/40">
                                        <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-8 bg-muted/10">
                                            <div className="text-center p-4 bg-white rounded-2xl border border-border/50 shadow-sm">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mb-2">Intent</p>
                                                <p className="text-2xl font-black text-foreground">{interview.geminiAnalysis?.academicIntentScore}%</p>
                                            </div>
                                            <div className="text-center p-4 bg-white rounded-2xl border border-border/50 shadow-sm">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mb-2">Confidence</p>
                                                <p className="text-2xl font-black text-foreground">{interview.geminiAnalysis?.credibilityScore}%</p>
                                            </div>
                                            <div className="text-center p-4 bg-white rounded-2xl border border-border/50 shadow-sm">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mb-2">Financials</p>
                                                <p className="text-2xl font-black text-foreground">{interview.geminiAnalysis?.financialUnderstandingScore}%</p>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">AI Officer Interpretation</p>
                                            <div className="p-6 bg-foreground text-background rounded-3xl text-sm leading-relaxed font-medium italic shadow-lg shadow-foreground/10 relative">
                                                <div className="absolute -top-3 -left-3 p-2 bg-background text-foreground rounded-full border-2 border-foreground">
                                                    <Mic2 className="h-4 w-4" />
                                                </div>
                                                "{interview.geminiAnalysis?.explanation || interview.geminiAnalysis?.summary}"
                                            </div>
                                            <div className="mt-8">
                                                <button
                                                    onClick={() => setExpandingTranscript(!expandingTranscript)}
                                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {expandingTranscript ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                    Raw Voice Transcript
                                                </button>
                                                <AnimatePresence>
                                                    {expandingTranscript && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="mt-4 p-6 bg-muted/30 rounded-2xl text-sm text-foreground/80 leading-relaxed font-mono">
                                                                {interview.transcript}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-20 text-center text-muted-foreground italic font-medium">
                                        Voice analysis session not initiated.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Background & Actions Sidebar */}
                    <div className="space-y-8">
                        <section className="space-y-4">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-2">
                                <ShieldAlert className="h-4 w-4" />
                                Security Clearance
                            </h3>
                            <div className="minimal-card p-6 bg-white space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-foreground">Global Status</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${background?.status === 'Clear' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                        {background?.status || 'UNVERIFIED'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-foreground">Background Score</span>
                                    <span className="text-lg font-black text-foreground">{background?.riskScore || 0}</span>
                                </div>
                                {background?.flags?.length > 0 && (
                                    <div className="space-y-3 pt-4 border-t border-border">
                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Active Flags Detected</p>
                                        <div className="space-y-2">
                                            {background.flags.map((flag, i) => (
                                                <div key={i} className="flex items-start gap-2 text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100/50">
                                                    <AlertTriangle className="h-4 w-4 shrink-0" />
                                                    {flag}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">Final Conclusion</h3>
                            <div className="minimal-card p-4 bg-muted/10 border-dashed border-2 space-y-3">
                                <button
                                    onClick={() => updateStatus('Approved')}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-foreground text-background rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl shadow-foreground/5 active:scale-95"
                                >
                                    <Check className="h-4 w-4" /> Approve Applicant
                                </button>
                                <button
                                    onClick={() => updateStatus('Manual Review')}
                                    className="w-full py-3 bg-white text-amber-600 border border-amber-200 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-amber-50 active:scale-95"
                                >
                                    Request Secondary Review
                                </button>
                                <button
                                    onClick={() => updateStatus('Rejected')}
                                    className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-red-100 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <X className="h-4 w-4" /> Reject Profile
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
