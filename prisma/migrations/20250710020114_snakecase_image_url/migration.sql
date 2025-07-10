/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `product_showcase` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `product_showcase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_showcase" DROP COLUMN "imageUrl",
ADD COLUMN     "image_url" TEXT NOT NULL;
