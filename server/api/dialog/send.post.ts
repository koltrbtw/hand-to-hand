import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user
    const body = await readBody(event)
    const { dialogId, text } = body

    const dialog = await prisma.dialog.findUnique({ where: { id: dialogId } })
    if (!dialog || (dialog.firstUserId !== user.id && dialog.twoUserId !== user.id)) {
        throw createError({ statusCode: 403, message: 'Нет доступа' })
    }

    const message = await prisma.message.create({
        data: {
            dialogId,
            senderId: user.id,
            text,
        },
    })

    return { status: true, message }
})
