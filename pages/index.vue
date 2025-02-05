<template>
    <!-- Главная страница -->

    <header>
        <img class="logo" src="/img/logo.png">

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

    <h1>Все категории</h1>

    <section class="categories">
        <article class="category" v-for="category in categories" @click="selectCategory(category.id)">
            <img :src="'/img/categories/' + category.image + '.svg'">
            <p>{{ category.name }}</p>
        </article>
    </section>

    <h1>Рекомендованные объвления</h1>

    <section class="recommended">
        <article v-for="announcement in recommended" @click="selectAnnouncement(announcement.id)">
            <img :src="'data:image/png;base64,' + announcement.image">
            <h2>{{ announcement.title }}</h2>
            <p>{{ announcement.price }} ₽</p>
        </article>
    </section>
</template>

<script>

definePageMeta({
    layout: 'default',
})

export default {
    data() {
        return {
            searchWords: "",
            isInAccount: false,

            recommended: [],

            categories: [
                {
                    id: 1,
                    image: "vehicle",
                    name: "Авто"
                },

                {
                    id: 2,
                    image: "property",
                    name: "Недвижимость"
                },

                {
                    id: 3,
                    image: "device",
                    name: "Устройства"
                },

                {
                    id: 4,
                    image: "furniture",
                    name: "Мебель"
                },

                {
                    id: 5,
                    image: "service",
                    name: "Услуги"
                },

                {
                    id: 6,
                    image: "cloth",
                    name: "Одежда"
                },
            ]
        }
    },

    mounted: async function() {
        await this.validateToken();
        await this.getRecommended();
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

        selectCategory: async function(categoryId) {
            await navigateTo('/announcements?category=' + categoryId);
        },

        selectAnnouncement: async function(announcementId) {
            await navigateTo('/announcement?id=' + announcementId);
        },

        search: async function() {
            await navigateTo('/announcements?words=' + this.searchWords);
        },

        // Полученик рекомендаций
        getRecommended: async function() {
            const response = await $fetch('/api/announcements/recommended');

            this.recommended = response.data;
        },
    }
}

</script>