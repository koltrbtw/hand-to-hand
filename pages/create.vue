<template>
    <div class="main">
        <div class="addads">
            <h1>Размещение объявления</h1>
            <h2>Основная информация</h2>
            <div class="osninfo">
                <div class="infoads">
                    <div class="blockinfoads">
                        <h3>Название объявления</h3>
                        <div class="inputblock">
                            <input v-model="form.name" placeholder="Название объявления" />
                        </div>
                    </div>
                    <div class="twoblocks">
                        <div class="blockinfoads">
                            <h3>Категория</h3>
                            <div class="catologlist" @click="toggleCategoryList" :class="{ active: categoryOpen}">
                                <p>{{ selectedCategory?.name || 'Выберите категорию' }}</p>
                                <svg width="13" height="7"><path d="M1 1L6.5 6L12 1" stroke="#6B6B6B"/></svg>
                                <ul v-show="categoryOpen">
                                    <li v-for="cat in categories" :key="cat.id" @click.stop="selectCategory(cat)">
                                        <p>{{ cat.name }}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="blockinfoads">
                            <h3>Цена</h3>
                            <div class="inputblock">
                                <input v-model="form.price" type="number" placeholder="Укажите цену" />
                                <span>₽</span>
                            </div>
                        </div>
                    </div>
                    <div class="blockinfoads" style="width: 630px;">
                        <h3>Детальное описание</h3>
                        <div class="textblock">
                            <textarea v-model="form.description" placeholder="Заполните описание о объявлении..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="imagesads">
                    <h3>Фотографии</h3>
                    <div class="imageslist">
                        <div class="addimages" @click="triggerUpload">
                            <div class="plus">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.5 1V12" stroke="black" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M1 6.5L12 6.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <svg width="36" height="27" viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 4.5H8.37868L12 0.878685C12.5626 0.316065 13.3257 0 14.1213 0H21.8787C22.6743 0 23.4373 0.316065 24 0.878685L27.6213 4.5H31.5C33.9854 4.5 36 6.51473 36 9V22.5C36 24.9853 33.9854 27 31.5 27H4.5C2.01472 27 0 24.9853 0 22.5V9C0 6.51473 2.01472 4.5 4.5 4.5ZM22.5 15C22.5 17.4853 20.4853 19.5 18 19.5C15.5147 19.5 13.5 17.4853 13.5 15C13.5 12.5147 15.5147 10.5 18 10.5C20.4853 10.5 22.5 12.5147 22.5 15ZM25.5 15C25.5 19.1421 22.1421 22.5 18 22.5C13.8579 22.5 10.5 19.1421 10.5 15C10.5 10.8579 13.8579 7.5 18 7.5C22.1421 7.5 25.5 10.8579 25.5 15Z" fill="#DFDFE0"/>
                            </svg>
                            <input ref="fileInput" type="file" accept="image/*" @change="handleFile" hidden />
                        </div>
                        <div class="images" v-for="(img, index) in form.images" :key="index">
                            <img :src="'data:image/jpeg;base64,' + img" />
                        </div>
                    </div>
                </div>
            </div>

            <h2>Дополнительная информация</h2>
            <div class="dopinfo">
                <div v-for="param in categoryParams" :key="param.id" class="blockinfo">
                    <h3>{{ param.name }}</h3>
                    <div v-if="param.typeId === 1" class="inputblock">
                        <input v-model="form.parameters[param.id]" type="text" />
                    </div>
                    <div v-else-if="param.typeId === 2" class="listbtn">
                        <span
                            v-for="option in param.value"
                            :key="option"
                            :class="{ active: form.parameters[param.id] === option }"
                            @click="form.parameters[param.id] = option"
                        >
                          {{ option }}
                        </span>
                    </div>

                    <div v-if="param.typeId === 3" class="inputblock">
                        <input v-model="form.parameters[param.id]" type="number" placeholder="Введите значение" />
                        <span>{{param.value}}</span>
                    </div>
                </div>
            </div>

            <h2>Завершение</h2>
            <label role="checkbox">
                <input type="checkbox" v-model="agreed" />
                <span>Я согласен(-а) на правила опубликования объявлений на данном ресурсе</span>
            </label>
            <button type="submit" @click="submit"><p>Опубликовать</p></button>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

const { $api } = useNuxtApp()
const router = useRouter()

const categories = ref([])
const categoryOpen = ref(false)
const selectedCategory = ref(null)
const categoryParams = ref([])

const fileInput = ref(null)
const agreed = ref(false)

const form = reactive({
    name: '',
    price: '',
    description: '',
    destination: '',
    categoryId: null,
    images: [],
    parameters: {},
})

onMounted(async () => {
    const res = await $api('/api/category/all')
    categories.value = res
})

function toggleCategoryList() {
    categoryOpen.value = !categoryOpen.value
}

async function selectCategory(cat) {
    selectedCategory.value = cat
    form.categoryId = cat.id
    categoryOpen.value = false

    const res = await $api(`/api/category/get?id=${cat.id}`)
    categoryParams.value = res.parameters

    form.parameters = {}
}

function triggerUpload() {
    fileInput.value?.click()
}

function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        form.images.push(base64)
    }
    reader.readAsDataURL(file)
}

async function submit() {
    if (!form.name || !form.price || !form.categoryId || !agreed.value) return alert('Заполните все обязательные поля и подтвердите согласие.')

    const payload = {
        ...form,
        price: Number(form.price),
        parameters: Object.entries(form.parameters).map(([id, value]) => ({
            categoryParameterId: Number(id),
            value,
        })),
    }

    const res = await $api('/api/announcement/create', { method: 'POST', body: payload })
    if (res.status) {
        router.push(`/announcement?id=${res.id}`)
    } else {
        alert('Ошибка создания объявления')
    }
}
</script>
