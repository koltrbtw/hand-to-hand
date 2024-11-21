<template>
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

    <section class="create">
        <h1>Создание объявления</h1>

        <section class="table">
            <article class="cell">
                <h2>Название</h2>
                <input v-model="title" placeholder="Введите название...">
            </article>

            <article class="cell">
                <h2>Описание</h2>
                <input v-model="description" placeholder="Введите описание...">
            </article>

            <article class="cell">
                <h2>Цена</h2>
                <input v-model="price" placeholder="Введите цену...">
            </article>

            <article class="cell">
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
            </article>

            <article class="cell">
                <h2>Фотографии</h2>
                <input @change="onChangePhotos" type="file" placeholder="Выберите фотографии..." multiple class="styled">
            </article>

            <article class="btn green" @click="complete">Опубликовать</article>
        </section>
    </section>
</template>

<script>

export default {
    data() {
        return {
            title: "",
            price: "",
            description: "",
            categoryId: "0",
            images: null,

            isInAccount: false,
            searchWords: "",
        }
    },

    mounted: async function () {
        await this.validateToken();
        
        if (!this.isInAccount)
            return navigateTo("/")
    },

    methods: {
        onChangePhotos(event) {
            this.images = event.target.files;
        },

        goCreate: async function() {
            await navigateTo('/announcement/create')
        },

        goChats: async function() {
            await navigateTo('/chats')
        },

        logOut: async function() {
            const authToken = useCookie("authToken");
            authToken.value = undefined;

            this.isInAccount = false;

            await this.goIndex();
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

        complete: async function() {
            if (this.images === null)
                return;

            const authToken = useCookie('authToken')

            const formData = new FormData();
            formData.append('token', authToken.value);
            formData.append('title', this.title);
            formData.append('price', this.price);
            formData.append('description', this.description);
            formData.append('categoryId', this.categoryId);

            for (let i = 0; i < this.images.length; i++) {
                formData.append('photos', this.images[i]);
            }

            console.log("form data")

            const response = await $fetch("/api/announcements/create", {
                method: 'POST',
                body: formData
            });

            console.log(response)

            if (!response.success)
            {
                alert(response.error)
                return;
            }

            return await navigateTo(`/announcement?id=${response.id}`);
        },
    }
}

</script>