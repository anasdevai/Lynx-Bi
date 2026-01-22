import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: 'Lynx BI - Business Intelligence Platform',
  description: 'Power BI-inspired analytics with MIPS Assembly engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>
          {/* Background Effects */}
          <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
          <div className="fixed inset-0 bg-grid pointer-events-none opacity-30" />
          
          {/* Floating Particles */}
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 15}s`,
                  animationDuration: `${15 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>

          {/* Main Layout */}
          <div className="relative flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto relative">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
