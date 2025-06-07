<template>
    <div class="main">
        <div class="homepage">
            <div class="leftpage">
                <div class="navigation">
                    <div
                        v-for="cat in categories"
                        :key="cat.id"
                        class="blocknav"
                        :style="{ gridColumn: cat.name === 'Работа' || cat.name === 'Транспорт' || cat.name === 'Недвижимость' || cat.name === 'Животные' ? 'span 2' : undefined }"
                        @click="goToCategory(cat.id)"
                    >
                        <p>{{ cat.name }}</p>
                        <img :src="cat.imageUrl || '/img/default.png'" alt="" />
                    </div>
                </div>

                <h1>Личные рекомендации</h1>
                <div class="listads">
                    <div v-for="ad in ads" :key="ad.id" class="blockads">
                        <div class="headerads" @click="goToAnnouncement(ad.id)">
                            <img :src="ad.imageUrl || '/img/ads01.png'" alt="" />

                            <span v-if="viewedIds.includes(ad.id)">
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.96003 5.28358C9.90842 5.14913 8.65696 2 5.5 2C2.34304 2 1.09158 5.14913 1.03997 5.28358C0.986675 5.42256 0.986675 5.57758 1.03997 5.71656C1.09158 5.85087 2.34304 9 5.5 9C8.65696 9 9.90842 5.85088 9.96003 5.71642C10.0133 5.57744 10.0133 5.42256 9.96003 5.28358ZM5.5 6.66667C4.8787 6.66667 4.37497 6.14429 4.37497 5.5C4.37497 4.85571 4.8787 4.33333 5.5 4.33333C6.1213 4.33333 6.62503 4.85571 6.62503 5.5C6.62503 6.14429 6.1213 6.66667 5.5 6.66667Z" fill="white"/>
                                </svg>
                                Просмотрено
                            </span>
                        </div>
                        <div class="infoads">
                            <div class="like"></div>
                            <div class="nameads">
                                <p>{{ ad.name }}</p>
                            </div>
                            <div class="price">
                                <p>{{ ad.price.toLocaleString() }} ₽</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'main' })

const categories = ref([])
const ads = ref([])

const router = useRouter()

const viewedIds = ref([])

function goToCategory(categoryId) {
    router.push({ path: '/search', query: { 'c-categoryId': categoryId } })
}

function goToAnnouncement(announcementId) {
    router.push({ path: '/announcement', query: { 'id': announcementId } })
}

onMounted(async () => {
    categories.value = await $fetch('/api/category/all')
    ads.value = await $fetch('/api/announcement/recommendations?limit=8')

    viewedIds.value = JSON.parse(localStorage.getItem('viewed') || '[]')
})
</script>