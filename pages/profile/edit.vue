<template>
        <div class="selectpage">
            <h1>Категория</h1>
            <div class="showpage">
                <!-- Левая колонка: редактирование данных -->
                <div class="profilesinfo">
                    <h2>Управление профилем</h2>
                    <div class="info">
                        <div class="blockinfo">
                            <h3>Имя</h3>
                            <div class="inputblock">
                                <input v-model="form.firstName" type="text" placeholder="Имя" />
                            </div>
                        </div>
                        <div class="blockinfo">
                            <h3>Фамилия</h3>
                            <div class="inputblock">
                                <input v-model="form.lastName" type="text" placeholder="Фамилия" />
                            </div>
                        </div>
                        <div class="blockinfo">
                            <h3>Дата регистрации</h3>
                            <div class="inputblock">
                                <input :value="formatDate(user?.createdAt)" type="text" disabled />
                            </div>
                        </div>
                        <div class="blockinfo">
                            <h3>Подтвержение</h3>
                            <button class="save" @click="save">Сохранить</button>
                        </div>
                    </div>
                </div>

                <!-- Правая колонка: Аватар -->
                <div class="profilesavatar">
                    <h2>Аватар</h2>
                    <div class="avatar">
                        <img :src="previewUrl" alt="avatar" />
                        <div class="edit">
                            <input type="file" @change="handleFileChange" accept="image/*" />
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0)">
                                    <path d="M0 12.6667L9.83333 2.83333L13.1667 6.16667L3.33333 16H0V12.6667ZM15.75 3.58333L14.125 5.20833L10.7917 1.875L12.4167 0.25C12.5833 0.0833333 12.7917 0 13.0417 0C13.2917 0 13.5 0.0833333 13.6667 0.25L15.75 2.33333C15.9167 2.5 16 2.70833 16 2.95833C16 3.20833 15.9167 3.41667 15.75 3.58333Z"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup>
definePageMeta({ layout: 'profile' })

const { $api } = useNuxtApp()
const userStore = useUserStore()
const user = computed(() => userStore.user)

const form = reactive({
    firstName: '',
    lastName: '',
})

const avatarFile = ref(null)
const previewUrl = ref('')

// Подгружаем данные
onMounted(() => {
    if (user.value) {
        form.firstName = user.value.firstName || ''
        form.lastName = user.value.lastName || ''
        previewUrl.value = user.value.avatarUrl || '/img/user.png'
    }
})

function handleFileChange(e) {
    console.log(e);

    const target = e.target
    const file = target.files[0]

    if (!file) return

    avatarFile.value = file
    previewUrl.value = URL.createObjectURL(file)
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('ru-RU')
}

async function save() {
    try {
        const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
        }

        if (avatarFile.value) {
            const formData = new FormData()
            formData.append('file', avatarFile.value)

            const uploaded = await $fetch('/api/upload/avatar', {
                method: 'POST',
                body: formData,
            })

            payload.avatarUrl = uploaded.url
        }

        await $api('/account/me', {
            method: 'PATCH',
            body: payload,
        })

        await userStore.fetchUser()

        alert('Профиль обновлён!')
    } catch (e) {
        console.error('Ошибка сохранения:', e)
        alert('Ошибка при сохранении')
    }
}
</script>
