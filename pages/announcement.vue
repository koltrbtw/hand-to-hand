<template>
    <div class="leftpage">
        <div class="viewingads" v-if="ad">
            <div class="headviewads">
                <div class="nameads">
                    <h1>{{ ad.category.name }}</h1>
                    <p>{{ ad.name }}</p>
                </div>
                <div class="priceads">
                    <h1>Цена</h1>
                    <p>{{ ad.price.toLocaleString('ru-RU') }} ₽</p>
                </div>
            </div>
            <div class="likeads">
                <div v-if="token"
                    class="like"
                    :class="{ active: isTracked }"
                    @click="toggleTrack"
                >
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.00965 6.20798L6.5 12L11.9904 6.20798C12.6368 5.52599 13 4.60102 13 3.63655V3.47343C13 1.55511 11.5259 0 9.70751 0C8.70724 0 7.76127 0.479649 7.13644 1.30359L6.5 2.14286L5.86356 1.30359C5.23873 0.479649 4.29275 0 3.29253 0C1.47412 0 0 1.55511 0 3.47343V3.63655C0 4.60102 0.363179 5.52599 1.00965 6.20798Z"/>
                        <path d="M9.70703 0.5C11.2244 0.5 12.5 1.80592 12.5 3.47363V3.63672C12.5 4.37204 12.2574 5.07712 11.8242 5.63477L11.6279 5.86426L6.5 11.2725L1.37207 5.86426C0.816286 5.27789 0.500043 4.47685 0.5 3.63672V3.47363C0.5 1.80592 1.77557 0.5 3.29297 0.5C4.07827 0.500133 4.83129 0.853062 5.3623 1.47754L5.46484 1.60547L6.10156 2.44531L6.5 2.9707L6.89844 2.44531L7.53516 1.60547C8.0691 0.901559 8.8696 0.500152 9.70703 0.5Z"/>
                    </svg>
                    <p>{{ isTracked ? 'Отслеживается' : 'Отслеживать' }}</p>
                </div>
            </div>
            <div class="infoads">
                <div class="info">
                    <div class="bigimages">
                        <img :src="selectedImage || '/img/no-image.png'" />
                    </div>
                    <div class="listimages">
                        <div
                            v-for="(img, index) in ad.images"
                            :key="index"
                            class="blockimg"
                            :class="{ active: selectedImage === img }"
                            @click="selectedImage = img"
                        >
                            <img :src="img" />
                        </div>
                    </div>

                    <div class="description">
                        <h1>Описание</h1>
                        <p>{{ ad.description }}</p>
                    </div>

                    <div class="specifications">
                        <h1>Характеристики</h1>
                        <div class="listspec">
                            <div v-for="(param, index) in ad.parameters" :key="index" class="blockspec">
                                <h2>{{ param.name }}</h2>
                                <div class="spec"><p>{{ param.value }}</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="profiles">
                    <div class="user">
                        <div class="userinfo">
                            <div class="username">
                                <a :href="`/profile?id=${ad.creator.id}`">{{ad.creator.name}}</a>
                            </div>
                            <div class="userrating">
                                <p>{{ ad.creator.avgFeedbackRating.toFixed(1) }}</p>
                                <ul></ul>
                            </div>
                            <div class="userreg">
                                <p>Зарегистрирован {{ formatDate(ad.creator.createdAt) }}</p>
                            </div>
                        </div>
                        <div class="useravatar">
                            <img :src="ad.creator.avatarUrl || '/img/user.png'" />
                        </div>
                    </div>

                    <button type="button" @click="moveToProfile"><p>Объявления продавца</p></button>
                    <button v-if="isSelf" type="button" @click="removeAnnouncement"><p>Удалить</p></button>

                    <div class="userpm" v-if="token && !isSelf">
                        <h1>Спросите сразу</h1>
                        <div class="blockpm">
                            <textarea v-model="messageText" placeholder="Добрый день! Подскажите"></textarea>
                            <button type="submit" @click="sendMessage">
                                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.21087 6.00165H2.23029M2.11747 6.51898L1.45982 8.46668C1.09963 9.5334 0.919537 10.0668 1.04878 10.3952C1.16101 10.6804 1.40207 10.8967 1.69952 10.979C2.04204 11.0738 2.55938 10.8429 3.59407 10.3814L10.2273 7.4219C11.2373 6.97128 11.7422 6.74604 11.8983 6.43306C12.0339 6.16116 12.0339 5.84208 11.8983 5.57018C11.7422 5.25726 11.2373 5.03195 10.2273 4.58137L3.58263 1.61684C2.55106 1.15661 2.03528 0.926495 1.6931 1.0209C1.39593 1.10287 1.1549 1.31855 1.04228 1.60325C0.912586 1.93109 1.09076 2.46329 1.4471 3.52771L2.11874 5.53397C2.17994 5.71677 2.21055 5.8082 2.22262 5.90165C2.23334 5.98465 2.23323 6.06862 2.2223 6.15155C2.20998 6.245 2.17914 6.33631 2.11747 6.51898Z" stroke="#898989" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div class="quickmes">
                            <span @click="quickMessage('Можно посмотреть сегодня?')">Можно посмотреть сегодня?</span>
                            <span @click="quickMessage('Сбросите цену?')">Сбросите цену?</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {useToastStore} from "~/stores/toast";

