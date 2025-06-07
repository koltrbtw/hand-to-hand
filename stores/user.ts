import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    actions: {
        async fetchUser() {
            const { $api } = useNuxtApp()
            try {
                const res = await $api('/account/me') as any
                this.user = res.user
            } catch (err) {
                this.user = null
                console.error('Не удалось загрузить пользователя', err)
            }
        }
    }
})