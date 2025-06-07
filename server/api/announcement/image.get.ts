import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = getQuery(event).id as string
    if (!id) throw createError({ statusCode: 400, message: 'No image ID provided' })

    const image = await prisma.advertisementImage.findUnique({ where: { id: Number(id) } })
    if (!image) throw createError({ statusCode: 404, message: 'Image not found' })

    event.node.res.setHeader('Content-Type', 'image/png')
    return image.contentBlob
})
