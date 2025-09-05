import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const URL = 'https://eduhubcenter.online'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fields = await prisma.fields.findMany({
    select: {
      slug: true,
      updated_at: true,
    },
  });

  const semesters = await prisma.semester.findMany({
    select: {
      number: true,
      field: {
        select: {
          slug: true,
        },
      },
      updatedAt: true,
    },
  });

  const modules = await prisma.module.findMany({
    select: {
      slug: true,
      semester: {
        select: {
          number: true,
          field: {
            select: {
              slug: true,
            },
          },
        },
      },
      updatedAt: true,
    },
  });

  const fieldUrls = fields.map((field) => ({
    url: `${URL}/fields/${field.slug}`,
    lastModified: field.updated_at,
  }));

  const semesterUrls = semesters.map((semester) => ({
    url: `${URL}/fields/${semester.field.slug}/semesters/${semester.number}`,
    lastModified: semester.updatedAt,
  }));

  const moduleUrls = modules.map((module) => ({
    url: `${URL}/fields/${module.semester.field.slug}/semesters/${module.semester.number}/modules/${module.slug}`,
    lastModified: module.updatedAt,
  }));

  const staticUrls = [
    { url: URL, lastModified: new Date() },
    { url: `${URL}/fields`, lastModified: new Date() },
    { url: `${URL}/contact`, lastModified: new Date() },
    { url: `${URL}/about`, lastModified: new Date() },
  ];

  return [...staticUrls, ...fieldUrls, ...semesterUrls, ...moduleUrls];
}