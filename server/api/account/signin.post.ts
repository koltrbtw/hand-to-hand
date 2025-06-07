import { PrismaClient } from '@prisma/client'
import { generateToken } from '~/server/utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { login, password } = body

    const user = await prisma.user.findUnique({ where: { login } })
    if (!user || user.password !== password) {
        return { status: false, message: 'Неверные данные' }
    }

    const token = generateToken({ id: user.id, login: user.login })

    return { status: true, token }
})