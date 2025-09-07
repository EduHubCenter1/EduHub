CREATE TYPE "public"."ResourceStatus" AS ENUM ('pending', 'approved', 'rejected');
ALTER TABLE "public"."resources" ADD COLUMN "status" "public"."ResourceStatus" NOT NULL DEFAULT 'pending';