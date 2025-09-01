'use server';

import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/data/users'; // Import the shared client

export async function getAdminScopesByUserId(userId: string) {
  if (!userId) {
    console.error('getAdminScopesByUserId: userId is required');
    return { error: 'User ID is required.' };
  }

  try {
    const adminScopes = await prisma.adminScope.findMany({
      where: { userId: userId },
      include: {
        field: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return { data: adminScopes };
  } catch (error) {
    console.error(`Failed to fetch admin scopes for user ${userId}:`, error);
    return { error: 'An error occurred while fetching admin scopes.' };
  }
}

export async function updateUser(userId: string, userData: { email: string, firstName: string, lastName: string, role: string, adminScopes: any[] }) {
  if (!userId) {
    return { error: "User ID is required." };
  }

  try {
    const { email, firstName, lastName, role, adminScopes } = userData;

    // --- Update Supabase Auth User ---
    const user_metadata: { [key: string]: any } = {};
    if (firstName !== undefined) user_metadata.firstName = firstName;
    if (lastName !== undefined) user_metadata.lastName = lastName;
    if (role !== undefined) user_metadata.role = role;

    const { data: user, error: userUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        email,
        user_metadata: Object.keys(user_metadata).length > 0 ? user_metadata : undefined,
      }
    );

    if (userUpdateError) {
      console.error(`Failed to update user with id ${userId}:`, userUpdateError);
      return { error: `Failed to update user: ${userUpdateError.message}` };
    }

    // --- Update Admin Scopes (if provided) ---
    if (adminScopes && Array.isArray(adminScopes)) {
      // 1. Delete all existing scopes for the user
      await prisma.adminScope.deleteMany({
        where: { userId: userId },
      });

      // 2. Create new scopes if there are any to add
      if (adminScopes.length > 0) {
        await prisma.adminScope.createMany({
          data: adminScopes.map((scope: any) => ({
            userId: userId,
            fieldId: scope.fieldId,
            semesterNumber: scope.semesterNumber,
          })),
        });
      }
    }

    return { success: "User successfully updated." };
  } catch (error: any) {
    console.error("An unexpected error occurred during user update:", error);
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}

export async function deleteUser(userId: string) {
  if (!userId) {
    return { error: "User ID is required." };
  }
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error(`Failed to delete user with id ${userId}:`, error);
      return { error: `Failed to delete user: ${error.message}` };
    }
    return { success: "User successfully deleted." };
  } catch (error: any) {
    console.error("An unexpected error occurred during user deletion:", error);
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}