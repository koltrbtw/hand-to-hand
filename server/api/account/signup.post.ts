import { PrismaClient } from '@prisma/client'
import { generateToken } from '~/server/utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { login, firstName, lastName, password } = body

    const existing = await prisma.user.findUnique({ where: { login } })
    if (existing) {
        return { status: false, message: 'Логин уже существует' }
    }

    const user = await prisma.user.create({
        data: { login, firstName, lastName, password },
    })

    const token = generateToken({ id: user.id, login: user.login })

    return { status: true, token }
})