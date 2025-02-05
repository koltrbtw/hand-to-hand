<template>
    <!-- Авторизация -->

    <section class="auth">
        <img class="logo" @click="goIndex()" src="/img/logo.png">

        <section class="center">
            <section class=box>
                <h1>Авторизация</h1>

                <h2>Логин</h2>
                <input v-model="login" placeholder="Введите логин...">

                <h2>Пароль</h2>
                <input type="password" v-model="password" placeholder="Введите пароль...">

                <article class="btn green" @click="trySignIn()">Войти</article>
                <p class="move" @click="goSignUp()">Зарегистрироваться</p>
            </section>
        </section>
    </section>
</template>

<script>

export default {
    data() {
        return {
            login: "",
            password: "",
        }
    },

    methods: {
        // Попытка авторизоваться
        trySignIn: async function() {
            const response = await $fetch('/api/auth/signin', { method: "POST", body: {
                login: this.login, password: this.password
            }})

            if (!response.success) {
                alert(response.error)
                return;
            }

            const authToken = useCookie("authToken");
            authToken.value = response.token;

            const userIdCookie = useCookie("userId");
            userIdCookie.value = response.userId;

            const userNameCookie = useCookie("userName");
            userNameCookie.value = response.userName;

            await this.goIndex();
        },

        goSignUp: async function() {
            return await navigateTo('/signup')  
        },

        goIndex: async function() {
            return await navigateTo('/');
        },
    }
}

</script>