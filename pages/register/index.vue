<script setup>
    definePageMeta({ layout: "auth" })

    import { ref } from 'vue'
    import { useUserStore } from "@assets/utils/user"
    import regex from "@assets/utils/regex.js"

    const auth = useUserStore()

    const email = ref(null)
    const username = ref(null)
    const password = ref(null)

    const isSent = ref(false)

    async function sendData() {
        const iaAuthorised = await auth.registerUser(username.value, email.value, password.value)

        if (!iaAuthorised) return
        isSent = true
    }
</script>


<template>
    <div class="mainContent" v-if="!isSent">
        <div>
            <p class="mainTitle">Регистрация</p>
            <p class="mainDescription">Рады знакомству!</p>
        </div>
        <form class="loginForm" @submit.prevent="sendData()">
            <div class="inputText">
                <div class="label">Псевдоним</div>
                <input 
                    name="username"
                    type="text"
                    class="icon icon_user"  
                    placeholder="Аркадий Гачибасов"  
                    @change="(event) => event.target.classList.add('inputInvalid')" 
                    maxlength="32"
                    :pattern="`${regex.USERNAME}`"
                    v-model="username"
                required>
            </div>
            <div class="inputText">
                <div class="label">Электронная почта</div>
                <input 
                    name="email"
                    type="email"
                    class="icon icon_mail"  
                    placeholder="tapiri@smashup.ru"  
                    @change="(event) => event.target.classList.add('inputInvalid')" 
                    :pattern="`${regex.EMAIL}`"
                    v-model="email"
                required>
            </div>
            <div class="inputText">
                <div class="label">Пароль</div>
                <input 
                    name="password"
                    type="password"
                    class="icon icon_lock"  
                    placeholder="1kLaSsRULIT6969"  
                    @change="(event) => event.target.classList.add('inputInvalid')" 
                    maxlength="32"
                    :pattern="`${regex.PASSWORD}`"
                    v-model="password"
                required>
            </div>
            <div class="checkBoxContainer">
                <input class="checkBox" type="checkbox" id="loginCheckbox" required>
                <label for="loginCheckbox">
                    <div>Я принимаю <NuxtLink to="/404">пользовательское соглашение</NuxtLink><br>и <NuxtLink to="/404">политику конфиденциальности</NuxtLink></div>
                </label>
            </div>
            <button class="button button_fill button_fill_default1">Войти</button>
        </form>

        <div class="lineContainer">
            <span class="line"></span>
            <p class="lineText">Зарегистрироваться с помощью</p>
            <span class="line"></span>
        </div>

        <div>
            <button class="button button_stroke button_stroke_default2"><img src="/icons/vk.svg" alt=""> VK ID</button>
            <!-- <button class="button button_stroke button_stroke_default2"><img src="/icons/google.svg" alt=""> Google</button> -->
        </div>

        <p class="register">Уже зарегистрированы? <NuxtLink to="/login">Войдите</NuxtLink></p>
    </div>

    <div class="mainContent" v-else>
        <div>
            <p class="mainTitle">Регистрация</p>
        </div>

        <p>Мы отправили вам на почту письмо с подтверждением.</p>


    </div>
</template>

<style scoped lang="scss">
    .mainContent {
        margin: auto;
        width: 460px;
    }

    .mainTitle {
        color: #A887F8;
        font-size: 48px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 10px;
    }

    .mainDescription {
        font-size: 22px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 40px;
    }

    .loginForm .inputText {
        margin-bottom: 20px;
    }

    .icon {
        &_user {
            background-image: url('icons/auth/user.svg');
        }

        &_lock {
            background-image: url('icons/auth/lock.svg');
        }

        &_mail {
            background-image: url('icons/auth/mail.svg');
        }
    }

    .hidePass {
        display: flex;
        justify-content: space-between;
    }

    .checkBoxContainer {
        margin-bottom: 30px;
    }

    .lineContainer {
        margin: 35px 0 25px;
        width: 100%;
        display: flex;
        align-items: center;
    }

    .line {
        background-color: #BCBCBC;
        display: block;
        height: 1px;
        width: 100%;
    }

    .lineText {
        white-space: nowrap;
        padding: 0 20px;
    }

    .button {
        margin-bottom: 25px;
    }

    .register {
        text-align: center;
    }
</style>