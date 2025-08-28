"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"

interface Props {
  children: React.ReactNode
}

export function AuthSessionProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>
}
