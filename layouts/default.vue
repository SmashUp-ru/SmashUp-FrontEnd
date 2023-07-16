<script setup>
    import { useUserStore } from "@assets/utils/user"

    const user = useUserStore()
</script>

<template>
    <div class="container">
        <Nav />
        <div>
            <div class="mainHeader">
                <Search />
                <div class="mainHeaderInfo">
                    <img src="" alt="">

                    <div class="mainHeaderUser">
                        <img :src="user.imageUrl" alt="">
                        <p>{{ user.username }}</p>
                    </div>
                </div>
            </div>
            <slot />
        </div>
    </div>
    <Player />
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    width: 100%;
    height: calc(100vh - 105px);
    & > div {
        padding: 0 30px;
        height: calc(100vh - 105px);
        overflow: auto;
    }
}
.mainHeader {
    display: flex;
    height: 130px;
    padding: 50px 0;
    justify-content: space-between;
    align-items: center;
    &Info {
        display: flex;  
    }

    &User {
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;

    & img {
        width: 32px;
        height: 32px;
        border-radius: 4px;
    }
    }
}

</style>