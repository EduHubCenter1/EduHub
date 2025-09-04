import { DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "sonner"
import { PublicHeader } from "@/components/public/public-header"
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"


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
              <PublicHeader />
              {children}
              <Toaster richColors position="top-center" toastOptions={{
                classNames: {
                  toast: dm_sans.className,
                },
              }} />
              <ThemeToggle  />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}