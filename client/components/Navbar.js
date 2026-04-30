"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-border shadow-sm'
                    : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-foreground flex items-center justify-center">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-foreground">
                        EduVerify
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        How it Works
                    </Link>
                    <Link
                        href="#about"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        About
                    </Link>
                </div>

                {/* Action Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="btn-secondary h-10 px-5 text-sm">
                        Login
                    </Link>
                    <Link href="/signup" className="btn-primary h-10 px-5 text-sm">
                        Sign up
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-border px-6 py-6 space-y-4 animate-fade-in">
                    <Link href="#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                        How it Works
                    </Link>
                    <Link href="#about" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                        About
                    </Link>
                    <hr className="border-border" />
                    <div className="flex flex-col gap-3 pt-2">
                        <Link href="/login" className="btn-secondary h-10 text-sm justify-center">Login</Link>
                        <Link href="/signup" className="btn-primary h-10 text-sm justify-center">Sign up</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
