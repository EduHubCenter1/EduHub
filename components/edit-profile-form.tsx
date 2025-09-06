'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateProfile } from '@/lib/actions/user.actions'
import type { User } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export function EditProfileForm({ profile }: { profile: User }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const result = await updateProfile(formData)

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: result.message,
      })
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" defaultValue={profile.firstName ?? ''} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" defaultValue={profile.lastName ?? ''} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" defaultValue={profile.username ?? ''} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue={profile.email} disabled />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="institution">Institution / School / University</Label>
        <Input id="institution" name="institution" defaultValue={profile.institution ?? ''} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="fieldOfStudy">Field of Study / Department</Label>
        <Input id="fieldOfStudy" name="fieldOfStudy" defaultValue={profile.fieldOfStudy ?? ''} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="academicLevel">Academic Level / Year</Label>
        <Input id="academicLevel" name="academicLevel" defaultValue={profile.academicLevel ?? ''} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )
}
