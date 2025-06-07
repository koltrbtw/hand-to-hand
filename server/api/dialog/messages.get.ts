import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user
    const id = Number(getQuery(event).id)

    const dialog = await prisma.dialog.findUnique({ where: { id } })
    if (!dialog || (dialog.firstUserId !== user.id && dialog.twoUserId !== user.id)) {
        throw createError({ statusCode: 403, message: 'Нет доступа' })
    }

    const messages = await prisma.message.findMany({
        where: { dialogId: id },
        orderBy: { createdAt: 'asc' },
    })

    return messages
})
