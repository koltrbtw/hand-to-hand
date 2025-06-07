import auth from '~/server/utils/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const userId = event.context.user.id

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            login: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            avatarUrl: true
        }
    })

    return { user }
})