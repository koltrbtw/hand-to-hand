<template>
    <div v-if="likedAds.length" class="rightpage">
        <h1>Отмеченные вами</h1>
        <div class="listlike">
            <div
                v-for="ad in likedAds.slice(0, 3)"
                :key="ad.id"
                class="blocklike"
                @click="goToAd(ad.id)"
            >
                <div class="headerads">
                    <img :src="ad.imageUrl" />
                </div>
                <div class="infoads">
                    <div class="like">
                        <svg class="active" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.9346 2.25C17.1798 2.25 19 4.07016 19 6.31543V6.55371C18.9999 7.6235 18.6013 8.65211 17.8867 9.44141L17.7393 9.5957L9.99902 17.335L2.26074 9.59668C1.45381 8.78975 1.00011 7.69487 1 6.55371V6.31543C1 4.07016 2.82016 2.25 5.06543 2.25C6.22324 2.25 7.32227 2.74333 8.09082 3.59961L8.24023 3.77539L9.21875 5L10 5.97559L10.7812 5L11.7598 3.77539C12.5313 2.8111 13.6995 2.25002 14.9346 2.25Z" stroke-width="2"/>
                            <path d="M1.5533 10.3033L10 18.75L18.4467 10.3033C19.4412 9.30874 20 7.95983 20 6.5533V6.31542C20 3.51788 17.7321 1.25 14.9346 1.25C13.3957 1.25 11.9404 1.94949 10.9791 3.15107L10 4.375L9.02086 3.15107C8.05959 1.94949 6.60423 1.25 5.06542 1.25C2.26788 1.25 0 3.51788 0 6.31542V6.5533C0 7.95983 0.558738 9.30874 1.5533 10.3033Z"/>
                        </svg>
                    </div>
                    <div class="nameads"><p>{{ ad.name }}</p></div>
                    <div class="price"><p>{{ ad.price.toLocaleString() }} ₽</p></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $api } = useNuxtApp()
const likedAds = ref([])
const token = useCookie('token')

async function updateFavorites() {
    if (token.value) {
        const res = await $api('/favorites/all')

        likedAds.value = res
    }
}

onMounted(updateFavorites)

const goToAd = (id) => navigateTo(`/announcement?id=${id}`)

watch(
    useRoute(),
    updateFavorites
)
</script>
