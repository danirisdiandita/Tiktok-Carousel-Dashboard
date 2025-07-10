import { prisma } from "@/lib/prisma"

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const { name, description, image_url, product_category_id } = await request.json();
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
            UPDATE "product_showcase" 
            SET name = ${name}, 
                description = ${description}, 
                image_url = ${image_url}, 
                product_category_id = ${product_category_id}, 
                embedding = ${embedding}::vector
            WHERE id = ${id}
            RETURNING id
        `;
        return new Response(JSON.stringify({ id: productShowCase }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        const productShowCase = await prisma.$executeRaw`
            UPDATE "product_showcase" 
            SET name = ${name}, 
                description = ${description}, 
                image_url = ${image_url}, 
                embedding = ${embedding}::vector
            WHERE id = ${id}
            RETURNING id
        `;
        return new Response(JSON.stringify({ id: productShowCase }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}