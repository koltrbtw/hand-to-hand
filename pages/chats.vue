<template>
    <!-- Чаты -->

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

    <section class="chats">
        <section class="users">
            <h1>Мессенджер</h1>

            <article v-for="chat in chats" :class="{ active: chat.userId === selectedUserId }" class="user" @click="selectChat(chat.userId)">
                <h2>{{ chat.userId == myUserId ? 'Вы' : chat.userName }}</h2>
                <p>{{ chat.content }}</p>
            </article>
        </section>

        <section class="messages">
            <h1>Сообщения с собеседником</h1>

            <section class="scroll" ref="scrollChat">
                <article v-if="selectedUserId !== -1" v-for="message in messages" :class="{ right: message.id !== selectedUserId }">
                    <h2>{{ message.login }}</h2>
                    <p>{{ message.content }}</p>
                </article>
            </section>

            <section v-if="selectedUserId !== -1" class="write">
                <input v-model="message" placeholder="Введите сообщение" maxlength="255">
                <article class="btn green" @click="send()">Отправить</article>
            </section>
        </section>
    </section>
</template>

<script>

export default {
    data() {
        return {
            isInAccount: false,
            message: "",

            chats: [],

            myUserId: -1,
            myUserName: "",

            selectedUserId: -1,
            messages: []
        }
    },

    mounted: async function() {
        await this.getChats();
        await this.validateToken();

        if (this.$route.query.id !== undefined)
            this.createChat(this.$route.query.id, this.$route.query.login)

        if (!this.isInAccount)
            await navigateTo('/')
    },

    methods: {
        createChat: function(userId, login) {
            this.chats.push({
                "userName": login,
                "userId": userId,
                "content": "Начните диалог!"
            });

            this.messages = [];
            this.selectedUserId = userId;
        },

        send: async function() {
            if (this.message.length === 0)
                return;

            const authToken = useCookie("authToken");
            
            const response = await $fetch("/api/messages/send", {
                method: "POST", body: {
                    token: authToken.value, toUserId: this.selectedUserId, content: this.message
                }
            })

            if (response.success)
            {
                this.messages.push({
                    "login": this.myUserName,
                    "id": this.myUserId,
                    "content": this.message
                })

                this.message = "";
            }
        },

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

            await navigateTo('/')
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

        selectChat: async function(userId) {
            this.messages = [];
            this.selectedUserId = userId;

            const authToken = useCookie('authToken');

            const response = await $fetch(`/api/messages/byUserId`, {
                method: "POST", body: {
                    token: authToken.value, id: userId
                }
            });

            this.messages = response.messages;
            console.log(this.messages)
        },

        getChats: async function() {
            const authToken = useCookie('authToken');

            const response = await $fetch(`/api/messages/chats`, {
                method: "POST", body: {
                    token: authToken.value
                }
            });

            this.chats = response.chats;
            this.myUserId = response.userId;
            this.myUserName = response.userName;
        },

        goIndex: async function() {
            return await navigateTo('/');
        },
    }
}

</script>