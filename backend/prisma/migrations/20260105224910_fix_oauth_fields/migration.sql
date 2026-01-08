-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "email_verified" BOOLEAN DEFAULT false,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "provider_id" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
