import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { id, status } = await request.json();
    const carousel = await prisma.carousel.update({
        where: {
            id,
        },
        data: {
            status: status,
        },
    });
    return new Response(JSON.stringify({ carousel }));
}