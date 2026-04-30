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
        <div className="h-screen flex items-center justify-center bg-white transition-all duration-300">
            <div className="flex flex-col items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-foreground animate-pulse" />
               <p className="text-sm font-medium animate-pulse">Loading Profile...</p>
            </div>
        </div>
    );

    if (!profile) return null;

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

                <div className="mt-auto space-y-1">
                   
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
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    <header className="mb-10">
                        <h1 className="text-4xl font-extrabold text-foreground mb-2">Welcome back, {profile.name} 👋</h1>
                        <p className="text-muted-foreground">Monitor your visa verification progress and next steps.</p>
                    </header>

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="minimal-card p-6 bg-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <ShieldCheck className="h-16 w-16" />
                            </div>
                            <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-3">Application Status</h3>
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                                <p className="text-2xl font-extrabold text-foreground">{profile.applicationStatus}</p>
                            </div>
                        </div>

                        <div className="minimal-card p-6 bg-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <TrendingUp className="h-16 w-16" />
                            </div>
                            <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-3">Risk Level</h3>
                            <p className={`text-2xl font-extrabold ${profile.riskLevel === 'Low' ? 'text-emerald-600' :
                                profile.riskLevel === 'High' ? 'text-red-500' : 'text-orange-500'
                                }`}>
                                {profile.riskLevel}
                            </p>
                        </div>

                        <div className="minimal-card p-6 bg-foreground text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <FileCheck className="h-16 w-16 text-white" />
                            </div>
                            <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Overall Score</h3>
                            <div className="flex items-end gap-1">
                                <p className="text-4xl font-black">{profile.finalScore}</p>
                                <p className="text-white/50 font-bold mb-1">/ 100</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="minimal-card p-8 bg-white">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-foreground" />
                                        Verification Checklist
                                    </h3>
                                    {profile.documentsUploaded >= 3 && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await api.post('/student/analyze-all');
                                                    alert("Holistic Analysis Triggered! Check recommendations.");
                                                    window.location.reload();
                                                } catch (err) {
                                                    alert("Analysis failed. Ensure you have enough documents.");
                                                }
                                            }}
                                            className="text-[10px] font-black uppercase tracking-widest bg-accent px-4 py-2 rounded-xl hover:bg-foreground hover:text-white transition-all"
                                        >
                                            Run Holistic Review
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {[
                                        {
                                            icon: UploadCloud,
                                            title: 'Documents Uploaded',
                                            sub: 'Passport, financial & transcripts',
                                            done: profile.documentsUploaded >= 6,
                                            label: `${profile.documentsUploaded} / 6`
                                        },
                                        {
                                            icon: Mic2,
                                            title: 'AI Interview',
                                            sub: 'Verification check',
                                            done: profile.interviewStatus === 'Completed',
                                            label: profile.interviewStatus || 'Pending'
                                        },
                                        {
                                            icon: ShieldCheck,
                                            title: 'Background Verification',
                                            sub: 'Automated record validation',
                                            done: profile.backgroundScore > 0,
                                            label: profile.backgroundScore > 0 ? (profile.backgroundScore >= 20 ? 'Clear' : 'Review Required') : 'Pending'
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-accent/30 rounded-2xl border border-border/50">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-accent text-muted-foreground'}`}>
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {item.done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                                                <span className={`text-sm font-black uppercase ${item.done ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {(profile.recommendations?.length > 0) && (
                                <div className="minimal-card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                                    <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                                        <Lightbulb className="h-5 w-5 text-amber-600" />
                                        AI Recommendations
                                    </h3>
                                    <div className="space-y-2">
                                        {profile.recommendations.map((rec, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-amber-800 leading-tight">
                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                                <p>{rec}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Link href="/dashboard/student/upload" className="block p-8 bg-foreground rounded-3xl text-white shadow-xl hover:scale-[1.02] transition-all duration-200 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 h-full w-24 bg-white/10 -skew-x-12 translate-x-12 group-hover:translate-x-8 transition-transform" />
                                <h3 className="text-xl font-bold mb-2">Upload Files</h3>
                                <p className="text-white/50 text-sm mb-6 leading-relaxed">AI-powered document analysis.</p>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    Start Upload <ArrowRight className="h-4 w-4" />
                                </div>
                            </Link>
                            <Link href="/dashboard/student/interview" className="block p-8 bg-white border border-border rounded-3xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group">
                                <h3 className="text-xl font-bold text-foreground mb-2">Take Interview</h3>
                                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">AI-powered voice interview.</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    Start session <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                            <Link href="/dashboard/student/resources" className="block p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group">
                                <h3 className="text-xl font-bold text-foreground mb-2">Resources</h3>
                                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Jobs & NGO support.</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

