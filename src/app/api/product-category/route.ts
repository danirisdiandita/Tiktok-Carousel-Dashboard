import { prisma } from "@/lib/prisma"

export async function GET() {
    const productCategories = await prisma.productCategory.findMany()
    return new Response(JSON.stringify(productCategories))
}

export async function POST(request: Request) {
    const { name, description } = await request.json()
    const productCategory = await prisma.productCategory.create({
        data: {
            name,
            description,
        },
    })
    return new Response(JSON.stringify(productCategory))
}