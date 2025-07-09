
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    const carousels = await prisma.carousel.findMany({
        skip,
        take: limit,
        include: {
            images: true,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
    const count = await prisma.carousel.count();
    return new Response(JSON.stringify({ carousels, count, page, limit }));
}

export async function POST(request: Request) {
    const { title, description } = await request.json();
    const carousel = await prisma.carousel.create({
        data: {
            title,
            description,
        },
    });

    const count_ = await prisma.carousel.count();
    return new Response(JSON.stringify({ carousel, count: count_ }));
}