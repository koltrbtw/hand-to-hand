import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const limit = parseInt(query.limit as string) || 50

    const ads = await prisma.advertisement.findMany({
        take: limit,
        orderBy: { id: 'desc' },
        include: {
            category: true,
            images: { take: 1 },
        },
    })

    return ads.map((ad) => ({
        id: ad.id,
        imageUrl: ad.images.length ? `/api/announcement/image?id=${ad.images[0].id}` : null,
        name: ad.name,
        price: ad.price,
        categoryName: ad.category.name,
    }))
})