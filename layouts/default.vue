<script setup>
    import { useUserStore } from "@assets/utils/user"

    const user = useUserStore()
</script>

<template>
    <div style="display: flex;">
        <Nav />
        <div style="width: 100%; margin-left: 30px;">
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

<style lang="scss">
    .mainHeader {
        display: flex;
        height: 130px;
        padding: 50px 0;
        padding-right: 30px;
        justify-content: space-between;
        align-items: center;
    }

    .mainHeaderInfo {
        display: flex;
    }

    .mainHeaderUser {
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
</style>