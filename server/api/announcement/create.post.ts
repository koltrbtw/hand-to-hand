import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user

    const body = await readBody(event)
    const { name, price, description, destination, categoryId, images, parameters } = body

    // валидация
    if (!name || !price || !categoryId || !Array.isArray(images)) {
        return { status: false, message: 'Недостаточно данных' }
    }

    const ad = await prisma.advertisement.create({
        data: {
            creatorUserId: user.id,
            name,
            price: Number(price),
            description: description || '',
            destination: destination || '',
            categoryId: Number(categoryId),
        },
    })

    for (const base64 of images) {
        const buffer = Buffer.from(base64, 'base64')
        await prisma.advertisementImage.create({
            data: {
                advertisementId: ad.id,
                contentBlob: buffer,
            },
        })
    }

    if (Array.isArray(parameters)) {
        for (const param of parameters) {
            await prisma.adParameter.create({
                data: {
                    advertisementId: ad.id,
                    categoryParameterId: param.categoryParameterId,
                    value: String(param.value),
                },
            })
        }
    }

    return { status: true, id: ad.id }
})
