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
    { value: 'Passport', label: 'Passport (Mandatory)' },
    { value: 'Academic Transcript', label: 'Academic Transcript (Mandatory)' },
    { value: 'English Test Score', label: 'English Test Score (IELTS/TOEFL) (Mandatory)' },
    { value: 'SOP', label: 'Statement of Purpose (SOP) (Mandatory)' },
    { value: 'Resume', label: 'Resume/CV (Mandatory)' },
    { value: 'Bank Statement', label: 'Bank Statement (Mandatory)' },
    { value: 'Standardized Test', label: 'Standardized Test Score (GRE/SAT)' },
    { value: 'Degree Certificate', label: 'Previous Degree Certificate' },
];

const ANALYSIS_STEPS = [
    'Reading document contents...',
    'Extracting key information...',
    'Running identity verification...',
    'Cross-referencing databases...',
    'Evaluating authenticity markers...',
    'Generating risk assessment...',
    'Preparing your report...',
];

function generateMockResults(docType) {
    const results = {
        Passport: {
            score: 94,
            risk: 'Low',
            extractedData: {
                'Full Name': 'Shivraj Patel',
                'Passport Number': 'N7823****',
                'Nationality': 'Indian',
                'Date of Birth': '15/06/2002',
                'Expiry Date': '22/08/2035',
                'Issuing Authority': 'Government of India',
            },
            recommendations: [
                'Passport is valid and within expiration window.',
                'Photo quality meets biometric standards.',
                'MRZ code validated successfully.',
                'No alterations or tampering detected.',
            ],
        },
        'Academic Transcript': {
            score: 88,
            risk: 'Low',
            extractedData: {
                'Institution': 'University of Delhi',
                'Degree': 'Bachelor of Technology',
                'Major': 'Computer Science',
                'GPA': '3.72 / 4.00',
                'Year of Graduation': '2024',
                'Total Credits': '160',
            },
            recommendations: [
                'GPA meets minimum threshold for top-tier universities.',
                'Transcript formatting matches known institutional templates.',
                'No grade anomalies detected across semesters.',
                'Consider supplementing with department ranking if available.',
            ],
        },
        'English Test Score': {
            score: 91,
            risk: 'Low',
            extractedData: {
                'Test Type': 'IELTS Academic',
                'Overall Band': '7.5',
                'Listening': '8.0',
                'Reading': '7.5',
                'Writing': '7.0',
                'Speaking': '7.5',
            },
            recommendations: [
                'Score exceeds minimum requirements for most universities.',
                'Writing score could be improved for competitive programs.',
                'Test date is within the 2-year validity window.',
                'Score verified against official IELTS database.',
            ],
        },
        SOP: {
            score: 79,
            risk: 'Medium',
            extractedData: {
                'Word Count': '1,247',
                'Coherence Score': '85/100',
                'Plagiarism Check': '2% detected',
                'Tone Analysis': 'Professional & sincere',
                'Key Themes': 'Career goals, academic interest, cultural exchange',
                'Readability': 'Advanced',
            },
            recommendations: [
                'Strong narrative structure with clear career goals.',
                'Minimal plagiarism detected — likely citations.',
                'Consider adding more specific university program references.',
                'Tone is appropriate for academic applications.',
            ],
        },
        Resume: {
            score: 85,
            risk: 'Low',
            extractedData: {
                'Total Experience': '2 years',
                'Skills Listed': '12',
                'Projects': '5',
                'Education Entries': '2',
                'Certifications': '3',
                'Format Quality': 'Professional',
            },
            recommendations: [
                'Well-structured with clear section organization.',
                'Technical skills align with stated academic goals.',
                'Add quantifiable achievements to strengthen impact.',
                'Professional formatting with consistent typography.',
            ],
        },
        'Bank Statement': {
            score: 92,
            risk: 'Low',
            extractedData: {
                'Account Holder': 'Shivraj Patel',
                'Bank Name': 'State Bank of India',
                'Statement Period': 'Aug 2025 - Jan 2026',
                'Average Balance': '₹18,50,000',
                'Sufficient Funds': 'Yes',
                'Suspicious Activity': 'None detected',
            },
            recommendations: [
                'Sufficient funds verified for tuition and living expenses.',
                'Consistent income pattern observed over 6 months.',
                'No large unexplained deposits flagged.',
                'Account age and history meet requirements.',
            ],
        },
        'Standardized Test': {
            score: 87,
            risk: 'Low',
            extractedData: {
                'Test Type': 'GRE General',
                'Verbal Reasoning': '162 / 170',
                'Quantitative Reasoning': '167 / 170',
                'Analytical Writing': '4.5 / 6.0',
                'Total Score': '329 / 340',
                'Test Date': '15/09/2025',
            },
            recommendations: [
                'Scores are competitive for top-50 programs.',
                'Quantitative score is exceptional.',
                'Analytical writing could be improved for research-heavy programs.',
                'Test is within the 5-year validity window.',
            ],
        },
        'Degree Certificate': {
            score: 90,
            risk: 'Low',
            extractedData: {
                'Degree': 'Bachelor of Technology',
                'Institution': 'University of Delhi',
                'Year Awarded': '2024',
                'Classification': 'First Class with Distinction',
                'Registration No.': 'DU/BTech/2024/****',
                'Verification Status': 'Authentic',
            },
            recommendations: [
                'Degree certificate matches transcript records.',
                'Institution is nationally accredited.',
                'Hologram and security features validated.',
                'Registration number cross-referenced successfully.',
            ],
        },
    };

    return results[docType] || results['Passport'];
}

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [type, setType] = useState(DOC_TYPES[0].value);
    const [phase, setPhase] = useState('upload'); // 'upload' | 'analyzing' | 'results'
    const [analysisStep, setAnalysisStep] = useState(0);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [results, setResults] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    const startAnalysis = useCallback((selectedType) => {
        setPhase('analyzing');
        setAnalysisStep(0);
        setAnalysisProgress(0);

        let step = 0;
        const stepInterval = setInterval(() => {
            step++;
            if (step >= ANALYSIS_STEPS.length) {
                clearInterval(stepInterval);
            } else {
                setAnalysisStep(step);
            }
        }, 800);

        let prog = 0;
        const progInterval = setInterval(() => {
            prog += Math.random() * 8 + 2;
            if (prog >= 100) {
                prog = 100;
                clearInterval(progInterval);
                clearInterval(stepInterval);
                setTimeout(() => {
                    setResults(generateMockResults(selectedType));
                    setPhase('results');
                }, 600);
            }
            setAnalysisProgress(Math.min(prog, 100));
        }, 300);
    }, []);

    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) return;
        startAnalysis(type);
    };

    const handleReset = () => {
        setFile(null);
        setPhase('upload');
        setResults(null);
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
                                                    stroke={results.score >= 80 ? '#10B981' : results.score >= 60 ? '#F59E0B' : '#EF4444'}
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${2 * Math.PI * 42}`}
                                                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - results.score / 100) }}
                                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-black text-foreground">{results.score}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Score</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                                <h2 className="text-2xl font-extrabold text-foreground">
                                                    Analysis Complete
                                                </h2>
                                            </div>
                                            <p className="text-muted-foreground mb-4">
                                                Your {type.toLowerCase()} has been analyzed and verified by our AI system.
                                            </p>
                                            <div className="flex items-center gap-4 justify-center md:justify-start">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${results.risk === 'Low'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : results.risk === 'Medium'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    Risk: {results.risk}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent text-foreground">
                                                    {type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Extracted Data */}
                                <div className="minimal-card p-0 bg-white overflow-hidden">
                                    <div className="p-6 border-b border-border bg-accent/30">
                                        <h3 className="font-bold text-foreground flex items-center gap-2">
                                            <Eye className="h-5 w-5" />
                                            Extracted Information
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">Key data extracted from your document.</p>
                                    </div>
                                    <div className="p-6">
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(results.extractedData).map(([key, value]) => (
                                                <motion.div
                                                    key={key}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-4 bg-accent/30 rounded-xl border border-border/40"
                                                >
                                                    <dt className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">{key}</dt>
                                                    <dd className="text-sm font-bold text-foreground">{value}</dd>
                                                </motion.div>
                                            ))}
                                        </dl>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="minimal-card p-0 bg-white overflow-hidden">
                                    <div className="p-6 border-b border-border bg-accent/30">
                                        <h3 className="font-bold text-foreground flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            AI Recommendations
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {results.recommendations.map((rec, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/30 transition-colors"
                                            >
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                                <p className="text-sm font-medium text-foreground">{rec}</p>
                                            </motion.div>
                                        ))}
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