definePageMeta({ layout: 'main' })

const { $api } = useNuxtApp()
const route = useRoute()
const ad = ref<any>(null)
const messageText = ref('')
const selectedImage = ref('')
const isTracked = ref(false)
const token = useCookie('token')
const isSelf = ref(false)

const userStore = useUserStore()
const toast = useToastStore()

async function fetchAd() {
    const res = await $api('/announcement/get', { query: { id: route.query.id } })
    ad.value = res;

    selectedImage.value = res.images[0] || ''

    const id = res.id
    const stored = JSON.parse(localStorage.getItem('viewed') || '[]')

    const updated = [id, ...stored.filter((v: number) => v !== id)].slice(0, 30)
    localStorage.setItem('viewed', JSON.stringify(updated))

    try {
        const trackedIds: number[] = await $api('/favorites/short')
        isTracked.value = trackedIds.includes(id)
    } catch (e) {
        isTracked.value = false
    }

    await userStore.fetchUser()

    isSelf.value = userStore.user?.id === res.creator.id
}

async function toggleTrack() {
    const id = ad.value.id
    const newStatus = !isTracked.value
    const res = await $api('/favorites/status', {
        method: 'POST',
        body: { id, status: newStatus },
    })

    if (res.status) {
        isTracked.value = newStatus

        if (newStatus) {
            toast.showToast('Объявление добавлено в избранное', 'success')
        } else {
            toast.showToast('Объявление было убрано из избранного', 'warning')
        }
    }
}

async function removeAnnouncement() {
    const res = await $api('/announcement/delete', {
        method: 'POST',
        body: { id: ad.value.id },
    })

    if (res.status !== undefined) {
        toast.showToast('Вы удалили объявление', 'warning')
        await navigateTo('/')
    } else {
        toast.showToast(res.message || 'Ошибка при удалении', 'error')
    }
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function quickMessage(text: string) {
    messageText.value = text
}

async function sendMessage() {
    if (!messageText.value.trim()) return

    await $api('/dialog/create', {
        method: 'POST',
        body: {
            userId: ad.value.creator.id,
            text: messageText.value,
        },
    })

    messageText.value = ''

    await navigateTo(`/profile/dialog?to=${ad.value.creator.id}`)
}

async function moveToProfile() {
    await navigateTo(`/profile/announcement?id=${ad.value.creator.id}`);
}

onMounted(fetchAd)

watch(
    useRoute(),
    fetchAd,
)

</script>
