'use server';

import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * Server Action to log a view event for a specific module.
 * This is designed to be called from a client component.
 * @param moduleId - The ID of the module that was viewed.
 */
export async function logModuleView(moduleId: string) {
  try {
    const headersList = headers();
    const visitorId = headersList.get('x-visitor-id');

    if (visitorId && moduleId) {
      await prisma.moduleViewLog.create({
        data: {
          visitorId: visitorId,
          moduleId: moduleId,
        },
      });
    }
  } catch (error) {
    // This is a non-critical action, so we log the error for debugging
    // without blocking the request or notifying the user.
    console.error('[ANALYTICS_ERROR] Failed to log module view:', error);
  }
}
