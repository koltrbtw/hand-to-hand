import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user
    const body = await readBody(event)

    const otherUserId = Number(body.userId)
    const text = String(body.text)

    if (!otherUserId || otherUserId === user.id || !text.trim()) {
        throw createError({ statusCode: 400, message: 'Некорректные данные' })
    }

    const existing = await prisma.dialog.findFirst({
        where: {
            OR: [
                { firstUserId: user.id, twoUserId: otherUserId },
                { firstUserId: otherUserId, twoUserId: user.id },
            ],
        },
    })

    let dialogId: number

    if (existing) {
        dialogId = existing.id
    } else {
        const newDialog = await prisma.dialog.create({
            data: {
                firstUserId: user.id,
                twoUserId: otherUserId,
            },
        })
        dialogId = newDialog.id
    }

    const message = await prisma.message.create({
        data: {
            dialogId,
            senderId: user.id,
            text,
        },
    })

    return {
        status: true,
        dialogId,
        message,
    }
})
