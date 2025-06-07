<template>
    <div class="main">
        <div class="auth">
            <h1>Авторизация</h1>
            <h2>Вход в существующий аккаунт</h2>
            <form @submit.prevent="handleLogin">
                <div class="blockauth">
                    <p>Логин</p>
                    <input v-model="login" type="text" placeholder="Напишите ваш логин" />
                </div>
                <div class="blockauth">
                    <p>Пароль</p>
                    <input v-model="password" type="password" placeholder="Напишите пароль от аккаунта" />
                </div>
                <label role="checkbox">
                    <input name="remember" type="checkbox" v-model="remember" />
                    <span>Запомнить пароль</span>
                    <!--a href="/resotre">Забыли пароль?</a-->
                </label>
                <button class="join" type="submit"><p>Войти</p></button>
                <button class="create" type="button" @click="navigateTo('/registration')">
                    <p>Создать новый аккаунт</p>
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
const password = ref('')
const remember = ref(false)

const handleLogin = async () => {
    try {
        const res = await $fetch('/api/account/signin', {
            method: 'POST',
            body: { login: login.value, password: password.value },
        })

        if (res?.token) {
            const token = useCookie('token', {
                maxAge: remember.value ? 60 * 60 * 24 * 7 : undefined,
            })
            token.value = res.token;
            await navigateTo('/')
        } else {
            alert(res.message || 'Ошибка входа')
        }
    } catch (e) {
        alert('Ошибка сервера')
    }
}
</script>