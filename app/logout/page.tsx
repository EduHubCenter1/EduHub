"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const logout = async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Logout failed")
        }
        // Rediriger vers la page login après logout
        router.push("/login")
        router.refresh()
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    logout()
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      {loading && <p>Déconnexion en cours...</p>}
      {error && <p className="text-red-500">Erreur : {error}</p>}
    </div>
  )
}
