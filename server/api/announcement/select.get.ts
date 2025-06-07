import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const idsParam = query.ids

    if (!idsParam || typeof idsParam !== 'string') {
        throw createError({ statusCode: 400, message: 'Параметр ids обязателен' })
    }

    const ids = idsParam
        .split(',')
        .map(id => Number(id))
        .filter(id => !isNaN(id))

    if (ids.length === 0) {
        return { ads: [] }
    }

    const ads = await prisma.advertisement.findMany({
        where: {
            id: { in: ids },
        },
        include: {
            images: { take: 1 },
        },
    })

    return {
        ads: ads.map(ad => ({
            id: ad.id,
            name: ad.name,
            price: ad.price,
            location: ad.location,
            imageUrl: ad.images.length ? `/api/announcement/image?id=${ad.images[0].id}` : null,
        })),
    }
})
