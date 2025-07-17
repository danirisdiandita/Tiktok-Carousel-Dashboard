import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const carousel_ = await prisma.carousel.findUnique({
    include: {
      images: true,
    },
    where: {
      id: id,
    },
  });
  return new Response(JSON.stringify({ carousel: carousel_ }));
}
