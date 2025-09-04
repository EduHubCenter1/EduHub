"use client"

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import {
  LogOutIcon,
} from "lucide-react"

export function LogoutButton() {
  const router = useRouter()
  

 const handleLogout = async () => {
  const res = await fetch('/api/auth/logout', { method: 'POST' })
  if (res.ok) {
    router.push('/login')
    router.refresh()
  }
}


  return (
<Button onClick={handleLogout} variant="ghost">
      <LogOutIcon className="h-4 w-4" />
    </Button>  )
}
