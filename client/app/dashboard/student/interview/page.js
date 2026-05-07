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
    ChevronRight,
    Loader2,
    ShieldCheck
} from 'lucide-react';

const NoiseFilter = () => (
  <svg className="pointer-events-none fixed isolate z-50 opacity-[0.02] mix-blend-soft-light w-full h-full">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

const TOTAL_QUESTIONS = 7;

export default function InterviewPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState("Initializing neural link...");
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

    useEffect(() => {
        const fetchFirstQuestion = async () => {
            try {
                const { data } = await api.get('/student/interview/next');
                setCurrentQuestion(data.nextQuestion || "Why do you want to study in the United States?");
            } catch (err) {
                console.error("Failed to fetch initial question", err);
                setCurrentQuestion("Why do you want to study in the United States?");
            }
        };
        fetchFirstQuestion();
    }, []);

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
        formData.append('questionText', currentQuestion);

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

    const nextQuestionAction = () => {
        if (!lastFeedback?.isCompleted && currentQuestionIndex < TOTAL_QUESTIONS - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentQuestion(lastFeedback?.nextQuestion?.nextQuestion || "Can you elaborate?");
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
                setResult({ 
                    ...data.interview, 
                    recommendations: data.student.recommendations 
                });
            } else {
                setTimeout(fetchAnalysis, 2000);
            }
        } catch (e) {
            console.error("Final report fetch failed");
        }
    }

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
                        className="flex items-center gap-4 py-4 px-6 w-full rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 font-mono text-xs font-bold uppercase tracking-widest"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Terminate</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
                        <div>
                            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">Aural Verification</div>
                            <h1 className="text-5xl font-light tracking-tighter text-white mb-2 italic font-serif leading-none">Simulation</h1>
                            <p className="text-white/80 text-xl font-light tracking-tight leading-relaxed">Neural analysis engaged // Subject: Respond to the prompt</p>
                        </div>
                        {!completed && (
                            <div className="flex flex-col items-end">
                                <p className="text-xs font-mono font-bold text-white/50 uppercase tracking-[0.3em] mb-2">Sequence Tracker</p>
                                <div className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 inline-flex items-center justify-center w-fit">
                                    <span className="text-xl font-light text-white tracking-tighter">{currentQuestionIndex + 1} <span className="text-white/10 mx-2">/</span> {TOTAL_QUESTIONS}</span>
                                </div>
                            </div>
                        )}
                    </header>

                    {!completed ? (
                        <div className="space-y-12">
                            <motion.div
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-12 md:p-16 bg-white rounded-[40px] shadow-[0_32px_100px_rgba(0,0,0,0.4)] relative overflow-hidden text-center group"
                            >
                                <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-400/10 via-blue-500/30 to-blue-400/10" />
                                <Mic2 className="absolute -top-10 -right-10 h-80 w-80 opacity-[0.02] text-black pointer-events-none" />

                                <div className="max-w-3xl mx-auto relative z-10">
                                    <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-slate-900 mb-12 leading-[1.1] italic font-serif">
                                        "{currentQuestion}"
                                    </h2>

                                    <AnimatePresence mode="wait">
                                        {!lastFeedback ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="space-y-16"
                                            >
                                                {!manualInput ? (
                                                    <div className="flex flex-col items-center gap-16">
                                                        <div className={`relative h-64 w-64 rounded-full flex items-center justify-center transition-all duration-700 ${recording ? 'bg-blue-50 scale-110' : 'bg-slate-50'}`}>
                                                            {recording && (
                                                                <motion.div
                                                                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                                    className="absolute inset-0 rounded-full border-2 border-blue-200"
                                                                />
                                                            )}
                                                            <div className={`h-40 w-40 rounded-full flex items-center justify-center bg-white shadow-2xl transition-all duration-500 border border-slate-100 ${recording ? 'scale-90 shadow-blue-200/50' : ''}`}>
                                                                <Mic className={`h-16 w-16 text-slate-200 transition-colors ${recording ? 'animate-pulse text-blue-600' : ''}`} />
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-center gap-8">
                                                            {!recording ? (
                                                                <button onClick={startRecording} className="w-72 h-16 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3">
                                                                    <Mic className="h-5 w-5" />
                                                                    Start Rec
                                                                </button>
                                                            ) : (
                                                                <button onClick={stopRecording} className="w-72 h-16 bg-red-600 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3">
                                                                    <Square className="h-5 w-5 fill-current" />
                                                                    Terminate
                                                                </button>
                                                            )}

                                                            {!recording && !audioBlob && (
                                                                <button
                                                                    onClick={() => setManualInput(true)}
                                                                    className="text-xs font-mono text-slate-300 uppercase tracking-[0.4em] hover:text-blue-600 transition-colors font-bold"
                                                                >
                                                                    Manual Entry Mode
                                                                </button>
                                                            )}
                                                        </div>

                                                        {audioBlob && !recording && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="w-full max-w-md p-10 bg-slate-50 rounded-[32px] border border-slate-100"
                                                            >
                                                                <div className="flex items-center gap-6 mb-10">
                                                                    <audio src={URL.createObjectURL(audioBlob)} controls className="flex-1 h-12 opacity-80" />
                                                                    <button onClick={() => setAudioBlob(null)} className="h-12 w-12 flex items-center justify-center bg-white rounded-2xl border border-slate-200 hover:text-red-500 transition-colors shadow-sm">
                                                                        <RefreshCcw className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={submitAnswer}
                                                                    disabled={submitting}
                                                                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 shadow-2xl disabled:opacity-30"
                                                                >
                                                                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                                                                    {submitting ? 'Synthesizing...' : 'Analyze Vector'}
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-10 text-left">
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] ml-4 font-bold">Transcription Input</label>
                                                            <textarea
                                                                className="w-full p-12 rounded-[40px] border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500/30 transition-all outline-none min-h-[300px] text-2xl font-light leading-relaxed text-slate-900 placeholder:text-slate-200 shadow-inner"
                                                                placeholder="Type your response for neural analysis..."
                                                                value={transcript}
                                                                onChange={(e) => setTranscript(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <button
                                                                onClick={submitAnswer}
                                                                disabled={submitting || !transcript}
                                                                className="flex-1 h-20 bg-slate-900 text-white rounded-3xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 shadow-2xl"
                                                            >
                                                                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Initiate Analysis"}
                                                            </button>
                                                            <button onClick={() => { setManualInput(false); setTranscript(""); }} className="h-20 w-20 flex items-center justify-center bg-white border border-slate-100 rounded-3xl hover:text-blue-600 transition-all shadow-lg">
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
                                                className="space-y-12"
                                            >
                                                <div className="bg-slate-50 border border-slate-100 rounded-[48px] overflow-hidden text-left relative shadow-inner">
                                                    <div className="absolute top-10 right-10">
                                                        <div className="h-24 w-24 rounded-full border border-blue-500/10 flex flex-col items-center justify-center bg-white shadow-xl">
                                                            <span className="text-4xl font-light text-slate-900 tracking-tighter leading-none">{lastFeedback.singleAnalysis?.score || 0}</span>
                                                            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest mt-2 font-bold">Rating</span>
                                                        </div>
                                                    </div>

                                                    <div className="p-12 border-b border-slate-100 bg-white">
                                                        <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] mb-4 font-bold">Calibration Segment</h3>
                                                        <p className="text-3xl font-light tracking-tighter text-slate-900 italic font-serif">Evaluation Matrix</p>
                                                    </div>

                                                    <div className="p-12 space-y-12">
                                                        <div>
                                                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] mb-6 font-bold">Ingested Data</p>
                                                            <div className="p-8 bg-white rounded-3xl border border-slate-100 text-slate-500 italic text-xl font-light leading-relaxed font-serif">
                                                                "{lastFeedback.answerText}"
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] mb-6 font-bold">Neural Insight</p>
                                                            <div className="p-10 bg-blue-50 border border-blue-100 text-slate-900 rounded-[32px] shadow-lg relative overflow-hidden">
                                                                <ShieldCheck className="absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.05] text-blue-900" />
                                                                <p className="font-light text-2xl tracking-tight leading-relaxed italic font-serif text-blue-900">
                                                                    {lastFeedback.singleAnalysis?.feedback || "Responses have been logged and processed for final review."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={nextQuestionAction}
                                                    className="w-full h-20 bg-slate-900 text-white rounded-full font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-2xl"
                                                >
                                                    <span>{lastFeedback?.isCompleted || currentQuestionIndex === TOTAL_QUESTIONS - 1 ? 'Execute Synthesis' : 'Proceed to Next Vector'}</span>
                                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-24 bg-white rounded-[72px] shadow-[0_40px_120px_rgba(0,0,0,0.5)] text-center relative overflow-hidden border border-white/10"
                            >
                                <div className="absolute top-0 left-0 w-full h-[8px] bg-gradient-to-r from-emerald-400/20 via-emerald-500/40 to-emerald-400/20" />
                                <div className="h-32 w-32 bg-slate-900 rounded-[32px] flex items-center justify-center mx-auto mb-16 shadow-2xl rotate-12">
                                    <CheckCircle2 className="h-16 w-16 text-white" />
                                </div>
                                <h2 className="text-6xl font-light tracking-tighter text-slate-900 mb-8 italic font-serif">Concluded.</h2>
                                <p className="text-slate-400 text-xl font-light max-w-lg mx-auto mb-20 leading-relaxed font-serif">The AI Verifier is compiling your neural responses into a multidimensional credibility report.</p>

                                {result ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-12 text-left"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="p-12 bg-slate-50 border border-slate-100 rounded-[48px] relative overflow-hidden shadow-inner">
                                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] mb-6 font-bold">Academic Intent</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-8xl font-extralight tracking-tighter text-slate-900">{result.geminiAnalysis?.academicIntentScore || 0}</span>
                                                    <span className="text-2xl font-mono text-slate-300 font-bold">%</span>
                                                </div>
                                            </div>
                                            <div className="p-12 bg-slate-900 text-white rounded-[48px] shadow-2xl relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent" />
                                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-6 font-bold relative z-10">Total Credibility</p>
                                                <div className="flex items-baseline gap-2 relative z-10">
                                                    <span className="text-8xl font-bold tracking-tighter">{result.geminiAnalysis?.overallCredibilityScore || 0}</span>
                                                    <span className="text-2xl font-mono text-white/20 font-bold">%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-16 bg-blue-50 border border-blue-100 rounded-[56px] relative overflow-hidden group">
                                            <ShieldCheck className="absolute -bottom-12 -right-12 h-56 w-56 opacity-[0.03] text-blue-900" />
                                            <h3 className="text-[10px] font-mono text-blue-900/40 uppercase tracking-[0.4em] mb-10 font-bold">Executive Summary</h3>
                                            <p className="text-3xl font-light leading-relaxed italic text-blue-900 border-l-4 border-blue-200 pl-12 font-serif">
                                                "{result.geminiAnalysis?.summary || "Verification complete. Your risk profile has been updated automatically."}"
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-[0.4em] px-8 font-bold">Path to Clearance</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {result.recommendations?.length > 0 ? result.recommendations.map((rec, i) => (
                                                    <div key={i} className="p-8 bg-white border border-slate-100 rounded-[32px] flex items-start gap-5 shadow-sm hover:shadow-xl transition-all">
                                                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <p className="text-sm text-slate-600 font-light leading-relaxed">{rec}</p>
                                                    </div>
                                                )) : (
                                                    <p className="text-sm text-slate-400 italic px-8">No specific recommendations at this time. Keep improving your documentation.</p>
                                                )}
                                            </div>
                                        </div>

                                        <Link href="/dashboard/student" className="w-full h-24 bg-slate-900 text-white rounded-full font-bold uppercase tracking-[0.3em] text-sm flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            Return to Interface
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center gap-12 py-20">
                                        <div className="flex gap-6">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
                                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                                                    className="h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-slate-300 font-bold">Synthesizing Official Record</p>
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
