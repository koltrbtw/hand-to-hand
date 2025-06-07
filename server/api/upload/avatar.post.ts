import { writeFile } from 'fs/promises'
import { v4 as uuid } from 'uuid'

export default defineEventHandler(async (event) => {
    const form = await readMultipartFormData(event)
    const file = form?.find(f => f.name === 'file')

    if (!file)
        throw createError({ statusCode: 400, message: 'No file uploaded' })

    if (file.filename === undefined)
        throw createError({ statusCode: 400, message: 'Invalid file' })

    const fileName = `${uuid()}.${file.filename.split('.').pop()}`
    const filePath = `./public/uploads/${fileName}`

    await writeFile(filePath, file.data)

    return { url: `/uploads/${fileName}` }
})