import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = getQuery(event).id as string
    if (!id) throw createError({ statusCode: 400, message: 'No ID provided' })

    const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: {
            parameters: {
                include: {
                    type: true,
                },
            },
        },
    })

    if (!category) throw createError({ statusCode: 404, message: 'Category not found' })

    return {
        name: category.name,
        imageUrl: `/api/category/image?id=${category.id}`,
        parameters: category.parameters.map((p) => ({
            id: p.id,
            typeId: p.typeId,
            name: p.name,
            value: p.subData,
        })),
    }
})