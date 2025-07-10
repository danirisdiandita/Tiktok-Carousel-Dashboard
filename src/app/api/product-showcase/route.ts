import { prisma } from "@/lib/prisma"

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
        const productShowcases = await prisma.productShowCase.findMany({
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
            where: {
                status: status === 'all' ? undefined : status,
                product_category_id: productCategory === 'all' ? undefined : parseInt(productCategory),
            },
        });
        const count = await prisma.productShowCase.count({
            where: {
                status: status === 'all' ? undefined : status,
                product_category_id: productCategory === 'all' ? undefined : parseInt(productCategory),
            },
        });
        return new Response(JSON.stringify({ productShowcases, count, page, limit }));
    } else {
        const productShowcases = await prisma.productShowCase.findMany({
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
            where: {
                status: status === 'all' ? undefined : status,
            },
        });
        const count = await prisma.productShowCase.count({
            where: {
                status: status === 'all' ? undefined : status,
            },
        });
        return new Response(JSON.stringify({ productShowcases, count, page, limit }));
    }
}