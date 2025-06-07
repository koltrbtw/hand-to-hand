import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user

    const dialogs = await prisma.dialog.findMany({
        where: {
            OR: [
                { firstUserId: user.id },
                { twoUserId: user.id },
            ],
        },
        include: {
            messages: {
                take: 1,
                orderBy: { createdAt: 'desc' },
            },
            firstUser: true,
            secondUser: true,
        },
    })

    return dialogs.map((dialog) => {
        const opponent = dialog.firstUserId === user.id ? dialog.secondUser : dialog.firstUser
        return {
            id: dialog.id,
            lastMessage: dialog.messages[0]?.text || '',
            opponent: {
                id: opponent.id,
                name: `${opponent.firstName} ${opponent.lastName}`,
                avatarUrl: opponent.avatarUrl,
            },
        }
    })
})
