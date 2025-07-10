-- CreateTable
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE "product_showcase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT NOT NULL,
    "embedding" vector,

    CONSTRAINT "product_showcase_pkey" PRIMARY KEY ("id")
);
