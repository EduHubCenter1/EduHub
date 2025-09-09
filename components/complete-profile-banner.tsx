"use client"

import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, X } from "lucide-react"
import { useState, useMemo } from "react"

export function CompleteProfileBanner() {
  const { user } = useAuthContext();
  const [isVisible, setIsVisible] = useState(true);

  const isProfileIncomplete = useMemo(() => {
    if (!user) return false;
    return !user.firstName || !user.lastName || !user.username || !user.institution || !user.fieldOfStudy || !user.academicLevel;
  }, [user]);

  if (!isProfileIncomplete || !isVisible) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="bg-secondary/20 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-primary mr-4" />
            <div>
              <h3 className="font-semibold text-foreground">Welcome to EduHub!</h3>
              <p className="text-sm text-muted-foreground">
                Your profile is incomplete. Please complete your profile to get the most out of the platform.
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Button asChild variant="default" size="sm">
              <Link href="/profile">Complete Profile</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="ml-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}