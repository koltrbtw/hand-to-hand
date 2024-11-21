<template>
    <header>
        <img class="logo" @click="goIndex()" src="/img/logo.png">

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

    <section class="announcements">
        <section class="filters">
            <h1>Фильтрация</h1>

            <h2>Поиск</h2>
            <input v-model="searchWords" class="word-search" placeholder="Введите слова...">

            <h2>Цена</h2>
            <div class="range">
                <input placeholder="От" v-model="priceFrom">
                <input placeholder="До" v-model="priceTo">
            </div>

            <h2>Категория</h2>
            <select name="select" v-model=categoryId>
                <option value="0">Выберите категорию...</option>
                <option value="1">Авто</option>
                <option value="2">Недвижимость</option>
                <option value="3">Устройства</option>
                <option value="4">Мебель</option>
                <option value="5">Услуги</option>
                <option value="6">Одежда</option>
            </select>

            <article class="btn green" @click="apply()">Применить</article>
        </section>

        <section class="entities">
            <h1>Объявления</h1>

            <aritcle class="entity" v-for="announcement in announcements"  @click="selectAnnouncement(announcement.id)">
                <img :src="'data:image/png;base64,' + announcement.image">

                <div class="right">
                    <p class="title">{{ announcement.title }}</p>
                    <p class="price">{{ announcement.price }} ₽</p>

                    <p class="desc">{{ announcement.description }}</p>
                </div>
            </aritcle>
        </section>
    </section>
</template>

<script>

definePageMeta({
    layout: 'default',
})

export default {
    data() {
        return {
            announcements: [],
            isInAccount: false,

            priceFrom: "",
            priceTo: "",

            categoryId: "0",

            searchWords: ""
        }
    },

    mounted: async function() {
        await this.validateToken();
        await this.applyFilters();
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

        applyFilters: async function() {
            if (this.$route.query.category !== undefined)
                this.categoryId = this.$route.query.category;

            if (this.$route.query.from !== undefined)
                this.priceFrom = this.$route.query.from;

            if (this.$route.query.to !== undefined)
                this.priceTo = this.$route.query.to;

            if (this.$route.query.words !== undefined)
                this.searchWords = this.$route.query.words;

            const response = await $fetch(`/api/announcements/search${this.$route.href.replace('/announcements', '')}`);
            this.announcements = response.data;
        },

        apply: async function() {
            let params = [];

            if (this.priceFrom !== "")
                params.push("from=" + this.priceFrom)

            if (this.priceTo !== "")
                params.push("to=" + this.priceTo)

            if (this.categoryId != 0)
                params.push("category=" + this.categoryId)

            if (this.searchWords !== "")
                params.push("words=" + this.searchWords)

            const resultLink = (params.length > 0 ? "?" : "") + params.join("&");

            await navigateTo("/announcements" + resultLink);
            await this.applyFilters();
        },

        selectAnnouncement: async function(announcementId) {
            await navigateTo('/announcement?id=' + announcementId);
        },

        toAnnouncement: async function(announcementId) {
            return await navigateTo('/announcement?id=' + announcementId);
        },

        goIndex: async function() {
            return await navigateTo('/');
        },
    }
}

</script>