<template>
    <div class="selectpage">
        <h1>Категория</h1>
        <div class="showpage">
            <!-- Отзывы -->
            <div class="reviews">
                <h2>Отзывы</h2>

                <!-- Форма добавления отзыва -->
                <div
                    v-if="canLeaveReview && !alreadyReviewed && token"
                    class="addreviews"
                >
                      <textarea
                          v-model="form.text"
                          placeholder="Напишите отзыв о продавце"
                      ></textarea>
                    <div class="inputblock">
                        <ul>
                            <li
                                v-for="n in 5"
                                :key="n"
                                @click="form.rating = n"
                                :style="{ cursor: 'pointer', opacity: n <= form.rating ? 1 : 0.3 }"
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="black">
                                    <circle cx="5" cy="5" r="5" />
                                </svg>
                            </li>
                        </ul>
                        <button type="button" @click="submit">
                            <p>Опубликовать</p>
                        </button>
                    </div>
                </div>

                <!-- Список отзывов -->
                <div class="reviewslist">
                    <div
                        class="blockreviews"
                        v-for="item in feedbacks"
                        :key="item.id"
                    >
                        <div class="userinfo">
                            <div class="avatar">
                                <img :src="item.from.avatarUrl || '/img/user.png'" />
                            </div>
                            <div class="info">
                                <p>{{ item.from.name }}</p>
                                <div class="rating">
                                    <span>{{ formatDate(item.createdAt) }}</span>
                                    <ul>
                                        <li v-for="n in 5" :key="n">
                                            <svg
                                                v-if="n <= item.rating"
                                                width="10"
                                                height="10"
                                                viewBox="0 0 10 10"
                                                fill="black"
                                            >
                                                <circle cx="5" cy="5" r="5" />
                                            </svg>
                                            <svg
                                                v-else
                                                width="10"
                                                height="10"
                                                viewBox="0 0 10 10"
                                                fill="none"
                                                stroke="black"
                                            >
                                                <circle cx="5" cy="5" r="4.5" stroke-width="1" />
                                            </svg>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Ваш отзыв -->
                            <div v-if="item.from.id === user?.id" class="you">Ваш отзыв</div>
                        </div>
                        <div class="reviewsmsg">
                            <p>{{ item.text }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Статистика -->
            <div class="statistics" v-if="rating !== null">
                <h2>Статистика</h2>
                <div class="rating">
                    <div class="headrating">
                        <h1>{{ rating.toFixed(1) }}</h1>
                        <div class="title">
                            <p>Средне взвешанная оценка</p>
                            <span>Составлена на оценке покупателей</span>
                        </div>
                    </div>
                    <div
                        class="blockstat"
                        v-for="r in [5, 4, 3, 2, 1]"
                        :key="r"
                    >
                        <ul>
                            <li v-for="n in r" :key="n">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="black">
                                    <circle cx="5" cy="5" r="5" />
                                </svg>
                            </li>
                        </ul>
                        <div class="progbar">
                            <div
                                class="prog"
                                :style="{ width: percent(ratingStats[r]) + '%' }"
                            ></div>
                        </div>
                        <p>{{ ratingStats[r] || 0 }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'profile' })

const { $api } = useNuxtApp()
const route = useRoute()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const id = computed(() => Number(route.query.id) || user.value?.id)
const isSelf = computed(() => user.value?.id === id.value)
const canLeaveReview = computed(() => !isSelf.value && !!user.value)

const feedbacks = ref([])
const rating = ref(null)
const ratingStats = ref({})
const alreadyReviewed = ref(false)

const token = useCookie('token')

const form = reactive({
    rating: 0,
    text: '',
})

onMounted(async () => {
    await loadFeedback()
})

async function loadFeedback() {
    if (!id.value) return

    const res = await $api(`/feedback/user?id=${id.value}`)
    feedbacks.value = res.list
    rating.value = res.average
    ratingStats.value = res.countByRating

    alreadyReviewed.value = feedbacks.value.some(
        (f) => f.from.id === user.value?.id
    )
}

async function submit() {
    if (!form.rating || !form.text.trim()) return

    await $api('/feedback/leave', {
        method: 'POST',
        body: {
            toUserId: id.value,
            rating: form.rating,
            text: form.text,
        },
    })

    form.rating = 0
    form.text = ''
    await loadFeedback()
}

function percent(count) {
    const total = Object.values(ratingStats.value).reduce((sum, n) => sum + n, 0)
    if (!total) return 0
    return Math.round((count / total) * 100)
}

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU')
}

</script>
