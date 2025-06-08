import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
    state: () => ({
        toasts: [] as { id: number; message: string; type: 'success' | 'error' | 'info' | 'warning'}[],
        counter: 0,
    }),

    actions: {
        showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
            const id = this.counter++
            this.toasts.push({ id, message, type })

            setTimeout(() => {
                this.toasts = this.toasts.filter((t) => t.id !== id)
            }, 4000)
        },
    },
})