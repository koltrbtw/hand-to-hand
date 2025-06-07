import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
    const query = getQuery(event)

    const where: any = {}

    if (query['name']) {
        where.name = {
            contains: query['name'] as string,
        }
    }

    if (query['min-price'] || query['max-price']) {
        where.price = {}
        if (query['min-price']) where.price.gte = Number(query['min-price'])
        if (query['max-price']) where.price.lte = Number(query['max-price'])
    }

    if (query['c-categoryId']) {
        where.categoryId = Number(query['c-categoryId'])
    }

    if (query['ownerId']) {
        where.creatorUserId = Number(query['ownerId'])
    }

    const parameterFilters: { categoryParameterId: number; value: string }[] = []

    for (const key in query) {
        const match = key.match(/^p-(\d+)$/)
        if (match) {
            const id = Number(match[1])
            const value = query[key]
            if (typeof value === 'string') {
                parameterFilters.push({ categoryParameterId: id, value })
            }
        }
    }

    type RangeMap = Record<number, { min?: number; max?: number }>;
    const rangeFilters: RangeMap = {}

    for (const key in query) {
        const match = key.match(/^p-(\d+)-(min|max)$/)
        if (match) {
            const paramId = Number(match[1])
            const bound = match[2]
            const value = Number(query[key])
            if (!rangeFilters[paramId]) rangeFilters[paramId] = {}
            rangeFilters[paramId][bound as 'min' | 'max'] = value
        }
    }

    const rangeMatches: number[][] = []

    for (const paramId in rangeFilters) {
        const { min, max } = rangeFilters[paramId]
        const conditions: any = {
            categoryParameterId: Number(paramId),
        }

        if (min !== undefined || max !== undefined) {
            conditions.value = {}

            if (min !== undefined) conditions.value.gte = String(min)
            if (max !== undefined) conditions.value.lte = String(max)
        }

        const matched = await prisma.adParameter.findMany({
            where: conditions,
            select: { advertisementId: true },
        })

        rangeMatches.push(matched.map((m) => m.advertisementId))
    }

    let filteredIds: number[] | null = null

    const paramTypesMap: Record<number, number> = {}

    if (parameterFilters.length) {
        const paramIds = parameterFilters.map(f => f.categoryParameterId)

        // Получаем все параметры объявлений по нужным categoryParameterId
        const matchedParams = await prisma.adParameter.findMany({
            where: {
                categoryParameterId: { in: paramIds },
            },
            select: {
                advertisementId: true,
                categoryParameterId: true,
                value: true,
            },
        })

        // Группируем по объявлению
        const adGroups: Record<number, { [paramId: number]: string[] }> = {}

        for (const p of matchedParams) {
            if (!adGroups[p.advertisementId]) adGroups[p.advertisementId] = {}
            if (!adGroups[p.advertisementId][p.categoryParameterId])
                adGroups[p.advertisementId][p.categoryParameterId] = []

            adGroups[p.advertisementId][p.categoryParameterId].push(p.value)
        }

        // Загружаем типы параметров
        const paramDefs = await prisma.categoryParameter.findMany({
            where: { id: { in: paramIds } },
            select: { id: true, typeId: true },
        })
        const paramTypes: Record<number, number> = {}
        paramDefs.forEach(p => (paramTypes[p.id] = p.typeId))

        // Фильтруем только те объявления, где все параметры удовлетворяют
        const passedIds = Object.entries(adGroups)
            .filter(([adId, paramMap]) => {
                return parameterFilters.every((f) => {
                    const typeId = paramTypes[f.categoryParameterId]
                    const values = paramMap[f.categoryParameterId] || []
                    if (typeId === 1) {
                        return values.some(v => v.toLowerCase().includes(f.value.toLowerCase()))
                    } else {
                        return values.includes(f.value)
                    }
                })
            })
            .map(([adId]) => Number(adId))

        filteredIds = passedIds
    }

    if (rangeMatches.length) {
        const intersected = rangeMatches.reduce((acc, arr) =>
                acc.filter((id) => arr.includes(id)),
            filteredIds ?? rangeMatches[0])
        filteredIds = intersected
    }

    if (filteredIds) {
        if (!filteredIds.length) return [] // ничего не найдено
        where.id = { in: filteredIds }
    }

    const sortBy = query['sort-by'] as string | undefined
    const desc = query['desc'] === '1'
    const orderBy = sortBy
        ? { [sortBy]: desc ? 'desc' : 'asc' }
        : { createdAt: 'desc' }

    console.log(where);

    const ads = await prisma.advertisement.findMany({
        where,
        orderBy: orderBy as any,
        take: 50,
        include: {
            category: true,
            images: { take: 1 },
        },
    })

    return ads.map((ad) => ({
        id: ad.id,
        name: ad.name,
        price: ad.price,
        categoryName: ad.category.name,
        imageUrl: ad.images?.[0]
            ? `/api/announcement/image?id=${ad.images[0].id}`
            : null,
    }))
})