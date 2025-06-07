import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const userId = Number(getQuery(event).id)
    if (!userId) throw createError({ statusCode: 400, message: 'Неверный id' })

    const feedbacks = await prisma.feedback.findMany({
        where: { toUserId: userId },
        include: { from: true },
        orderBy: { createdAt: 'desc' },
    })

    const avg = await prisma.feedback.aggregate({
        where: { toUserId: userId },
        _avg: { rating: true },
    })

    const countByRating: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const f of feedbacks) {
        if (countByRating[f.rating] !== undefined) {
            countByRating[f.rating]++
        }
    }

    return {
        average: avg._avg.rating ?? null,
        countByRating,
        list: feedbacks.map(f => ({
            id: f.id,
            rating: f.rating,
            text: f.text,
            createdAt: f.createdAt,
            from: {
                id: f.from.id,
                name: `${f.from.firstName} ${f.from.lastName}`,
                avatarUrl: f.from.avatarUrl
            }
        }))
    }
})