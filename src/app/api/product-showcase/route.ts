import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client";


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



export const POST = async (request: Request) => {
    try {
        const { name, description, product_category_id, image_url } = await request.json();

        // Generate embedding using OpenAI API
        const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: description,
                model: 'text-embedding-3-small',
                encoding_format: 'float'
            })
        });

        const embeddingData = await response.json();
        const embedding = embeddingData.data[0].embedding;
        if (product_category_id) {
            const productShowCase = await prisma.$executeRaw`
                INSERT INTO "product_showcase" (name, description, image_url, product_category_id, embedding) 
                VALUES (${name}, ${description}, ${image_url}, ${product_category_id}, ${embedding}::vector)
                RETURNING id
            `;
            return new Response(JSON.stringify({ id: productShowCase }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            const productShowCase = await prisma.$executeRaw`
                INSERT INTO "product_showcase" (name, description, image_url, embedding) 
                VALUES (${name}, ${description}, ${image_url}, ${embedding}::vector)
                RETURNING id
            `;
            return new Response(JSON.stringify({ id: productShowCase }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            });
        }




        // const productShowCase = await prisma.productShowCase.create({
        //     data: {
        //         name,
        //         description,
        //         image_url,
        //         ...(product_category_id ? { product_category_id } : {}),
        //         // Use @ts-ignore to bypass TypeScript's type checking for the embedding field
        //         // @ts-ignore - The embedding field exists in the database schema but not in TypeScript types
        //         embedding: JSON.stringify(embedding)
        //     }
        // });


    } catch (error) {
        console.log("error", error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

}