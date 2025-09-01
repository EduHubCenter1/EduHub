// lib/data/users.ts
import { createClient, User } from '@supabase/supabase-js';

// This client is for server-side use only, with admin privileges.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUsers(): Promise<User[]> {
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error("Failed to fetch users:", error);
    // Return empty array on error to prevent page crash
    return []; 
  }

  return users;
}
