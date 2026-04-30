/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#FFFFFF',
                foreground: '#0F172A',
                primary: {
                    DEFAULT: '#0F172A',
                    foreground: '#F8FAFC',
                },
                secondary: {
                    DEFAULT: '#F1F5F9',
                    foreground: '#0F172A',
                },
                muted: {
                    DEFAULT: '#F8FAFC',
                    foreground: '#64748B',
                },
                accent: {
                    DEFAULT: '#F1F5F9',
                    foreground: '#0F172A',
                },
                destructive: {
                    DEFAULT: '#EF4444',
                    foreground: '#FFFFFF',
                },
                border: '#E2E8F0',
                input: '#E2E8F0',
                ring: '#0F172A',
                card: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#0F172A',
                },
            },
            borderRadius: {
                lg: '0.75rem',
                md: 'calc(0.75rem - 2px)',
                sm: 'calc(0.75rem - 4px)',
            },
            animation: {
                'fade-in': 'fade-in 0.6s ease-out',
                'slide-up': 'slide-up 0.6s ease-out',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
}
