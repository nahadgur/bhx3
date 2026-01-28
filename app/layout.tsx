import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  title: 'Building Health X | NYC Building Research & Apartment Check',
  description:
    'Research any NYC building before signing your lease. Check HPD violations, DOB complaints, pest history, heat issues, and tenant reviews. Free building lookup for all 5 boroughs.',
  keywords: [
    'NYC building check',
    'apartment violations NYC',
    'HPD violations lookup',
    'NYC landlord research',
    'building complaints NYC',
    'NYC apartment search',
    'tenant reviews NYC',
    'DOB violations',
    '311 complaints NYC',
    'bed bugs NYC',
    'heat complaints NYC',
    'rent stabilized apartments',
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-88LHQSVE0N"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-88LHQSVE0N');
          `}
        </Script>

        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            })();
          `}
        </Script>
      </head>

      <body className={`${inter.variable} ${spaceMono.variable} font-sans min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  )
}
