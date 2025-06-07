import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = Number(getQuery(event).id)
    if (!id) throw createError({ statusCode: 400, message: 'Нет ИД' })

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            avatarUrl: true,
        }
    })

    if (!user) throw createError({ statusCode: 404, message: 'Пользователь не найден' })

    return { user }
})