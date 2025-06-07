import auth from '~/server/utils/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const userId = event.context.user.id
    const body = await readBody(event)

    const { firstName, lastName } = body

    if (!firstName || !lastName) {
        throw createError({ statusCode: 400, message: 'Имя и фамилия обязательны' })
    }

    const data = {
        firstName,
        lastName,
        avatarUrl: '',
    }

    if (body.avatarUrl !== undefined) {
        data.avatarUrl = body.avatarUrl
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: data
    })

    return { status: true, user: updated }
})