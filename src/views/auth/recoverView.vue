<script setup>
// import Logo from '@pub/logo.svg'
</script>

<template>
    <div class="loginContainer">
        <div class="leftSide">
            <img class="logo" src="/logo-black.svg" alt="">
        </div>
        <div class="mainContent">
            <div>
                <p class="mainTitle">Востановление пароля</p>
                <p class="mainDescription">Опять забыл?</p>
            </div>
            <form class="loginForm">
                <div class="inputText">
                    <div class="label">Электронная почта</div>
                    <input type="email" placeholder="tapiri@smashup.ru" name="email">
                </div>
                <button class="button button_fill button_fill_default1" type="submit">Востановить</button>
            </form>

            <p class="register">Вспомнили? <a @click.prevent="this.$router.push('/login')">Войдите</a></p>
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

    .loginForm {
        margin: auto;
        width: 460px;
        
        & .inputText {
            margin-bottom: 20px;
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
