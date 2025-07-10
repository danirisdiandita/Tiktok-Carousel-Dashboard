-- AlterTable
ALTER TABLE "product_showcase" ADD COLUMN     "product_category_id" INTEGER;

-- AddForeignKey
ALTER TABLE "product_showcase" ADD CONSTRAINT "product_showcase_product_category_id_fkey" FOREIGN KEY ("product_category_id") REFERENCES "product_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
