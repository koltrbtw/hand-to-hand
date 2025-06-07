import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = getQuery(event).id as string
    if (!id) throw createError({ statusCode: 400, message: 'No ID provided' })

    const ad = await prisma.advertisement.findUnique({
        where: { id: Number(id) },
        include: {
            category: true,
            creator: true,
            images: true,
        },
    })

    if (!ad) throw createError({ statusCode: 404, message: 'Ad not found' })

    const adParams = await prisma.adParameter.findMany({
        where: { advertisementId: ad.id },
        include: { categoryParameter: true },
    })

    const parameters = adParams.map((p) => ({
        name: p.categoryParameter.name,
        value: p.value,
    }))

    const avgRating = await prisma.feedback.aggregate({
        where: { toUserId: ad.creatorUserId },
        _avg: { rating: true },
    })

    return {
        id: ad.id,
        images: ad.images.map((img) => `/api/announcement/image?id=${img.id}`),
        name: ad.name,
        price: ad.price,
        description: ad.description,
        createdAt: ad.createdAt,
        creator: {
            id: ad.creator.id,
            name: ad.creator.firstName + ' ' + ad.creator.lastName,
            avgFeedbackRating: avgRating._avg.rating ?? 0,
            createdAt: ad.creator.createdAt,
            avatarUrl: ad.creator.avatarUrl,
        },
        category: {
            id: ad.category.id,
            name: ad.category.name,
        },
        parameters
    }
})