import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    console.log('New request: ' + getRequestURL(event))

    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    if (!decoded) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }

    // @ts-ignore
    event.context.user = decoded
})