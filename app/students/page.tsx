import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// This is an async Server Component, which allows us to fetch data directly.
export default async function StudentsPage() {
  // Fetch all users directly from the database using Prisma.
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Our Students</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A directory of all registered students in the EduHub community.
        </p>
      </header>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
          <h3 className="text-xl font-semibold">No Students Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">As soon as students register, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4 bg-muted/30 p-4">
                <Avatar className="h-16 w-16 border-2 border-background">
                  <AvatarImage src={user.profilePictureUrl ?? undefined} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="text-xl">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
                  <CardDescription>@{user.username}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 text-sm">
                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-muted-foreground">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-muted-foreground">Institution:</span>
                    <span>{user.institution || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-muted-foreground">Field:</span>
                    <span>{user.fieldOfStudy || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-muted-foreground">Level:</span>
                    <span>{user.academicLevel || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-muted-foreground">Role:</span>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
