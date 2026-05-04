"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';
import api from '../../lib/api';

const NoiseFilter = () => (
  <svg className="pointer-events-none fixed isolate z-50 opacity-[0.02] mix-blend-soft-light w-full h-full">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            if (data.role === 'admin') {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard/student');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative selection:bg-blue-500/30 font-sans overflow-hidden flex flex-col items-center justify-center p-6 bg-[#02040A]">
            <NoiseFilter />

            {/* ════════════ BACKGROUND (FIXED) ════════════ */}
            <div className="fixed inset-0 z-0 pointer-events-none">s
                <div
                    className="absolute inset-0 bg-cover bg-right bg-no-repeat"
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

            <Link
                href="/"
                className="absolute top-8 left-8 z-20 flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors font-bold"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[460px] z-10"
            >
                <div className="p-12 bg-white rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] relative overflow-hidden group border border-white/10">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-400/20 via-blue-500 to-blue-400/20" />
                    
                    <div className="mb-12 text-center">
                        <h2 className="text-5xl font-light tracking-tighter mb-4 text-slate-900 italic font-serif">Welcome Back</h2>
                        <p className="text-slate-500 text-lg font-light">Access your verification dashboard</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-4 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-3"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono ml-1">Network Access</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500/50 focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-900 text-lg font-light"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono">Security Key</label>
                                <Link href="#" className="text-[10px] text-blue-500 hover:underline uppercase tracking-widest font-bold">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500/50 focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-900 text-lg font-light"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 mt-6"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize Access"}
                        </button>
                    </form>

                    <p className="mt-12 text-center text-sm text-slate-400 tracking-wide font-light">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
