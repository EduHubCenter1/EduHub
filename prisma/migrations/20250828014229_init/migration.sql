-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('course', 'exam', 'tp_exercise', 'project', 'presentation', 'report', 'other');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('superAdmin', 'classAdmin');

-- CreateTable
CREATE TABLE "public"."fields" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."semesters" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "fieldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."modules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submodules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submodules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."ResourceType" NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileExt" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "submoduleId" TEXT NOT NULL,
    "uploadedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admin_scopes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "semesterNumber" INTEGER NOT NULL,

    CONSTRAINT "admin_scopes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fields_slug_key" ON "public"."fields"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "semesters_fieldId_number_key" ON "public"."semesters"("fieldId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "modules_semesterId_slug_key" ON "public"."modules"("semesterId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "submodules_moduleId_slug_key" ON "public"."submodules"("moduleId", "slug");

-- CreateIndex
CREATE INDEX "resources_title_type_createdAt_idx" ON "public"."resources"("title", "type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_scopes_userId_fieldId_semesterNumber_key" ON "public"."admin_scopes"("userId", "fieldId", "semesterNumber");

-- AddForeignKey
ALTER TABLE "public"."semesters" ADD CONSTRAINT "semesters_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."modules" ADD CONSTRAINT "modules_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submodules" ADD CONSTRAINT "submodules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_submoduleId_fkey" FOREIGN KEY ("submoduleId") REFERENCES "public"."submodules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admin_scopes" ADD CONSTRAINT "admin_scopes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admin_scopes" ADD CONSTRAINT "admin_scopes_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
