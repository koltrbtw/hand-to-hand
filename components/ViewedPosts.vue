<template>
    <div v-if="viewedAds.length" class="rightpage">
        <h1>Вы просматривали</h1>
        <div class="listlike">
            <div
                v-for="ad in viewedAds.slice(0, 3)"
                :key="ad.id"
                class="blocklike"
                @click="goToAd(ad.id)"
            >
                <div class="headerads">
                    <img :src="ad.imageUrl" />
                </div>
                <div class="infoads">
                    <div class="nameads"><p>{{ ad.name }}</p></div>
                    <div class="price"><p>{{ ad.price.toLocaleString() }} ₽</p></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $api } = useNuxtApp()
const viewedAds = ref([])

async function updateViewed() {
    const ids = JSON.parse(localStorage.getItem('viewed') || '[]')

    if (ids.length) {
        const { ads } = await $api(`/announcement/select?ids=${ids.slice(0, 3).join(',')}`)
        viewedAds.value = ads;
    }
}

onMounted(updateViewed)

const goToAd = async (id) => await navigateTo(`/announcement?id=${id}`)

watch(
    useRoute(),
    updateViewed
)

</script>
