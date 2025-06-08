<template>
    <div class="toast-container">
        <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="['toast', toast.type]"
        >
            {{ toast.message }}
        </div>
    </div>
</template>

<script setup>
import { useToastStore } from '~/stores/toast'

const toastStore = useToastStore()
const toasts = computed(() => toastStore.toasts)
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    min-width: 200px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    opacity: 0.95;
    animation: fade-in 0.3s ease;
}

.toast.success {
    background-color: #4caf50;
}

.toast.error {
    background-color: #f44336;
}

.toast.warning {
    background-color: #f4b136;
}

.toast.info {
    background-color: #2196f3;
}

@keyframes fade-in {
    from {
        transform: translateY(-10px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 0.95;
    }
}
</style>
