<script setup>
    import Logo from "@assets/icons/logo.vue"
</script>

<template>
    <main>
        <Logo/>
        <section class="container">
            <div>
                <p class="title">404</p>
                <p class="description">Что-то пошло не так</p>
            </div>
            <button @click="$router.push('/')" class="button button_fill button_fill_default1">Вернуться на главную</button>
        </section>
    </main>
</template>

<style scoped lang="scss">
    main {
        position: relative;
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        // background-image: url("logo.svg");
        // background-repeat: no-repeat;
        // background-position: center;
        // background-size: cover;

        & svg {
            z-index: -1;
            position: absolute;
            height: 100vh;
            width: auto;
            fill: none;
            stroke: #121212;
            stroke-width: .2px;
        }
    }

    .container {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }

    .title {
        text-align: center;
        color: #A887F8;
        font-size: 128px;
        font-weight: 600;
    }

    .description {
        text-align: center;
        font-size: 24px;
        font-family: 400;
    }
</style>