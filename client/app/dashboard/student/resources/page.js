"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    UploadCloud,
    Mic2,
    Compass,
    LogOut,
    Briefcase,
    HeartHandshake,
    MapPin,
    ExternalLink,
    DollarSign,
    Clock,
    Search,
    Building2,
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

const TABS = [
    { id: 'jobs', label: 'Jobs & Opportunities', icon: Briefcase },
    { id: 'ngos', label: 'NGOs & Support', icon: HeartHandshake },
];

const MOCK_JOBS = [
    {
        title: 'Software Engineer Intern',
        company: 'Google',
        location: 'Mountain View, CA',
        type: 'Full-time',
        salary: '$85,000 - $110,000',
        posted: '2 days ago',
        sponsorship: true,
        description: 'Join Google\'s engineering team and build products used by billions. H-1B sponsorship available for qualified candidates.',
        tags: ['React', 'Python', 'Cloud'],
    },
    {
        title: 'Data Analyst',
        company: 'Microsoft',
        location: 'Redmond, WA',
        type: 'Full-time',
        salary: '$75,000 - $95,000',
        posted: '5 days ago',
        sponsorship: true,
        description: 'Analyze large datasets and create insights for product teams. Visa sponsorship provided.',
        tags: ['SQL', 'Tableau', 'Python'],
    },
    {
        title: 'Research Assistant',
        company: 'MIT Media Lab',
        location: 'Cambridge, MA',
        type: 'Part-time',
        salary: '$25 - $35/hr',
        posted: '1 week ago',
        sponsorship: true,
        description: 'Work alongside world-class researchers on cutting-edge AI and HCI projects.',
        tags: ['AI/ML', 'Research', 'Python'],
    },
    {
        title: 'Frontend Developer',
        company: 'Stripe',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120,000 - $160,000',
        posted: '3 days ago',
        sponsorship: true,
        description: 'Build beautiful payment interfaces that power the internet economy.',
        tags: ['React', 'TypeScript', 'CSS'],
    },
];

const MOCK_NGOS = [
    {
        name: 'World Education Services (WES)',
        focus: 'Credential Evaluation',
        location: 'Global',
        website: 'wes.org',
        description: 'Evaluates international academic credentials for immigration, employment, and education in the US and Canada.',
        services: ['Credential Evaluation', 'Career Guidance', 'Scholarship Info'],
    },
    {
        name: 'International Rescue Committee',
        focus: 'Refugee & Immigrant Support',
        location: 'Nationwide, USA',
        website: 'rescue.org',
        description: 'Provides resettlement assistance, legal aid, ESL classes, and employment services for immigrants.',
        services: ['Legal Aid', 'Employment Support', 'Language Classes'],
    },
];

export default function ResourcesPage() {
    const [activeTab, setActiveTab] = useState('jobs');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const pathname = usePathname();

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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <header className="mb-20 border-b border-white/5 pb-12">
                        <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-[0.3em] mb-4">Post-Verification Network</div>
                        <h1 className="text-6xl font-light tracking-tighter text-white mb-2 italic font-serif leading-none">Resources</h1>
                        <p className="text-white/80 text-xl font-light tracking-tight">System scan complete // Verified opportunities detected</p>
                    </header>

                    {/* Search Bar (High Fidelity) */}
                    <div className="mb-16">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-white/40 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search the vector network..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-20 pl-16 pr-8 bg-white/5 border border-white/10 rounded-[24px] focus:bg-white focus:text-slate-900 focus:border-blue-500/50 outline-none transition-all text-2xl font-light italic font-serif placeholder:text-white/30"
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 mb-16 overflow-x-auto pb-4 scrollbar-hide">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-white text-black shadow-2xl scale-105'
                                    : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="h-5 w-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-8">
                        {activeTab === 'jobs' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                {MOCK_JOBS.filter((j) =>
                                    !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((job, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-12 bg-white rounded-[48px] shadow-[0_24px_80px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-400/10 via-blue-500/30 to-blue-400/10" />
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 relative z-10">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-8 mb-10">
                                                    <div className="h-20 w-20 rounded-[24px] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm group-hover:bg-blue-50 transition-colors">
                                                        <Building2 className="h-10 w-10 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-4xl font-light tracking-tighter text-slate-900 mb-2 italic font-serif leading-none">{job.title}</h3>
                                                        <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em] font-bold">{job.company}</p>
                                                    </div>
                                                </div>
                                                <p className="text-2xl text-slate-600 mb-10 font-light leading-relaxed max-w-3xl italic font-serif">"{job.description}"</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {job.tags.map((tag) => (
                                                        <span key={tag} className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start lg:items-end gap-6 shrink-0 pt-4">
                                                <div className="flex items-center gap-4 text-3xl font-light tracking-tighter text-slate-900 italic font-serif">
                                                    <DollarSign className="h-6 w-6 text-blue-500" />
                                                    {job.salary}
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-4 text-sm text-slate-500 font-mono uppercase tracking-[0.2em] font-bold">
                                                        <MapPin className="h-5 w-5 text-slate-300" />
                                                        {job.location}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-slate-500 font-mono uppercase tracking-[0.2em] font-bold">
                                                        <Clock className="h-5 w-5 text-slate-300" />
                                                        {job.posted}
                                                    </div>
                                                </div>
                                                {job.sponsorship && (
                                                    <div className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-xs font-mono uppercase tracking-[0.2em] font-bold shadow-xl">
                                                        Verified Sponsorship
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'ngos' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                            >
                                {MOCK_NGOS.filter((n) =>
                                    !searchQuery || n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.focus.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((ngo, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-12 bg-white rounded-[48px] shadow-[0_24px_80px_rgba(0,0,0,0.3)] relative overflow-hidden group border border-slate-50"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50" />
                                        <div className="flex items-start gap-8 mb-10">
                                            <div className="h-20 w-20 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-50 transition-colors">
                                                <HeartHandshake className="h-10 w-10 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-3xl font-light tracking-tighter text-slate-900 italic font-serif leading-none mb-2">{ngo.name}</h3>
                                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] font-bold">{ngo.focus}</p>
                                            </div>
                                        </div>

                                        <p className="text-xl text-slate-500 mb-10 font-light leading-relaxed italic font-serif">"{ngo.description}"</p>

                                        <div className="flex flex-wrap gap-3 mb-12">
                                            {ngo.services.map((svc) => (
                                                <span key={svc} className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                                                    {svc}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                                            <div className="flex items-center gap-4 text-xs text-slate-300 font-mono uppercase tracking-[0.2em] font-bold">
                                                <MapPin className="h-5 w-5 text-slate-200" />
                                                {ngo.location}
                                            </div>
                                            <a
                                                href={`https://${ngo.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 text-xs font-bold text-slate-900 uppercase tracking-[0.3em] hover:text-blue-600 transition-all font-mono"
                                            >
                                                Portal Interface
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
