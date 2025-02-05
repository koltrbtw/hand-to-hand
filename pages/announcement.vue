<template>
    <!-- Объявление -->

    <header>
        <img class="logo" @click="goIndex()" src="/img/logo.png">

        <section class="search">
            <input v-model="searchWords" placeholder="Введите ключевые слова...">
            <article @click="search()">Найти</article>
        </section>

        <section v-if="!isInAccount" @click="goSignIn()" class="btn red">Вход и регистрация</section>
        <section v-else class="in-account">
            <section class="icon" @click="goCreate()">
                <img src="/img/icons/create.svg">
            </section>
            <section class="icon" @click="goChats()">
                <img src="/img/icons/chat.svg">
            </section>
            <section class="btn red" @click="logOut()">Выйти</section>
        </section>
    </header>

    <section class="announcement" v-if="announcement !== undefined">
        <article class="visual">
            <h1>{{ announcement.title }}</h1>

            <article class="image" v-if="announcement.images">
                <img class="img" :src="getActiveImage()">

                <template v-if="announcement.images.length > 1">
                    <img @click="moveImageIndex(-1)" class="arrow-left" src="/img/icons/arrow-left.svg">
                    <img @click="moveImageIndex(1)" class="arrow-right" src="/img/icons/arrow-right.svg">
                </template>
            </article>
        </article>

        <article class="desc">
            <h1>Описание</h1>

            <p>{{ announcement.description }}</p>
        </article>

        <article class="right">
            <h1 class="price">{{ announcement.price }} ₽</h1>
            <h1 class="owner">Продавец</h1>
            <h2 class="name">{{ announcement.author }}</h2>

            <article v-if="isInAccount && getUserId() !== announcement.authorId" class="btn green" @click="writeMessage()">Написать сообщение</article>
            <article v-else-if="isInAccount && getUserId() === announcement.authorId" class="btn red" @click="remove()">Удалить</article>
            <article v-else class="btn red" @click="goSignIn()">Авторизоваться</article>
        </article>
    </section>
</template>

<script>

export default {
    data() {
        return {
            announcement: undefined,
            isInAccount: false,
            searchWords: "",

            imageIndex: 0,

        }
    },

    mounted: async function() {
        await this.validateToken();
        await this.getInformation();
    },

    methods: {
        goCreate: async function() {
            await navigateTo('/announcementcreate')
        },

        goChats: async function() {
            await navigateTo('/chats')
        },

        logOut: async function() {
            const authToken = useCookie("authToken");
            authToken.value = undefined;

            this.isInAccount = false;
        },

        goSignIn: async function() {
            return await navigateTo('/signin');  
        },

        goIndex: async function() {
            return await navigateTo('/');
        },

        search: async function() {
            await navigateTo('/announcements?words=' + this.searchWords);
        },

        // Удалить
        remove: async function() {
            const authToken = useCookie("authToken");

            const response = await $fetch("/api/announcements/remove", {
                method: "POST", body: {
                    token: authToken.value, id: this.announcement.id
                }
            })

            if (response.success)
            {
                return await navigateTo('/');
            }
        },

        getUserId: function() {
            return useCookie("userId").value
        },

        writeMessage: async function() {
            await navigateTo(`/chats?id=${this.announcement.authorId}&login=${this.announcement.author}`)
        },

        validateToken: async function() {
            const authToken = useCookie("authToken");

            if (authToken === undefined || authToken.value === undefined) {
                this.isInAccount = false;
                return;
            }

            this.isInAccount = true

            const response = await $fetch('/api/auth/validate', {
                method: "POST", body: {
                    token: authToken.value
                }
            });

            this.isInAccount = response.success;
        },

        getActiveImage: function() {
            return `data:image/png;base64,${this.announcement.images[this.imageIndex]}`
        },

        moveImageIndex: function(delta) {
            this.imageIndex = this.imageIndex + delta < 0 ? this.announcement.images.length - 1 : this.imageIndex + delta == this.announcement.images.length ? 0 : this.imageIndex + delta;
        },

        // Получение информации
        getInformation: async function() {
            const response = await $fetch(`/api/announcements/byId?id=${this.$route.query.id}`);

            this.announcement = response.announcement;
            console.log(this.announcement)
        },
    }
}

</script>