"use client";
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users,
    LayoutDashboard,
    Settings,
    LogOut,
    Search,
    Filter,
    ChevronRight,
    TrendingUp,
    AlertCircle,
    Clock,
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

export default function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await api.get('/admin/students');
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const navItems = [
        { name: 'Student Overview', href: '/dashboard/admin', icon: Users },
        { name: 'Application Logs', href: '/dashboard/admin/logs', icon: LayoutDashboard },
        { name: 'System Settings', href: '/dashboard/admin/settings', icon: Settings },
    ];

    const filteredStudents = students
        .filter(s =>
            s.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.passportNumber?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white text-slate-900">
            <div className="flex flex-col items-center gap-6">
               <div className="h-16 w-16 border-t-4 border-blue-600 rounded-full animate-spin shadow-lg" />
               <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono font-bold">Synchronizing Global Database...</p>
            </div>
        </div>
    );

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
                    <span className="text-2xl font-light tracking-tighter text-white">VisaAI <span className="text-[10px] font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full ml-2 uppercase">Root</span></span>
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
                        className="flex items-center gap-4 py-4 px-6 w-full rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">Terminate</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
                        <div>
                            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">Omniscience Protocol</div>
                            <h1 className="text-5xl font-light tracking-tighter text-white mb-2 italic font-serif leading-none">Command</h1>
                            <p className="text-white/80 text-xl font-light tracking-tight leading-relaxed">Neural surveillance active // Real-time vector monitoring</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by Identity or Passport..."
                                    className="h-14 pl-14 pr-8 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:bg-white focus:text-slate-900 outline-none transition-all w-64 md:w-[480px] text-lg font-light placeholder:text-white/30"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="h-14 w-14 flex items-center justify-center border border-white/10 rounded-2xl hover:bg-white/5 transition-all text-white/20 hover:text-white">
                                <Filter className="h-5 w-5" />
                            </button>
                        </div>
                    </header>

                    {/* Stats Section (Converted to White Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                          { label: "Active Nodes", value: students.length, icon: TrendingUp, color: "blue", trend: "+ Neural Growth" },
                          { label: "Awaiting Sync", value: students.filter(s => s.applicationStatus === 'Pending').length, icon: Clock, color: "amber", trend: "Calibration Req" },
                          { label: "Anomalies", value: students.filter(s => s.riskLevel === 'High').length, icon: AlertCircle, color: "red", trend: "Deep Scan Alert" }
                        ].map((stat, i) => (
                          <div key={i} className="p-10 bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group border border-white/10">
                              <stat.icon className="absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.03] text-black group-hover:opacity-[0.08] transition-opacity" />
                              <div className="flex justify-between items-start mb-10">
                                  <div className={`h-12 w-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                                      <stat.icon className="h-6 w-6" />
                                  </div>
                                  <span className={`text-xs font-mono text-${stat.color}-600 bg-${stat.color}-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em] font-bold`}>{stat.trend}</span>
                              </div>
                              <p className="text-6xl font-extralight tracking-tighter text-slate-900">{stat.value}</p>
                              <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mt-4">{stat.label}</p>
                          </div>
                        ))}
                    </div>

                    {/* Table Section (White) */}
                    <div className="bg-white rounded-[48px] shadow-[0_32px_100px_rgba(0,0,0,0.4)] overflow-hidden border border-white/10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="py-8 px-12 text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Subject Profile</th>
                                        <th className="py-8 px-12 text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Identity Vector</th>
                                        <th className="py-8 px-12 text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Integrity</th>
                                        <th className="py-8 px-12 text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Inertia</th>
                                        <th className="py-8 px-12 text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                        <th className="py-8 px-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="group hover:bg-blue-50/50 transition-all duration-300">
                                            <td className="py-8 px-12">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 border border-slate-200 uppercase text-lg italic font-serif">
                                                        {student.user?.name?.charAt(0)}
                                                    </div>
                                                    <span className="text-xl font-light tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">{student.user?.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-8 px-12 text-base font-mono text-slate-500 font-bold uppercase tracking-widest">{student.passportNumber || 'NULL_VECTOR'}</td>
                                            <td className="py-8 px-12">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-lg font-mono text-slate-900 font-bold">{student.finalScore || 0}%</span>
                                                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${student.finalScore > 70 ? 'bg-emerald-500' : student.finalScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                            style={{ width: `${student.finalScore || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-8 px-12">
                                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.2em] font-bold ${student.riskLevel === 'High' ? 'text-red-600 bg-red-50' : student.riskLevel === 'Low' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${student.riskLevel === 'High' ? 'bg-red-600 animate-pulse' : student.riskLevel === 'Low' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                                                    {student.riskLevel || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="py-8 px-12">
                                                <span className={`text-xs font-mono uppercase tracking-[0.2em] font-bold ${student.applicationStatus === 'Approved' ? 'text-emerald-600' : student.applicationStatus === 'Rejected' ? 'text-red-600' : 'text-slate-400'}`}>
                                                    {student.applicationStatus}
                                                </span>
                                            </td>
                                            <td className="py-8 px-12 text-right">
                                                <Link
                                                    href={`/dashboard/admin/student/${student._id}`}
                                                    className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all group/btn font-bold"
                                                >
                                                    Audit Sequence
                                                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-40 text-center">
                                                <div className="flex flex-col items-center gap-6">
                                                    <ShieldCheck className="h-12 w-12 text-slate-100" />
                                                    <p className="text-slate-300 font-mono text-xs uppercase tracking-[0.4em]">Zero Subjects detected in current matrix segment.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
