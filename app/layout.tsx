import { DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils"
import LayoutClient from "@/components/layout-client";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next'
import { CompleteProfileBanner } from "@/components/complete-profile-banner";


const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "EduHub - Academic Resource Hub",
    template: "%s | EduHub",
  },
  description: "Student-run academic hub for organizing and sharing educational resources",
  icons: {
    icon: '/bookslogo.png',
    apple: '/bookslogo.png',
  },
  
  icons: {
    icon: '/bookslogo.png',
    apple: '/bookslogo.png',
  },
  openGraph: {
    title: "EduHub - Academic Resource Hub",
    description: "A student-run academic hub for organizing and sharing educational resources.",
    url: "https://eduhubcenter.online",
    siteName: "EduHub",
    images: [
      {
        url: "https://eduhubcenter.online/EduhubCenter.jpg",
        width: 1200,
        height: 1200,
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduHub - Academic Resource Hub",
    description: "A student-run academic hub for organizing and sharing educational resources.",
    images: ["https://eduhubcenter.online/EduhubCenter.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", dm_sans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
              <LayoutClient>
                <CompleteProfileBanner />
                {children}
              </LayoutClient>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
