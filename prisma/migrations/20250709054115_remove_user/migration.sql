/*
  Warnings:

  - You are about to drop the column `user_id` on the `carousel` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "carousel" DROP CONSTRAINT "carousel_user_id_fkey";

-- AlterTable
ALTER TABLE "carousel" DROP COLUMN "user_id";

-- DropTable
DROP TABLE "user";
