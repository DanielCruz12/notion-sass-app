import type { Metadata } from 'next'
import { ThemeProvider } from '@/lib/providers/next-theme-provider'
import { DM_Sans } from 'next/font/google'
import { twMerge } from 'tailwind-merge'
import AppStateProvider from '@/lib/providers/state-provider'
import { SupabaseUserProvider } from '@/lib/providers/supabase-user-provider'
import { Toaster } from '@/components/ui/toaster'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { SocketProvider } from '@/lib/providers/socket-provider'

const inter = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Daniel´s App',
  description: 'A notion clone with live editing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={twMerge('bg-background', inter.className)}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          <AppStateProvider>
            <SupabaseUserProvider>
              <SocketProvider>
                {children}
                <SpeedInsights />
                <Toaster />
              </SocketProvider>
            </SupabaseUserProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
