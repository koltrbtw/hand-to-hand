<template>
        <div class="selectpage">
            <h1>Категория</h1>
            <div class="showpage">
                <div class="pageads">
                    <h2>Объявления</h2>

                    <button v-if="isSelf" type="button" @click="navigateTo('/create')">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 7.94444V11.5555C13 11.9386 12.8478 12.306 12.5769 12.5769C12.306 12.8478 11.9386 13 11.5555 13H1.44444C1.06135 13 0.693953 12.8478 0.423068 12.5769C0.152182 12.306 0 11.9386 0 11.5555V1.44444C0 1.06135 0.152182 0.693953 0.423068 0.423068C0.693953 0.152182 1.06135 0 1.44444 0H5.05555V1.44444H1.44444V11.5555H11.5555V7.94444H13Z" fill="white"/>
                            <path d="M13 2.88889H10.1112V0H8.66672V2.88889H5.77783V4.33333H8.66672V7.22222H10.1112V4.33333H13V2.88889Z" fill="white"/>
                        </svg>
                        <p>Разместить объявление</p>
                    </button>

                    <div class="listads">
                        <div
                            v-for="ad in ads"
                            :key="ad.id"
                            class="blockads"
                            @click="navigateTo(`/announcement?id=${ad.id}`)"
                        >
                            <div class="headerads">
                                <img :src="ad.imageUrl || '/img/noimage.png'" />
                                <span v-if="isSelf || viewedIds.includes(ad.id)">
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
                                    <p>{{ ad.price.toLocaleString() }} ₽</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="ads.length === 0" class="emptyblock">
                        <p>Объявлений пока нет</p>
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup>
import {useToastStore} from "~/stores/toast.js";

definePageMeta({ layout: 'profile' })

const { $api } = useNuxtApp()
const route = useRoute()
const userStore = useUserStore()
const user = computed(() => userStore.user)
const toast = useToastStore()

const viewedIds = ref([])

const id = computed(() => {
    const queryId = Number(route.query.id)
    return Number.isFinite(queryId) ? queryId : user.value?.id
})

const isSelf = computed(() => user.value?.id === id.value)
const ads = ref([])

onMounted(async () => {
    if (!id.value) return

    viewedIds.value = JSON.parse(localStorage.getItem('viewed') || '[]')

    try {
        const res = await $api(`/announcement/search?ownerId=${id.value}`)
        ads.value = res
    } catch (e) {
        toast.showToast('Не удалось загрузить объявления', 'error')
        console.error('Ошибка загрузки объявлений', e)
    }
})
</script>
