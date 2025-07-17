'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import DebugPanel from '@/components/debug/DebugPanel';
import { logger } from '@/lib/logger';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    logger.info('APP_INIT', 'Application starting up', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          {process.env.NODE_ENV === 'development' && <DebugPanel />}
        </ThemeProvider>
      </body>
    </html>
  );
}