import { PrismaClient } from '@prisma/client'
import auth from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    await auth(event)
    const user = event.context.user

    const favorites = await prisma.favoriteAdvertisement.findMany({
        where: { userId: user.id },
        take: 3,
        include: {
            advertisement: {
                include: {
                    category: true,
                    images: { take: 1 },
                },
            },
        },
    })

    return favorites.map((fav) => ({
        id: fav.advertisement.id,
        imageUrl: fav.advertisement.images?.[0]
            ? `/api/announcement/image?id=${fav.advertisement.images[0].id}`
            : null,
        name: fav.advertisement.name,
        price: fav.advertisement.price,
        categoryName: fav.advertisement.category.name,
    }))
})
