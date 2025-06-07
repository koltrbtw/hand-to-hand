import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
    const categories = await prisma.category.findMany()

    return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        imageUrl: `/api/category/image?id=${cat.id}`,
    }))
})
