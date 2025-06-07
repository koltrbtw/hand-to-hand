<template>
    <div class="main">
        <div class="auth">
            <h1>Авторизация</h1>
            <h2>Регистрация нового аккаунта</h2>
            <form @submit.prevent="handleRegister">
                <div class="blockauth">
                    <p>Логин</p>
                    <input v-model="login" type="text" placeholder="Придумайте логин" />
                </div>
                <div class="blockauth">
                    <p>Имя</p>
                    <input v-model="firstName" type="text" placeholder="Напишите ваше имя" />
                </div>
                <div class="blockauth">
                    <p>Фамилия</p>
                    <input v-model="lastName" type="text" placeholder="Напишите вашу фамилию" />
                </div>
                <div class="blockauth">
                    <p>Пароль</p>
                    <input v-model="password" type="password" placeholder="Придумайте пароль" />
                </div>
                <div class="blockauth">
                    <p>Повторите пароль</p>
                    <input v-model="confirmPassword" type="password" placeholder="Повторите придуманный пароль" />
                </div>
                <button class="join" type="submit"><p>Создать</p></button>
                <button class="create" type="button" @click="navigateTo('/auth')">
                    <p>Войти в существующий аккаунт</p>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['auth-redirect']
})

const login = ref('')
const firstName = ref('')
const lastName = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        alert('Пароли не совпадают')
        return
    }

    try {
        const res = await $fetch('/api/account/signup', {
            method: 'POST',
            body: {
                login: login.value,
                firstName: firstName.value,
                lastName: lastName.value,
                password: password.value,
            },
        })

        if (res?.token) {
            const cookie = useCookie('token')
            cookie.value = res.token
            await navigateTo('/')
        } else {
            alert(res.message || 'Ошибка регистрации')
        }
    } catch (e) {
        alert('Ошибка сервера')
    }
}
</script>