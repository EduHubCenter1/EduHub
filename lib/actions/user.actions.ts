'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {prisma} from '@/lib/prisma'

export async function getProfile() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  })

  return profile
}

export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update your profile.' }
  }

  const data = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    username: formData.get('username') as string,
    institution: formData.get('institution') as string,
    fieldOfStudy: formData.get('fieldOfStudy') as string,
    academicLevel: formData.get('academicLevel') as string,
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data,
    })

    revalidatePath('/profile')
    return { message: 'Profile updated successfully.' }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { error: 'Failed to update profile.' }
  }
}
