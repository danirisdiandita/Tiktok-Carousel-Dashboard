import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const carouselId = url.searchParams.get('carouselId');
    if (carouselId) {
        const images = await prisma.carouselImage.findMany({
            where: {
                carousel_id: parseInt(carouselId)
            }
        });
        return new Response(JSON.stringify({ images }));
    } else {
        return new Response(JSON.stringify({ images: [] }));
    }
}

export async function POST(request: Request) {
    const { url, alt, carouselId } = await request.json();
    const image = await prisma.carouselImage.create({
        data: {
            url,
            alt,
            carousel_id: parseInt(carouselId),
        },
    });
    return new Response(JSON.stringify(image));
}