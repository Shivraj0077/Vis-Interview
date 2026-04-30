"use client";
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    LayoutDashboard,
    Settings,
    LogOut,
    Search,
    Filter,
    ChevronRight,
    MoreVertical,
    ArrowUpRight,
    TrendingDown,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    Loader2
} from 'lucide-react';

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

    const filteredStudents = students.filter(s =>
        s.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.passportNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFDFF] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-border p-8 flex flex-col hidden lg:flex fixed h-full">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center shadow-lg">
                        <span className="text-background font-bold text-xl">E</span>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-foreground">EduVerify <span className="text-[10px] bg-accent px-2 py-0.5 rounded-full ml-1 text-muted-foreground uppercase tracking-widest">Admin</span></span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-foreground text-background shadow-md'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? 'text-background' : 'text-muted-foreground group-hover:text-foreground'}`} />
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
            <main className="flex-1 lg:ml-72 p-6 md:p-10 lg:p-14">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-foreground mb-2">Student Applications</h1>
                            <p className="text-muted-foreground">Manage and review incoming international student verifications.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="input-field pl-10 h-11 w-64 md:w-80"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="h-11 px-4 border border-border rounded-xl hover:bg-muted transition-colors">
                                <Filter className="h-4 w-4" />
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="minimal-card p-6 bg-white overflow-hidden relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-widest">+12%</span>
                            </div>
                            <p className="text-2xl font-black text-foreground">{students.length}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Applicants</p>
                            <div className="absolute -bottom-4 -right-4 opacity-5">
                                <Users className="h-24 w-24" />
                            </div>
                        </div>
                        <div className="minimal-card p-6 bg-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-foreground">
                                {students.filter(s => s.applicationStatus === 'Pending').length}
                            </p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Pending Review</p>
                        </div>
                        <div className="minimal-card p-6 bg-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-foreground">
                                {students.filter(s => s.riskLevel === 'High').length}
                            </p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">High Risk Profiles</p>
                        </div>
                    </div>

                    <div className="minimal-card bg-white overflow-hidden border-border/60 shadow-sm">
                        {loading ? (
                            <div className="p-20 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Synchronizing Database</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/30">
                                            <th className="py-5 px-6 text-xs font-black text-muted-foreground uppercase tracking-wider">Student Profile</th>
                                            <th className="py-5 px-6 text-xs font-black text-muted-foreground uppercase tracking-wider">Passport ID</th>
                                            <th className="py-5 px-6 text-xs font-black text-muted-foreground uppercase tracking-wider">Credibility</th>
                                            <th className="py-5 px-6 text-xs font-black text-muted-foreground uppercase tracking-wider">Risk Assessment</th>
                                            <th className="py-5 px-6 text-xs font-black text-muted-foreground uppercase tracking-wider">Decision</th>
                                            <th className="py-5 px-6 text-xs font-black text-muted-foreground uppercase tracking-wider"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {filteredStudents.map((student) => (
                                            <tr key={student._id} className="group hover:bg-muted/30 transition-all duration-200">
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center font-bold text-foreground overflow-hidden border border-border uppercase">
                                                            {student.user?.name?.charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-foreground">{student.user?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 text-sm font-medium text-muted-foreground font-mono">{student.passportNumber || 'N/A'}</td>
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-foreground">{student.finalScore || 0}%</span>
                                                        <div className="w-16 h-1 w-full bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-1000 ${student.finalScore > 70 ? 'bg-green-500' : student.finalScore > 40 ? 'bg-amber-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${student.finalScore || 0}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${student.riskLevel === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                            student.riskLevel === 'Low' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                                'bg-amber-50 text-amber-600 border border-amber-100'
                                                        }`}>
                                                        <div className={`h-1.5 w-1.5 rounded-full ${student.riskLevel === 'High' ? 'bg-red-600 animate-pulse' :
                                                                student.riskLevel === 'Low' ? 'bg-green-600' : 'bg-amber-600'
                                                            }`} />
                                                        {student.riskLevel || 'TBD'}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${student.applicationStatus === 'Approved' ? 'bg-foreground text-background shadow-lg shadow-foreground/5' :
                                                            student.applicationStatus === 'Rejected' ? 'bg-muted text-muted-foreground' :
                                                                'bg-white border border-border text-foreground'
                                                        }`}>
                                                        {student.applicationStatus}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <Link
                                                        href={`/dashboard/admin/student/${student._id}`}
                                                        className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:bg-accent px-4 py-2 rounded-xl transition-all border border-transparent hover:border-border group/btn"
                                                    >
                                                        Review Details
                                                        <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredStudents.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="py-20 text-center">
                                                    <p className="text-muted-foreground font-bold italic">No matching applications found.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
