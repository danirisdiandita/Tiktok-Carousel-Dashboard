import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { id } = await request.json();
    const carousel = await prisma.carousel.update({
        where: {
            id,
        },
        data: {
            status: 'published',
        },
    });
    return new Response(JSON.stringify({ carousel }));
}