import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user
    const body = await readBody(event)
    const adId = Number(body.id)
    const status = Boolean(body.status)

    if (!adId || typeof status !== 'boolean') {
        return { status: false, message: 'Неверные параметры' }
    }

    const existing = await prisma.favoriteAdvertisement.findFirst({
        where: { userId: user.id, advertisementId: adId },
    })

    if (status && !existing) {
        await prisma.favoriteAdvertisement.create({
            data: {
                userId: user.id,
                advertisementId: adId,
            },
        })
    } else if (!status && existing) {
        await prisma.favoriteAdvertisement.delete({
            where: { id: existing.id },
        })
    }

    return { status: true }
})
