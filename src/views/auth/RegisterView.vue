
<script setup>
    import { RouterLink } from 'vue-router'


    import { ref } from 'vue'
    import { useUserStore } from "@/stores/user"
    import regex from "@/utils/regex.js"

    const auth = useUserStore()

    const email = ref(null)
    const username = ref(null)
    const password = ref(null)

    async function sendData() {
        await auth.registerUser(username.value, email.value, password.value)
    }
</script>

<template>
    <div class="loginContainer">
        <div class="leftSide">
            <img class="logo" src="/logo-black.svg" alt="">
        </div>
        <div class="mainContent">
            <div>
                <p class="mainTitle">Регистрация</p>
                <p class="mainDescription">Рады знакомству!</p>
            </div>
            <form class="loginForm" @submit.prevent="sendData(); this.$router.push('/')">
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
                        <div>Я принимаю <RouterLink to="">пользовательское соглашение</RouterLink><br>и <a href="">политику конфиденциальности</a></div>
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
                <button class="button button_stroke button_stroke_default2"><img src="icons/auth/vk.svg" alt="">VK ID</button>
                <button class="button button_stroke button_stroke_default2"><img src="icons/auth/google.svg" alt="">Google</button>
            </div>

            <p class="register">Уже зарегистрированы? <a @click.prevent="this.$router.push('/login')">Войдите</a></p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .loginContainer {
        display: flex;
    }

    .leftSide {
        width: 50%;
        height: 100vh;
        display: flex;
        justify-content: center;
        background-color: #A887F8;
    }

    .logo {
        width: 600px;
        height: auto;
    }

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
