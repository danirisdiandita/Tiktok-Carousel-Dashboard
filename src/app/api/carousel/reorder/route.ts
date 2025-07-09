// PUT /api/carousel/reorder

import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request
) {
  try {
    const { images } = await request.json();
    // images should be an array of objects with id and new order
    // e.g., [{ id: 1, order: 0 }, { id: 2, order: 1 }]

    // Create a transaction to update all images at once

    const updates = await prisma.$transaction(
      images.map((image: { id: number; order: number }) =>
        prisma.carouselImage.update({
          where: { id: image.id },
          data: { carousel_order: image.order }
        })
      )
    );

    return new Response(JSON.stringify({ success: true, updates }), {
      status: 200
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update image order" }), {
      status: 500
    });
  }
}