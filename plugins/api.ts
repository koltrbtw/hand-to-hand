export default defineNuxtPlugin((nuxtApp) => {
    const token = useCookie('token')

    const $api = $fetch.create({
        baseURL: '/api',
        headers: token.value
            ? { Authorization: `Bearer ${token.value}` }
            : {}
    })

    return {
        provide: {
            api: $api
        }
    }
})