import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user
    const body = await readBody(event)

    const id = Number(body.id)
    if (!id) throw createError({ statusCode: 400, message: 'Объявление не было найдено' })

    const ad = await prisma.advertisement.findUnique({ where: { id } })
    if (!ad || ad.creatorUserId !== user.id) {
        throw createError({ statusCode: 403, message: 'Это не ваше объявление' })
    }

    await prisma.advertisementImage.deleteMany({ where: { advertisementId: id } })
    await prisma.adParameter.deleteMany({ where: { advertisementId: id } })
    await prisma.favoriteAdvertisement.deleteMany({ where: { advertisementId: id } })

    await prisma.advertisement.delete({ where: { id } })

    return { status: true }
})