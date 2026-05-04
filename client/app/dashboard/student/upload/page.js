"use client";
import { useState } from 'react';
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
    'Extracting fields via Gemini...',
    'Validating MRZ checksums...',
    'Cross-document consistency...',
    'Authenticity scoring...',
];

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
                <div className="max-w-5xl mx-auto">
                    <header className="mb-10 border-b border-white/5 pb-8">
                        <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">Data Synchronizer</div>
                        <h1 className="text-5xl font-light tracking-tighter text-white mb-2 italic font-serif leading-none">Ingestion</h1>
                        <p className="text-white/80 text-xl font-light tracking-tight">System ready for neural scan // Secure tunnel established</p>
                    </header>

                    <AnimatePresence mode="wait">
                        {phase === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="p-12 md:p-16 bg-white rounded-[40px] shadow-[0_32px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-400/10 via-blue-500/30 to-blue-400/10" />
                                    
                                    <form onSubmit={handleUpload} className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500 ml-4 font-bold">Document Category</label>
                                            <select
                                                className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-3xl focus:border-blue-500/50 focus:bg-white outline-none transition-all appearance-none text-slate-900 text-xl font-light italic font-serif"
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

                                        <div className="space-y-4">
                                            <label className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500 ml-4 font-bold">Vector Source</label>
                                            <div className="mt-1 flex justify-center px-8 pt-10 pb-10 border-2 border-dashed border-slate-100 rounded-[32px] hover:border-blue-500/30 transition-all cursor-pointer relative group/drop overflow-hidden bg-slate-50/50">
                                                <div className="absolute inset-0 bg-blue-500/0 group-hover/drop:bg-blue-500/[0.02] transition-colors" />
                                                <div className="space-y-4 text-center relative z-10">
                                                    <div className="mx-auto h-20 w-20 rounded-[24px] bg-white flex items-center justify-center group-hover/drop:scale-110 transition-transform shadow-xl border border-slate-100">
                                                        <UploadCloud className="h-8 w-8 text-slate-300 group-hover/drop:text-blue-500 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <label className="relative cursor-pointer rounded-md font-medium text-slate-900 hover:text-blue-600 transition-colors">
                                                            <span className="text-2xl tracking-tighter italic font-serif">{file ? file.name : 'Select Vector File'}</span>
                                                            <input
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                onChange={(e) => setFile(e.target.files[0])}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                        {!file && <p className="mt-2 text-slate-500 text-base font-light">or drop into stream</p>}
                                                    </div>
                                                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">
                                                        PDF, PNG, JPG // MAX 10MB
                                                    </p>
                                                </div>
                                                {file && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFile(null)}
                                                        className="absolute top-8 right-8 p-3 rounded-full bg-white hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all z-20 shadow-lg border border-slate-100"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!file}
                                            className="w-full h-16 bg-slate-900 text-white rounded-[20px] font-bold uppercase tracking-[0.3em] text-xs hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl disabled:opacity-30 flex items-center justify-center gap-3"
                                        >
                                            <Sparkles className="h-5 w-5" />
                                            Execute Analysis
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {phase === 'analyzing' && (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                className="p-16 bg-white rounded-[40px] text-center relative overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
                            >
                                <div className="absolute top-0 left-0 w-full h-[8px] bg-gradient-to-r from-blue-400/10 via-blue-500/40 to-blue-400/10" />
                                <div className="max-w-md mx-auto relative z-10">
                                    <div className="relative mx-auto h-24 w-24 mb-10">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                            className="absolute inset-0 rounded-[40px] bg-blue-50 border-2 border-blue-100"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Brain className="h-14 w-14 text-blue-600" />
                                        </div>
                                    </div>

                                    <h2 className="text-4xl font-light tracking-tighter text-slate-900 mb-4 italic font-serif">
                                        Synthesizing...
                                    </h2>
                                    <p className="text-slate-400 text-base font-light mb-10 max-w-sm mx-auto leading-relaxed">
                                        Our neural network is mapping the integrity of your {type.toLowerCase()}.
                                    </p>

                                    <div className="w-full bg-slate-50 rounded-full h-1.5 mb-8 overflow-hidden border border-slate-100 shadow-inner">
                                        <motion.div
                                            className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${analysisProgress}%` }}
                                            transition={{ duration: 0.4 }}
                                        />
                                    </div>

                                    <p className="text-[10px] font-mono text-blue-600 uppercase tracking-[0.5em] mb-6 font-bold">
                                        {Math.round(analysisProgress)}% Mapped
                                    </p>

                                    <motion.p
                                        key={analysisStep}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-slate-300 font-mono tracking-[0.2em] flex items-center justify-center gap-4 uppercase font-bold"
                                    >
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                        {ANALYSIS_STEPS[analysisStep]}
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}

                        {phase === 'results' && results && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-10"
                            >
                                <div className="p-12 bg-white rounded-[40px] shadow-[0_32px_100px_rgba(0,0,0,0.4)] relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50" />
                                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                         <div className="relative">
                                             <svg className="h-32 w-32 transform -rotate-90" viewBox="0 0 100 100">
                                                 <circle cx="50" cy="50" r="45" fill="none" stroke="#f8fafc" strokeWidth="6" />
                                                 <motion.circle
                                                     cx="50" cy="50" r="45" fill="none"
                                                     stroke={results.isValid ? '#10B981' : results.validationFlags?.length > 0 ? '#EF4444' : '#F59E0B'}
                                                     strokeWidth="6"
                                                     strokeLinecap="round"
                                                     strokeDasharray={`${2 * Math.PI * 45}`}
                                                     initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                                                     animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - (results.ocrConfidence || 100) / 100) }}
                                                     transition={{ duration: 1.5 }}
                                                 />
                                             </svg>
                                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                 <span className="text-5xl font-extralight tracking-tighter text-slate-900 leading-none">{Math.round(results.ocrConfidence || 0)}</span>
                                                 <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest mt-1 font-bold">Integrity</span>
                                             </div>
                                         </div>

                                         <div className="flex-1 text-center md:text-left">
                                             <div className="flex items-center gap-6 justify-center md:justify-start mb-4">
                                                 <div className={`h-12 w-12 rounded-[16px] flex items-center justify-center shadow-xl ${results.isValid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                     {results.isValid ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                                                 </div>
                                                 <h2 className="text-4xl font-light tracking-tighter text-slate-900 italic font-serif">
                                                     {results.isValid ? 'Verified' : 'Anomalies'}
                                                 </h2>
                                             </div>
                                             <p className="text-slate-400 text-base font-light mb-6 max-w-lg leading-relaxed font-serif">
                                                 The vector stream for your {results.type} has been successfully decoded. Review the extracted neural patterns below.
                                             </p>
                                             <div className="flex items-center gap-4 justify-center md:justify-start">
                                                 <span className={`px-6 py-2 rounded-full text-[10px] font-mono uppercase tracking-[0.3em] font-bold ${results.isValid
                                                     ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                                                     : 'text-red-600 bg-red-50 border border-red-100'
                                                     }`}>
                                                     {results.isValid ? 'VALIDATED' : 'FLAGGED'}
                                                 </span>
                                                 <span className="px-6 py-2 rounded-full text-[10px] font-mono uppercase tracking-[0.3em] bg-slate-50 text-slate-400 border border-slate-100 font-bold">
                                                     {results.type}
                                                 </span>
                                             </div>
                                         </div>
                                    </div>
                                </div>

                                {/* Security Panel */}
                                {(results.validationFlags?.length > 0 || crossFlags.length > 0) && (
                                    <div className="p-12 bg-red-50 border border-red-100 rounded-[48px] relative overflow-hidden">
                                        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-red-600 mb-8 font-bold flex items-center gap-3">
                                            <AlertCircle className="h-5 w-5" />
                                            Anomalies Detected
                                        </h3>
                                        <div className="space-y-4">
                                            {[...(results.validationFlags || []), ...crossFlags].map((flag, i) => (
                                                <div key={i} className="flex items-start gap-5 p-8 rounded-3xl bg-white border border-red-100 shadow-sm group">
                                                    <div className="h-2 w-2 rounded-full bg-red-500 mt-2.5 shrink-0 group-hover:scale-150 transition-transform" />
                                                    <p className="text-lg font-light text-red-900/80 leading-relaxed font-serif italic">"{flag}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Data Grid */}
                                <div className="bg-white rounded-[40px] shadow-[0_32px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-50">
                                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                        <h3 className="text-lg font-light tracking-tighter text-slate-900 flex items-center gap-3 italic font-serif">
                                            <Eye className="h-5 w-5 text-blue-600" />
                                            Extracted Metadata
                                        </h3>
                                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-slate-100">
                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {Object.entries(results.extractedData || {}).map(([key, value]) => (
                                                <div key={key} className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                                                    <dt className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 mb-2 group-hover:text-blue-600 transition-colors font-bold">{key}</dt>
                                                    <dd className="text-lg font-light tracking-tight text-slate-900 italic font-serif">{value?.toString() || 'NULL_VECTOR'}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-8 pt-12 pb-20">
                                    <button onClick={handleReset} className="flex-1 h-20 bg-slate-900 text-white rounded-full font-bold uppercase tracking-[0.3em] text-sm hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-4">
                                        <UploadCloud className="h-6 w-6" />
                                        New Sequence
                                    </button>
                                    <Link href="/dashboard/student" className="flex-1 h-20 bg-white border border-slate-100 rounded-full font-bold uppercase tracking-[0.3em] text-sm hover:border-blue-600 transition-all text-slate-300 hover:text-blue-600 flex items-center justify-center gap-4 shadow-xl">
                                        Exit Interface
                                        <ArrowRight className="h-5 w-5" />
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
