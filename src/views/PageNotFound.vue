<template>
    <main>
        <section class="container">
            <p class="title">404</p>
            <p class="description">Что-то пошло не так</p>
            <button @click="$router.push('/')" class="button button_fill button_fill_default1">Вернуться на главную</button>
        </section>
    </main>
</template>

<style scoped lang="scss">
    main {
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;

        background-image: url("logo-bg.svg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
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
        margin: 30px 0;
    }
</style>