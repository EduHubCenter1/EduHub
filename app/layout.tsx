import { DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils"
import LayoutClient from "@/components/layout-client";


const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "EduHub - Academic Resource Hub",
  description: "Student-run academic hub for organizing and sharing educational resources",
  generator: "v0.app",
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
                {children}
              </LayoutClient>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}