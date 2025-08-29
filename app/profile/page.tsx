"use client"

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push("/login") // Redirect to login if not authenticated
      }
      setLoading(false)
    }

    getUser()
  }, [router])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading user data...</div>
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">User not found. Please log in.</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">User Profile</h1>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300"><strong>ID:</strong> {user.id}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {user.email}</p>
          {user.role && <p className="text-gray-700 dark:text-gray-300"><strong>Role:</strong> {user.role}</p>}
          {user.user_metadata && Object.keys(user.user_metadata).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">User Metadata:</h2>
              {Object.entries(user.user_metadata).map(([key, value]) => (
                <p key={key} className="text-gray-700 dark:text-gray-300">
                  <strong>{key}:</strong> {JSON.stringify(value)}
                </p>
              ))}
            </div>
          )}
          <p className="text-gray-700 dark:text-gray-300"><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>Last Sign In At:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
