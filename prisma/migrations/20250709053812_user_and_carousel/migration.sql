-- CreateTable
CREATE TABLE "carousel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "carousel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carousel_image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "carousel_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carousel_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "carousel" ADD CONSTRAINT "carousel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carousel_image" ADD CONSTRAINT "carousel_image_carousel_id_fkey" FOREIGN KEY ("carousel_id") REFERENCES "carousel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
