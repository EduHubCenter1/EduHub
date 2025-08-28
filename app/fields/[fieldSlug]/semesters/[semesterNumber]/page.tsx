import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SemesterPageProps {
  params: {
    fieldSlug: string;
    semesterNumber: string;
  };
}

export default async function SemesterPage({ params }: SemesterPageProps) {
  const { fieldSlug, semesterNumber } = params;
  const semesterNumberInt = parseInt(semesterNumber, 10);

  if (isNaN(semesterNumberInt)) {
    notFound();
  }

  const field = await prisma.field.findUnique({
    where: { slug: fieldSlug },
  });

  if (!field) {
    notFound();
  }

  const semester = await prisma.semester.findUnique({
    where: {
      fieldId_number: {
        fieldId: field.id,
        number: semesterNumberInt,
      },
    },
    include: {
      modules: true,
    },
  });

  if (!semester) {
    notFound();
  }

  const breadcrumbLinks = [
    { href: '/', label: 'Home' },
    { href: `/fields/${field.slug}`, label: field.name },
    {
      href: `/fields/${field.slug}/semesters/${semester.number}`,
      label: `Semester ${semester.number}`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbLinks} />
      <h1 className="text-3xl font-bold my-4">
        Modules for {field.name} - Semester {semester.number}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {semester.modules.map((module) => (
          <Link
            href={`/fields/${field.slug}/semesters/${semester.number}/modules/${module.slug}`}
            key={module.id}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>{module.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse submodules and resources for {module.name}.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {semester.modules.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No modules found for this semester yet.
        </p>
      )}
    </div>
  );
}
