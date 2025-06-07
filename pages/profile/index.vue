<script setup>
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isReady = ref(false)

onMounted(async () => {
    const id = Number(route.query.id)

    if (!id || isNaN(id)) return router.push('/')

    await userStore.fetchUser()

    if (userStore.user?.id === id) {
        router.push('/profile/edit')
    } else {
        router.push(`/profile/announcement?id=${id}`)
    }

    isReady.value = true
})
</script>

<template>
    <div v-if="!isReady">Загрузка...</div>
</template>
