<script setup>
definePageMeta({ layout: 'profile' })

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const id = Number(route.query.id)

if (!id || isNaN(id)) {
    router.replace('/')
} else if (userStore.user?.id === id) {
    router.replace('/profile/edit')
} else {
    router.replace(`/profile/announcement?id=${id}`)
}
</script>

<template>
</template>