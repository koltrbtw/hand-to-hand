<template>
    <div class="selectpage">
        <h1>Категория</h1>
        <div class="showpage">
            <!-- Список диалогов -->
            <div class="listdialogs">
                <h2>Сообщения</h2>
                <div class="listdial">
                    <div
                        v-for="dialog in dialogs"
                        :key="dialog.id"
                        :class="['blockdial', { active: dialog.id === selectedDialog?.id }]"
                        @click="openDialog(dialog)"
                    >
                        <div class="avatar">
                            <img :src="dialog.opponent?.avatarUrl || '/img/user.png'" />
                        </div>
                        <div class="infomsg">
                            <div class="nameuser">
                                <p>{{ dialog.opponent.name }}</p>
                            </div>
                            <div class="msg">
                                <p>{{ dialog.lastMessage }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Открытый диалог -->
            <div class="opendialog">
                <h2>Переписка</h2>
                <div class="dialogmsg">
                    <template v-if="selectedDialog">
                        <div class="historymsg">
                            <div
                                v-for="(msg, index) in messages"
                                :key="msg.id"
                                :class="msg.senderId === user.id ? 'owner' : 'user'"
                            >
                                <div class="name" v-if="index === 0 || messages[index - 1].senderId !== msg.senderId">
                                    <p>{{ msg.senderId === user.id ? 'Вы' : selectedDialog.opponent.name }}</p>
                                </div>
                                <div class="msg">
                                    <p>{{ msg.text }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="blockline"></div>

                        <div class="blockinput">
                            <input
                                v-model="newMessage"
                                placeholder="Сообщение"
                                @keyup.enter="sendMessage"
                            />
                            <button @click="sendMessage">
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                    <path
                                        d="M3 3L19 11L3 19V3ZM3 9.4V12.6L11 11L3 9.4Z"
                                        fill-opacity="0.75"
                                    />
                                </svg>
                            </button>
                        </div>
                    </template>

                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import {useToastStore} from "~/stores/toast.js";

definePageMeta({ layout: 'profile' })

const { $api } = useNuxtApp()
const userStore = useUserStore()
const user = computed(() => userStore.user)
const route = useRoute()

const dialogs = ref([])
const selectedDialog = ref(null)
const messages = ref([])
const newMessage = ref('')

onMounted(async () => {
    await userStore.fetchUser()
    const res = await $api('/dialog/all')
    dialogs.value = res

    if (route.query.to !== undefined) {
        await openDialog(
            dialogs.value.find(dialog => dialog.id === Number(route.query.to))
        );
    }
})

async function openDialog(dialog) {
    selectedDialog.value = dialog
    const res = await $api(`/dialog/messages?id=${dialog.id}`)
    messages.value = res
}

async function sendMessage() {
    if (!newMessage.value.trim() || !selectedDialog.value) return

    const res = await $api('/dialog/send', {
        method: 'POST',
        body: {
            dialogId: selectedDialog.value.id,
            text: newMessage.value,
        },
    })

    messages.value.push(res.message)
    newMessage.value = ''
}
</script>

