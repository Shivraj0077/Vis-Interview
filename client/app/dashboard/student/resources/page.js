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
    Star,
    DollarSign,
    Clock,
    Search,
    Filter,
    Globe,
    Building2,
    Users,
} from 'lucide-react';

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
    {
        title: 'Business Intelligence Analyst',
        company: 'Amazon',
        location: 'Seattle, WA',
        type: 'Full-time',
        salary: '$90,000 - $120,000',
        posted: '4 days ago',
        sponsorship: true,
        description: 'Drive data-driven decisions across supply chain and logistics.',
        tags: ['SQL', 'Excel', 'Redshift'],
    },
    {
        title: 'Graduate Teaching Assistant',
        company: 'Stanford University',
        location: 'Palo Alto, CA',
        type: 'Part-time',
        salary: '$30/hr + Tuition Waiver',
        posted: '1 day ago',
        sponsorship: false,
        description: 'Assist professors with CS courses while pursuing your graduate degree.',
        tags: ['Teaching', 'CS', 'Mentoring'],
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
    {
        name: 'NAFSA International Educators',
        focus: 'Student Exchange & Advocacy',
        location: 'Washington, DC',
        website: 'nafsa.org',
        description: 'Advocates for international education and provides resources for students, scholars, and institutions.',
        services: ['Policy Advocacy', 'Networking', 'Professional Development'],
    },
    {
        name: 'UnidosUS',
        focus: 'Immigration Advocacy',
        location: 'Nationwide, USA',
        website: 'unidosus.org',
        description: 'Largest Latino civil rights organization providing immigration policy advocacy and community support.',
        services: ['Immigration Aid', 'Community Programs', 'Policy Research'],
    },
    {
        name: 'Immigrants Rising',
        focus: 'Entrepreneurship & Education',
        location: 'San Francisco, CA',
        website: 'immigrantsrising.org',
        description: 'Empowers undocumented students and immigrants to achieve educational and entrepreneurial goals.',
        services: ['Scholarships', 'Legal Resources', 'Business Grants'],
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
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    <header className="mb-8">
                        <h1 className="text-4xl font-extrabold text-foreground mb-2">Resources & Support</h1>
                        <p className="text-muted-foreground">Find jobs, immigration lawyers, and NGO support to help your journey.</p>
                    </header>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-12 h-12 text-base rounded-2xl"
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-foreground text-white shadow-md'
                                    : 'bg-white text-muted-foreground border border-border hover:bg-accent hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ════════ JOBS TAB ════════ */}
                    {activeTab === 'jobs' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            {MOCK_JOBS.filter((j) =>
                                !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((job, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="minimal-card p-6 bg-white hover:shadow-lg transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
                                                    <Building2 className="h-5 w-5 text-foreground" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground group-hover:underline underline-offset-4">{job.title}</h3>
                                                    <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3 ml-14">{job.description}</p>
                                            <div className="flex flex-wrap gap-2 ml-14">
                                                {job.tags.map((tag) => (
                                                    <span key={tag} className="px-2.5 py-1 bg-accent rounded-lg text-[11px] font-bold text-foreground uppercase tracking-wider">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 ml-14 md:ml-0 shrink-0">
                                            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                <DollarSign className="h-4 w-4 text-emerald-500" />
                                                {job.salary}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                {job.posted}
                                            </div>
                                            {job.sponsorship && (
                                                <span className="px-2.5 py-1 bg-emerald-100 rounded-lg text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                                                    ✓ Visa Sponsorship
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}


                    {/* ════════ NGOs TAB ════════ */}
                    {activeTab === 'ngos' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                        >
                            {MOCK_NGOS.filter((n) =>
                                !searchQuery || n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.focus.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((ngo, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="minimal-card p-6 bg-white hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center shrink-0">
                                            <HeartHandshake className="h-6 w-6 text-rose-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-foreground">{ngo.name}</h3>
                                            <p className="text-sm text-muted-foreground font-medium">{ngo.focus}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-4">{ngo.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {ngo.services.map((svc) => (
                                            <span key={svc} className="px-2.5 py-1 bg-accent rounded-lg text-[11px] font-bold text-foreground uppercase tracking-wider">
                                                {svc}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            {ngo.location}
                                        </div>
                                        <a
                                            href={`https://${ngo.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:underline underline-offset-4"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            {ngo.website}
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
