// lib/data/users.ts
import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';

export async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}