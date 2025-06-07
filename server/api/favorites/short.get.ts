import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user

    const ids = await prisma.favoriteAdvertisement.findMany({
        where: { userId: user.id },
        select: { advertisementId: true },
    })

    return ids.map((i) => i.advertisementId)
})
