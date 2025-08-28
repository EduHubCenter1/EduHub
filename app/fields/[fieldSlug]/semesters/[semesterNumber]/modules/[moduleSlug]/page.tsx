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
import { ResourcesGrid } from '@/components/public/resources-grid';

interface ModulePageProps {
  params: {
    fieldSlug: string;
    semesterNumber: string;
    moduleSlug: string;
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { fieldSlug, semesterNumber, moduleSlug } = params;
  const semesterNumberInt = parseInt(semesterNumber, 10);

  if (isNaN(semesterNumberInt) || semesterNumberInt < 1 || semesterNumberInt > 6) {
    notFound();
  }

  const module = await prisma.module.findFirst({
    where: {
      slug: moduleSlug,
      semester: {
        number: semesterNumberInt,
        field: {
          slug: fieldSlug,
        },
      },
    },
    include: {
      semester: {
        include: {
          field: true,
        },
      },
      submodules: {
        include: {
          resources: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!module) {
    notFound();
  }

  const breadcrumbLinks = [
    { href: '/', label: 'Home' },
    { href: `/fields/${fieldSlug}`, label: module.semester.field.name },
    {
      href: `/fields/${fieldSlug}/semesters/${semesterNumber}`,
      label: `Semester ${semesterNumber}`,
    },
    {
      href: `/fields/${fieldSlug}/semesters/${semesterNumber}/modules/${moduleSlug}`,
      label: module.name,
    },
  ];

  const hasSubmodules = module.submodules && module.submodules.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbLinks} />
      <h1 className="text-3xl font-bold my-4">
        {module.name}
      </h1>

      {hasSubmodules ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {module.submodules.map((submodule) => (
            <Link
              href={`/fields/${fieldSlug}/semesters/${semesterNumber}/modules/${moduleSlug}/submodules/${submodule.slug}`}
              key={submodule.id}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>{submodule.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {submodule.description || `Browse resources for ${submodule.name}.`}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          No submodules found for this module.
        </p>
      )}
    </div>
  );
}
