"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    UploadCloud,
    Mic2,
    Compass,
    LogOut,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    ShieldCheck,
    TrendingUp,
    Brain,
    Sparkles,
    ArrowRight,
    Eye,
} from 'lucide-react';

const DOC_TYPES = [
    { value: 'Passport', label: 'International Passport (with MRZ)' },
    { value: 'Form I-20', label: 'Form I-20 (Certificate of Eligibility)' },
    { value: 'Offer Letter', label: 'University Offer Letter' },
    { value: 'Bank Statement', label: 'Bank Statement (3 Months)' },
    { value: 'Statement of Purpose', label: 'Statement of Purpose (SOP)' },
    { value: 'Passport Photo', label: 'Visa Specification Photo' },
];

const ANALYSIS_STEPS = [
    'Scanning document structure...',
    'Running OCR via Tesseract...',
    'Extracting structured fields via Gemini 3 Flash...',
    'Validating MRZ and checksums...',
    'Performing cross-document consistency check...',
    'Calculating final authenticity score...',
];

import api from '../../../../lib/api';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [type, setType] = useState(DOC_TYPES[0].value);
    const [phase, setPhase] = useState('upload'); // 'upload' | 'analyzing' | 'results'
    const [analysisStep, setAnalysisStep] = useState(0);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [crossFlags, setCrossFlags] = useState([]);
    const router = useRouter();
    const pathname = usePathname();

    const startAnalysis = async (selectedType, selectedFile) => {
        setPhase('analyzing');
        setAnalysisStep(0);
        setAnalysisProgress(0);

        // Fake progress for UI
        const progInterval = setInterval(() => {
            setAnalysisProgress(prev => Math.min(prev + (Math.random() * 5), 90));
            setAnalysisStep(prev => (prev + 1) % ANALYSIS_STEPS.length);
        }, 1200);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('type', selectedType);

            const { data } = await api.post('/student/upload', formData);
            
            clearInterval(progInterval);
            setAnalysisProgress(100);
            
            setTimeout(() => {
                setResults(data.document);
                setCrossFlags(data.crossFlags || []);
                setPhase('results');
            }, 800);

        } catch (err) {
            clearInterval(progInterval);
            alert(err.response?.data?.message || "Analysis failed. Please try a clearer scan.");
            setPhase('upload');
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) return;
        startAnalysis(type, file);
    };

    const handleReset = () => {
        setFile(null);
        setPhase('upload');
        setResults(null);
        setCrossFlags([]);
        setAnalysisStep(0);
        setAnalysisProgress(0);
    };

    const navItems = [
        { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
        { name: 'Upload Documents', href: '/dashboard/student/upload', icon: UploadCloud },
        { name: 'AI Interview', href: '/dashboard/student/interview', icon: Mic2 },
        { name: 'Resources', href: '/dashboard/student/resources', icon: Compass },
    ];

    return (
        <div className="h-screen overflow-hidden bg-white flex">
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
            <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto bg-accent/20">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-extrabold text-foreground mb-2">Upload Documents</h1>
                        <p className="text-muted-foreground">Upload your documents and let AI analyze them in seconds.</p>
                    </header>

                    <AnimatePresence mode="wait">
                        {/* ════════ UPLOAD PHASE ════════ */}
                        {phase === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="minimal-card p-8 bg-white">
                                    <form onSubmit={handleUpload} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-foreground">Document Type</label>
                                            <select
                                                className="input-field appearance-none"
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                            >
                                                {DOC_TYPES.map((docType) => (
                                                    <option key={docType.value} value={docType.value}>
                                                        {docType.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-foreground">Select File</label>
                                            <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-border rounded-2xl hover:border-foreground/20 transition-colors cursor-pointer relative group">
                                                <div className="space-y-3 text-center">
                                                    <div className="mx-auto h-16 w-16 rounded-2xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex flex-col items-center text-sm text-muted-foreground">
                                                        <label className="relative cursor-pointer rounded-md font-bold text-foreground hover:underline">
                                                            <span>{file ? file.name : 'Click to upload a file'}</span>
                                                            <input
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                onChange={(e) => setFile(e.target.files[0])}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                        {!file && <p className="mt-1">or drag and drop</p>}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        PDF, PNG, JPG up to 10MB
                                                    </p>
                                                </div>
                                                {file && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFile(null)}
                                                        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-accent transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!file}
                                            className="btn-primary w-full h-12 gap-2 text-base shadow-lg shadow-foreground/5"
                                        >
                                            <Sparkles className="h-5 w-5" />
                                            Analyze with AI
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {/* ════════ ANALYZING PHASE ════════ */}
                        {phase === 'analyzing' && (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                className="minimal-card p-12 bg-white text-center"
                            >
                                <div className="max-w-md mx-auto">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br from-foreground to-slate-700 flex items-center justify-center mb-8 shadow-2xl"
                                    >
                                        <Brain className="h-10 w-10 text-white" />
                                    </motion.div>

                                    <h2 className="text-2xl font-extrabold text-foreground mb-2">
                                        AI is Analyzing Your Document
                                    </h2>
                                    <p className="text-muted-foreground mb-8">
                                        Our AI models are scanning, extracting, and verifying your {type.toLowerCase()}.
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-accent rounded-full h-3 mb-6 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-foreground to-slate-600 rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${analysisProgress}%` }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                        />
                                    </div>

                                    <p className="text-sm font-semibold text-foreground mb-2">
                                        {Math.round(analysisProgress)}% Complete
                                    </p>

                                    <motion.p
                                        key={analysisStep}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-muted-foreground flex items-center justify-center gap-2"
                                    >
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        {ANALYSIS_STEPS[analysisStep]}
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}

                        {/* ════════ RESULTS PHASE ════════ */}
                        {phase === 'results' && results && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                {/* Score Header */}
                                <div className="minimal-card p-8 bg-white">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                         <div className="relative">
                                             <svg className="h-32 w-32 transform -rotate-90" viewBox="0 0 100 100">
                                                 <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                                                 <motion.circle
                                                     cx="50" cy="50" r="42" fill="none"
                                                     stroke={results.isValid ? '#10B981' : results.validationFlags?.length > 0 ? '#EF4444' : '#F59E0B'}
                                                     strokeWidth="8"
                                                     strokeLinecap="round"
                                                     strokeDasharray={`${2 * Math.PI * 42}`}
                                                     initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                                     animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - (results.ocrConfidence || 100) / 100) }}
                                                     transition={{ duration: 1.5, ease: 'easeOut' }}
                                                 />
                                             </svg>
                                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                 <span className="text-3xl font-black text-foreground">{Math.round(results.ocrConfidence || 0)}%</span>
                                                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Confidence</span>
                                             </div>
                                         </div>

                                         <div className="flex-1 text-center md:text-left">
                                             <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                                                 {results.isValid ? (
                                                     <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                                 ) : (
                                                     <AlertCircle className="h-6 w-6 text-red-500" />
                                                 )}
                                                 <h2 className="text-2xl font-extrabold text-foreground">
                                                     {results.isValid ? 'Document Validated' : 'Validation Flags Detected'}
                                                 </h2>
                                             </div>
                                             <p className="text-muted-foreground mb-4">
                                                 Your {results.type} has been processed. Review the findings below.
                                             </p>
                                             <div className="flex items-center gap-4 justify-center md:justify-start">
                                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${results.isValid
                                                     ? 'bg-emerald-100 text-emerald-700'
                                                     : 'bg-red-100 text-red-700'
                                                     }`}>
                                                     Status: {results.isValid ? 'PASSED' : 'FLAGGED'}
                                                 </span>
                                                 <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent text-foreground">
                                                     {results.type}
                                                 </span>
                                             </div>
                                         </div>
                                    </div>
                                </div>

                                {/* Validation Flags */}
                                {(results.validationFlags?.length > 0 || crossFlags.length > 0) && (
                                    <div className="minimal-card p-0 bg-white overflow-hidden border-red-100 shadow-lg shadow-red-500/5">
                                        <div className="p-6 border-b border-red-50 bg-red-50/30">
                                            <h3 className="font-bold text-red-700 flex items-center gap-2">
                                                <X className="h-5 w-5" />
                                                Security & Consistency Alerts
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-3">
                                            {[...(results.validationFlags || []), ...crossFlags].map((flag, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex items-start gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100"
                                                >
                                                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                                    <p className="text-sm font-semibold text-red-900">{flag}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Extracted Data */}
                                <div className="minimal-card p-0 bg-white overflow-hidden">
                                    <div className="p-6 border-b border-border bg-accent/30">
                                        <h3 className="font-bold text-foreground flex items-center gap-2">
                                            <Eye className="h-5 w-5" />
                                            Extracted Information
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(results.extractedData || {}).map(([key, value]) => (
                                                <motion.div
                                                    key={key}
                                                    className="p-4 bg-accent/10 rounded-xl border border-border/40"
                                                >
                                                    <dt className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">{key}</dt>
                                                    <dd className="text-sm font-bold text-foreground">{value?.toString() || 'Not found'}</dd>
                                                </motion.div>
                                            ))}
                                        </dl>
                                    </div>
                                </div>

                                {/* AI Insights / Flags */}
                                <div className="minimal-card p-0 bg-white overflow-hidden">
                                    <div className="p-6 border-b border-border bg-accent/30">
                                        <h3 className="font-bold text-foreground flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            AI Document Insights
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {(results.validationFlags || []).length === 0 && crossFlags.length === 0 ? (
                                            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                                <p className="text-sm font-medium text-emerald-900">This document passed all structural and identity cross-checks successfully.</p>
                                            </div>
                                        ) : (
                                            [...(results.validationFlags || []), ...crossFlags].map((flag, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100"
                                                >
                                                    <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                                    <p className="text-sm font-medium text-orange-900">{flag}</p>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button onClick={handleReset} className="btn-primary flex-1 h-12 gap-2">
                                        <UploadCloud className="h-5 w-5" />
                                        Upload Another Document
                                    </button>
                                    <Link href="/dashboard/student" className="btn-secondary flex-1 h-12 gap-2 justify-center">
                                        Back to Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
