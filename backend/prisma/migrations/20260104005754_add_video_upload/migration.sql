-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "thumbnailKey" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "videoKey" TEXT,
ALTER COLUMN "videoUrl" DROP NOT NULL;
