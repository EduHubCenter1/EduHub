// app/(admin)/dashboard/users/page.tsx
import { UsersTableShell } from "@/components/admin/users-table-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

import { headers } from 'next/headers';

async function getUsers(): Promise<User[]> {
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/users`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    return res.json();
}


export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className={'px-6'}>
      <div className="flex justify-between">
        <div>
            <h1 className=" text-2xl font-bold">Users</h1>
            <p>Manage your users here.</p>
        </div>
        <Link href="/admin/dashboard/create-user" className={cn(buttonVariants({variant: 'default'}))}>Create User</Link>
      </div>
      <UsersTableShell data={users} />
    </div>
  );
}
