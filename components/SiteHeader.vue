<template>
    <div class="headers">
        <NuxtLink to="/" title="Сделка рука в руку - сайт объявлений.">
            <img src="/img/logo.png" />
        </NuxtLink>
        <div class="search">
            <input v-model="searchQuery" placeholder="Поиск по объявлениям" />
            <button @click="goSearch" type="button"><p>Найти</p></button>
        </div>
        <div v-if="!token" class="authbtn">
            <button type="button" @click="goLogin"><p>Вход и регистрация</p></button>
        </div>
        <div v-else class="profiles">
            <div class="avatar">
                <img :src="user?.avatarUrl || '/img/user.png'" />
            </div>
            <a v-if="user?.id" :href="`/profile?id=${user.id}`">Ваш профиль</a>
            <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7.5 7L14 1" stroke="black" />
            </svg>
        </div>
    </div>
</template>

<script setup>
const userStore = useUserStore()
const user = computed(() => userStore.user)

const token = useCookie('token')
const searchQuery = ref('')

function updateStore() {
    if (!userStore.user && token.value) {
        userStore.fetchUser()
    }
}

onMounted(updateStore)

watch(
  token,
  updateStore
)

const goSearch = async () => {
    if (searchQuery.value.trim()) {
        await navigateTo(`/search?name=${encodeURIComponent(searchQuery.value)}`)
    }
}

const goLogin = async () => {
    await navigateTo('/auth')
}
</script>
