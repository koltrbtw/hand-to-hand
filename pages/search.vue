<template>
    <div class="searchads">
        <!-- Левая часть: фильтры -->
        <div class="filtersearch">
            <h1>Категория</h1>
            <div class="namecategory">
                <h1>{{ categoryName || 'Все категории' }}</h1>
            </div>
            <SearchFilters
                :filters="filters"
                :parameters="parameters"
                :categories="allCategories"
                :onUpdate="updateFilter"
            />
        </div>

        <!-- Правая часть: список объявлений -->
        <div class="listsearch">
            <h1>Список</h1>

            <div class="sorting" @click="toggleSortOpen" :class="{ active: sortOpen }">
                <p>Сортировать</p>
                <svg width="11" height="6" viewBox="0 0 11 6" fill="none">
                    <path d="M1 1L5.5 5L10 1" stroke="#6B6B6B" />
                </svg>
                <ul v-show="sortOpen">
                    <li @click="applySort('createdAt', true)"><p>По дате (новые)</p></li>
                    <li @click="applySort('price', false)"><p>По цене ↑</p></li>
                    <li @click="applySort('price', true)"><p>По цене ↓</p></li>
                </ul>
            </div>

            <div class="listads">
                <div
                    class="blockads"
                    v-for="ad in ads"
                    :key="ad.id"
                    @click="goToAd(ad.id)"
                >
                    <div class="headerads">
                        <img :src="ad.imageUrl || '/img/no-image.png'" />

                        <span v-if="viewedIds.includes(ad.id)">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.96003 5.28358C9.90842 5.14913 8.65696 2 5.5 2C2.34304 2 1.09158 5.14913 1.03997 5.28358C0.986675 5.42256 0.986675 5.57758 1.03997 5.71656C1.09158 5.85087 2.34304 9 5.5 9C8.65696 9 9.90842 5.85088 9.96003 5.71642C10.0133 5.57744 10.0133 5.42256 9.96003 5.28358ZM5.5 6.66667C4.8787 6.66667 4.37497 6.14429 4.37497 5.5C4.37497 4.85571 4.8787 4.33333 5.5 4.33333C6.1213 4.33333 6.62503 4.85571 6.62503 5.5C6.62503 6.14429 6.1213 6.66667 5.5 6.66667Z" fill="white"/>
                            </svg>
                            Просмотрено
                        </span>
                    </div>
                    <div class="infoads">
                        <div class="nameads">
                            <p>{{ ad.name }}</p>
                        </div>
                        <div class="price">
                            <p>{{ ad.price.toLocaleString('ru-RU') }} ₽</p>
                        </div>
                    </div>
                </div>
                <p v-if="!ads.length" style="margin-top: 20px;">Ничего не найдено</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'main' })

const { $api } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const ads = ref([])
const parameters = ref([])
const allCategories = ref([])
const categoryName = ref<string | null>(null)
const viewedIds = ref([])

const filters = ref<Record<string, any>>({ ...route.query })

onMounted(async () => {
    allCategories.value = await $api('/category/all')
    viewedIds.value = JSON.parse(localStorage.getItem('viewed') || '[]')
})

watchEffect(async () => {
    const catId = filters.value['c-categoryId']
    if (catId) {
        const res = await $api('/category/get', { query: { id: catId } })
        parameters.value = res.parameters
        categoryName.value = res.name
    } else {
        parameters.value = []
        categoryName.value = null
    }
})

const fetchAds = async () => {
    const res = await $api('/announcement/search', { query: filters.value })
    ads.value = res
}
watch(filters, fetchAds, { deep: true })
onMounted(fetchAds)

function updateFilter(key: string, value: any) {
    if (value === '' || value === null || value === undefined) {
        delete filters.value[key]
    } else {
        filters.value[key] = value
    }

    router.replace({ query: { ...filters.value } })
}

async function goToAd(id: number) {
    await navigateTo(`/announcement?id=${id}`)
}

const sortOpen = ref(false)
function toggleSortOpen() {
    sortOpen.value = !sortOpen.value
}

function applySort(field: string, desc: boolean) {
    filters.value['sort-by'] = field
    filters.value['desc'] = desc ? '1' : '0'
    router.replace({ query: { ...filters.value } })
    sortOpen.value = false

    toggleSortOpen();
}

</script>

<script lang="ts">
import SearchFilters from '~/components/SearchFilters.vue'
</script>
