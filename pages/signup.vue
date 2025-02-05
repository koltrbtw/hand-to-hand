<template>
    <!-- Регистрация -->
    <section class="auth">
        <img class="logo" @click="goIndex()" src="/img/logo.png">

        <section class="center">
            <section class=box>
                <h1>Регистрация</h1>

                <h2>Логин</h2>
                <input v-model="login" placeholder="Придумайте логин...">

                <h2>Пароль</h2>
                <input type="password" v-model="password" placeholder="Придумайте пароль...">

                <h2>Повторите пароль</h2>
                <input type="password" v-model="repeatPassword" placeholder="Повторите пароль...">

                <article class="btn green" @click="trySignUp()">Создать</article>
                <p class="move" @click="goSignIn()">Авторизоваться</p>
            </section>
        </section>
    </section>
</template>

<script>

export default {
    data() {
        return {
            login: "",
            repeatPassword: "",
            password: "",
        }
    },

    methods: {
        // Попытка регистрации
        trySignUp: async function() {
            if (this.password != this.repeatPassword)
            {
                alert("Пароли не совпадают")
                return;
            }

            const response = await $fetch('/api/auth/signup', { method: "POST", body: {
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

        goSignIn: async function() {
            return await navigateTo('/signin')  
        },

        goIndex: async function() {
            return await navigateTo('/');
        },
    }
}

</script>