import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user
    const body = await readBody(event)

    const toUserId = Number(body.toUserId)
    const rating = Number(body.rating)
    const text = String(body.text).trim()

    if (!toUserId || toUserId === user.id || !rating || rating < 1 || rating > 5 || !text) {
        throw createError({ statusCode: 400, message: 'Некорректные данные для отзыва' })
    }

    const existing = await prisma.feedback.findFirst({
        where: {
            fromUserId: user.id,
            toUserId,
        },
    })

    if (existing) {
        throw createError({ statusCode: 400, message: 'Вы уже оставляли отзыв этому пользователю' })
    }

    const feedback = await prisma.feedback.create({
        data: {
            fromUserId: user.id,
            toUserId,
            rating,
            text,
        },
    })

    return { status: true, feedback }
})