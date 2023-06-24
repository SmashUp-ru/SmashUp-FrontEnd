<script setup>
    import { ref } from 'vue'
    import { useUserStore } from "@/stores/user"
    import { useToast } from "vue-toastification";
    import regex from "@/utils/regex.js"

    const auth = useUserStore()

    const email = ref(null)
    const password = ref(null)
    const keepAuth = ref(null)
    const toast = useToast()

    async function sendData() {
        console.log(email.value, password.value, keepAuth.value)
        const iaAuthorised = await auth.loginUser(email.value, password.value, keepAuth.value)

        if (!iaAuthorised)
        return toast.error("Данные не найдены или неверны", {
            position: "bottom-center",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
            draggable: false,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: false,
            icon: false,
            rtl: false
        })

        // await router.push('/')
    }
</script>

<template>
    <div class="loginContainer">
        <div class="leftSide">
            <img class="logo" src="/logo-black.svg" alt="">
        </div>
        <div class="mainContent">
            <div>
                <p class="mainTitle">Вход</p>
                <p class="mainDescription">Добро пожаловать снова!</p>
            </div>
            <form class="loginForm" @submit.prevent="sendData()">
                <div class="inputText">
                    <div class="label">Псевдоним</div>
                    <input 
                        name="email"
                        type="text"
                        class="icon icon_mail"  
                        placeholder="Аркадий Гачибасов"  
                        @change="(event) => {event.target.classList.add('inputInvalid')}"
                        v-model="email"
                        :pattern="`${regex.USERNAME}`" required>
                </div>
                <div class="inputText">
                    <div class="label hidePass">Пароль
                        <a @click.prevent="this.$router.push('/recover')">Забыл пароль?</a>
                    </div>
                    <input 
                        name="password"
                        type="password"
                        class="icon icon_lock"  
                        placeholder="1kLaSsRULIT6969"  
                        @change="(event) => event.target.classList.add('inputInvalid')" 
                        v-model="password"
                        minlength="8" maxlength="32"
                        :on-invalid="() => {}"
                        :pattern="`${regex.PASSWORD}`" required>
                </div>
                <div class="checkBoxContainer">
                    <input class="checkBox" type="checkbox" id="loginCheckbox" name="remember" v-model="keepAuth">
                    <label for="loginCheckbox">Запомнить меня</label>
                </div>
                <button class="button button_fill button_fill_default1">Войти</button>
            </form>

            <div class="lineContainer">
                <span class="line"></span>
                <p class="lineText">Войти с помощью</p>
                <span class="line"></span>
            </div>

            <div>
                <button class="button button_stroke button_stroke_default2"><img src="icons/auth/vk.svg" alt="">VK ID</button>
                <button class="button button_stroke button_stroke_default2"><img src="icons/auth/google.svg" alt="">Google</button>
            </div>

            <p class="register">Нет аккаунта? <a  @click.prevent="this.$router.push('/register')">Зарегистрируйтесь</a></p>
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

    .hidePass {
        display: flex;
        justify-content: space-between;
    }

    .icon {
        &_lock {
            background-image: url('icons/auth/lock.svg');
        }

        &_mail {
            background-image: url('icons/auth/mail.svg');
        }
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
