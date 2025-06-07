export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token')

    if (token.value && (to.path === '/auth' || to.path === '/registration')) {
        return navigateTo('/')
    }
})