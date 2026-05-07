import './globals.css'
import { Inter, Instrument_Serif } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
})

export const metadata = {
    title: 'VisaAI | Neural Verification Platform',
    description: 'Cinematic AI-Driven Interview and Background Verification System',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
            <body 
                className={`${inter.className} bg-[#02040A] text-white antialiased selection:bg-blue-500/30`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    )
}
