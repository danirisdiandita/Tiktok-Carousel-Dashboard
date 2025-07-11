import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const status = url.searchParams.get('status') || 'all';
    const productCategory = url.searchParams.get('product_category_id') || 'all';
    const skip = (page - 1) * limit;

    let prodCategoryId: number | undefined = undefined

    if (productCategory !== 'all' && productCategory) {
        prodCategoryId = parseInt(productCategory)
    } else {
        prodCategoryId = undefined
    }

    if (prodCategoryId) {
        const carousels = await prisma.carousel.findMany({
            skip,
            take: limit,
            include: {
                images: true,
            },
            orderBy: {
                created_at: 'desc',
            },
            where: {
                status: status === 'all' ? undefined : status,
                product_category_id: productCategory === 'all' ? undefined : parseInt(productCategory),
            },
        });
        const count = await prisma.carousel.count({
            where: {
                status: status === 'all' ? undefined : status,
                product_category_id: productCategory === 'all' ? undefined : parseInt(productCategory),
            },
        });
        return new Response(JSON.stringify({ carousels, count, page, limit }));
    } else {
        const carousels = await prisma.carousel.findMany({
            skip,
            take: limit,
            include: {
                images: true,
            },
            orderBy: {
                created_at: 'desc',
            },
            where: {
                status: status === 'all' ? undefined : status,
            },
        });
        const count = await prisma.carousel.count({
            where: {
                status: status === 'all' ? undefined : status,
            },
        });
        return new Response(JSON.stringify({ carousels, count, page, limit }));
    }


}

export async function POST(request: Request) {
    const { title, description, product_category_id, images } = await request.json();

    if (product_category_id) {
        const carousel = await prisma.carousel.create({
            data: {
                title,
                description,
                product_category_id,
            },
        });

        if (images) {
            for (const image of images) {
                await prisma.carouselImage.create({
                    data: {
                        url: image.url,
                        alt: image.alt,
                        carousel_order: image.carousel_order,
                        carousel_id: carousel.id,
                    },
                });
            }
        }

        const count_ = await prisma.carousel.count();
        return new Response(JSON.stringify({ carousel, count: count_ }));
    } else {
        const carousel = await prisma.carousel.create({
            data: {
                title,
                description,
            },
        });
        const count_ = await prisma.carousel.count();
        return new Response(JSON.stringify({ carousel, count: count_ }));
    }



}


export async function PUT(request: Request) {
    const { id, title, description, images } = await request.json();
    const carousel = await prisma.carousel.update({
        where: {
            id,
        },
        data: {
            title,
            description,
            status: "draft",
        },
    });

    // Update or create images
    if (images) {
        for (const image of images) {
            if (image.id) {
                await prisma.carouselImage.upsert({
                    where: { id: image.id || 0 },
                    update: {
                        url: image.url,
                        alt: image.alt,
                        carousel_order: image.carousel_order,
                    },
                    create: {
                        url: image.url,
                        alt: image.alt,
                        carousel_id: id,
                        carousel_order: image.carousel_order,
                    },
                });
            }

        }
    }

    // Delete images that are not in the updated images list
    if (images && images.length > 0) {
        const imageIds = images.filter((img: {
            id: number;
            url: string;
            alt: string;
            carousel_order: number;
            carousel_id: number;
            created_at: string;
            updated_at: string;
        }) => img.id).map((img: {
            id: number;
            url: string;
            alt: string;
            carousel_order: number;
            carousel_id: number;
            created_at: string;
            updated_at: string;
        }) => img.id);
        await prisma.carouselImage.deleteMany({
            where: {
                carousel_id: id,
                id: { notIn: imageIds }
            },
        });
    }
    return new Response(JSON.stringify({ carousel }));
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const carousel = await prisma.carousel.delete({
        where: {
            id,
        },
    });
    return new Response(JSON.stringify({ carousel }));
}