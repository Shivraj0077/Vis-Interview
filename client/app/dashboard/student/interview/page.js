"use client";
import { useState, useRef, useEffect } from 'react';
import api from '../../../../lib/api';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    UploadCloud,
    Mic2,
    Compass,
    LogOut,
    Mic,
    Square,
    CheckCircle2,
    RefreshCcw,
    ArrowRight,
    ChevronRight,
    Keyboard,
    Loader2,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';

const QUESTIONS = [
    "Why do you want to study in the United States?",
    "Why have you chosen this specific course/major?",
    "How will you fund your education expenses?",
    "What are your career plans after graduation?"
];

export default function InterviewPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [lastFeedback, setLastFeedback] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState(null);
    const [manualInput, setManualInput] = useState(false);
    const [transcript, setTranscript] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const navItems = [
        { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
        { name: 'Upload Documents', href: '/dashboard/student/upload', icon: UploadCloud },
        { name: 'AI Interview', href: '/dashboard/student/interview', icon: Mic2 },
        { name: 'Resources', href: '/dashboard/student/resources', icon: Compass },
    ];

    const startRecording = async () => {
        setAudioBlob(null);
        setTranscript("");
        setLastFeedback(null);
        setManualInput(false);
        chunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (err) {
            console.error("Mic access failed:", err);
            setManualInput(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const submitAnswer = async () => {
        const formData = new FormData();
        formData.append('questionIndex', currentQuestionIndex);
        formData.append('questionText', QUESTIONS[currentQuestionIndex]);

        if (manualInput) {
            if (!transcript) return;
            formData.append('answerText', transcript);
        } else {
            if (!audioBlob) return;
            formData.append('audio', audioBlob, 'answer.webm');
        }

        setSubmitting(true);
        try {
            const { data } = await api.post('/student/answer', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setLastFeedback(data);
        } catch (error) {
            alert("Evaluation failed: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setAudioBlob(null);
            setTranscript("");
            setLastFeedback(null);
            setManualInput(false);
        } else {
            setCompleted(true);
            fetchAnalysis();
        }
    };

    const fetchAnalysis = async () => {
        try {
            const { data } = await api.get('/student/profile');
            if (data.interview?.status === 'Completed') {
                setResult(data.interview);
            } else {
                setTimeout(fetchAnalysis, 2000);
            }
        } catch (e) {
            console.error("Final report fetch failed");
        }
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-border p-8 flex flex-col hidden lg:flex">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">E</span>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-foreground">EduVerify</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-foreground text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                <span className="font-semibold">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={() => { localStorage.clear(); router.push('/login'); }}
                        className="flex items-center gap-3 py-3 px-4 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-foreground mb-2">AI Credibility Interview</h1>
                            <p className="text-muted-foreground">Answer the following questions naturally for verification.</p>
                        </div>
                        {!completed && (
                            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Question</span>
                                <span className="text-sm font-black text-foreground">{currentQuestionIndex + 1} / {QUESTIONS.length}</span>
                            </div>
                        )}
                    </header>

                    {!completed ? (
                        <div className="space-y-8">
                            <motion.div
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="minimal-card p-10 md:p-14 bg-white relative overflow-hidden text-center"
                            >
                                {/* Subtle Background Icon */}
                                <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
                                    <Mic2 className="h-64 w-64" />
                                </div>

                                <div className="max-w-2xl mx-auto">
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-12 leading-tight">
                                        {QUESTIONS[currentQuestionIndex]}
                                    </h2>

                                    <AnimatePresence mode="wait">
                                        {!lastFeedback ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="space-y-10"
                                            >
                                                {!manualInput ? (
                                                    <div className="flex flex-col items-center gap-8">
                                                        <div className={`relative h-48 w-48 rounded-full flex items-center justify-center transition-all duration-500 bg-muted/30 border border-border shadow-inner ${recording ? 'scale-110 border-red-200' : ''}`}>
                                                            {recording && (
                                                                <motion.div
                                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                                    className="absolute inset-0 rounded-full border-4 border-red-500"
                                                                />
                                                            )}
                                                            <div className={`h-32 w-32 rounded-full flex items-center justify-center bg-white shadow-xl transition-all duration-300 ${recording ? 'text-red-500 scale-90' : 'text-foreground'}`}>
                                                                <Mic className={`h-12 w-12 ${recording ? 'animate-pulse' : ''}`} />
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-center gap-4">
                                                            {!recording ? (
                                                                <button onClick={startRecording} className="btn-primary h-14 px-10 gap-3 group">
                                                                    <Mic className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                                    <span>Start Recording</span>
                                                                </button>
                                                            ) : (
                                                                <button onClick={stopRecording} className="inline-flex items-center justify-center rounded-xl bg-red-600 px-10 h-14 text-base font-bold text-white transition-all shadow-lg shadow-red-500/20 active:scale-95 gap-3">
                                                                    <Square className="h-5 w-5 fill-current" />
                                                                    <span>Stop & Review</span>
                                                                </button>
                                                            )}

                                                            {!recording && !audioBlob && (
                                                                <button
                                                                    onClick={() => setManualInput(true)}
                                                                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest mt-2"
                                                                >
                                                                    <Keyboard className="h-4 w-4" />
                                                                    Prefer typing?
                                                                </button>
                                                            )}
                                                        </div>

                                                        {audioBlob && !recording && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="w-full max-w-md bg-muted/40 p-6 rounded-2xl border border-border"
                                                            >
                                                                <div className="flex items-center gap-4 mb-6">
                                                                    <audio src={URL.createObjectURL(audioBlob)} controls className="flex-1 h-9" />
                                                                    <button onClick={() => setAudioBlob(null)} className="h-9 w-9 flex items-center justify-center bg-white rounded-lg border border-border hover:text-red-500 transition-colors">
                                                                        <RefreshCcw className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={submitAnswer}
                                                                    disabled={submitting}
                                                                    className="btn-primary w-full h-12 gap-2"
                                                                >
                                                                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                                                                    {submitting ? 'Analyzing Responses...' : 'Submit to AI Officer'}
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-6 text-left">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">Written Response</label>
                                                            <textarea
                                                                className="w-full p-6 md:p-8 rounded-3xl border border-border bg-muted/20 focus:bg-white focus:border-foreground focus:ring-4 focus:ring-muted transition-all outline-none min-h-[200px] text-lg font-medium leading-relaxed"
                                                                placeholder="Please provide your detailed answer here..."
                                                                value={transcript}
                                                                onChange={(e) => setTranscript(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                onClick={submitAnswer}
                                                                disabled={submitting || !transcript}
                                                                className="btn-primary flex-1 h-14 text-lg gap-2"
                                                            >
                                                                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Answer"}
                                                            </button>
                                                            <button onClick={() => { setManualInput(false); setTranscript(""); }} className="h-14 w-14 flex items-center justify-center bg-muted/50 rounded-2xl hover:bg-muted transition-colors border border-border">
                                                                <Mic className="h-6 w-6" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="space-y-8"
                                            >
                                                <div className="minimal-card p-0 bg-white border-foreground/5 shadow-2xl relative overflow-hidden text-left">
                                                    <div className="absolute top-0 right-0 p-8">
                                                        <div className="h-20 w-20 rounded-full border-4 border-muted flex flex-col items-center justify-center bg-white shadow-xl">
                                                            <span className="text-2xl font-black text-foreground">{lastFeedback.singleAnalysis?.score || 0}</span>
                                                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Score</span>
                                                        </div>
                                                    </div>

                                                    <div className="p-8 border-b border-border bg-muted/20">
                                                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Assessment Complete</h3>
                                                        <p className="text-2xl font-black text-foreground">Initial Evaluation</p>
                                                    </div>

                                                    <div className="p-8 space-y-6">
                                                        <div>
                                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2 px-1">Transcript Review</p>
                                                            <div className="p-4 bg-muted/30 rounded-2xl border border-border italic text-muted-foreground text-sm">
                                                                "{lastFeedback.answerText}"
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2 px-1">Officer Data</p>
                                                            <div className="p-5 bg-foreground text-background rounded-2xl shadow-lg">
                                                                <p className="font-bold leading-relaxed">
                                                                    {lastFeedback.singleAnalysis?.feedback || "Responses have been logged and processed for final review."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={nextQuestion}
                                                    className="btn-primary w-full h-14 text-lg gap-2 shadow-xl shadow-foreground/10 group"
                                                >
                                                    <span>{currentQuestionIndex === QUESTIONS.length - 1 ? 'Generate Final Report' : 'Next Question'}</span>
                                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto space-y-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="minimal-card p-12 text-center bg-white border-foreground/5 shadow-2xl"
                            >
                                <div className="h-24 w-24 bg-foreground rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-12">
                                    <CheckCircle2 className="h-12 w-12 text-background" />
                                </div>
                                <h2 className="text-4xl font-extrabold text-foreground mb-4">Interview Concluded</h2>
                                <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">Our AI Verifier is compiling your responses and generating a multidimensional credibility report.</p>

                                {result ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-8 text-left"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="minimal-card p-8 bg-muted/20">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Academic Intent</p>
                                                <div className="flex items-end gap-1">
                                                    <span className="text-5xl font-black text-foreground">{result.geminiAnalysis?.academicIntentScore || 0}</span>
                                                    <span className="text-lg font-bold text-muted-foreground mb-1">%</span>
                                                </div>
                                            </div>
                                            <div className="minimal-card p-8 bg-foreground text-background shadow-xl">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Overall Credibility</p>
                                                <div className="flex items-end gap-1">
                                                    <span className="text-5xl font-black text-background">{result.geminiAnalysis?.overallCredibilityScore || 0}</span>
                                                    <span className="text-lg font-bold text-muted/50 mb-1">%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="minimal-card p-8 bg-white border border-border overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                                <ShieldCheck className="h-24 w-24" />
                                            </div>
                                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Executive Summary</h3>
                                            <p className="text-lg font-medium leading-relaxed italic text-foreground border-l-4 border-foreground pl-6">
                                                "{result.geminiAnalysis?.summary || "Verification complete. Your risk profile has been updated automatically."}"
                                            </p>
                                        </div>

                                        <Link href="/dashboard/student" className="btn-primary w-full h-14 text-lg">
                                            Return to Dashboard
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center gap-6 py-10">
                                        <div className="flex gap-2">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                                                    className="h-3 w-3 rounded-full bg-foreground"
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Synthesizing Official Report</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
