import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user
    const body = await readBody(event)

    const { id, name, price, description, destination, categoryId } = body

    const ad = await prisma.advertisement.findUnique({
        where: { id: Number(id) },
    })

    if (!ad || ad.creatorUserId !== user.id) {
        throw createError({ statusCode: 403, message: 'Нет доступа' })
    }

    const updated = await prisma.advertisement.update({
        where: { id: Number(id) },
        data: {
            name,
            price,
            description,
            destination,
            categoryId,
        },
    })

    return { status: true, updated }
})
