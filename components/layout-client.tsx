'use client'

import { usePathname } from 'next/navigation';
import { PublicHeader } from "@/components/public/public-header";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Toaster } from "sonner";
import { DM_Sans } from "next/font/google";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/dashboard');

  return (
    <>
      {!isAdminRoute && <PublicHeader />}
      {children}
      <Toaster richColors position="top-center" toastOptions={{
        classNames: {
          toast: dm_sans.className,
        },
      }} />
      <ThemeToggle  />
    </>
  );
}