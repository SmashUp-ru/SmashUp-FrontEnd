<script setup>
import Logo from '@assets/icons/logo.vue'

import Home from '@assets/icons/home/home.vue'
import Like from '@assets/icons/home/like.vue'
import Add from '@assets/icons/home/add.vue'

// const playlists = []
const playlists = [{ name: "Периорекс", id: "29" }, { name: "Новый плейлист", id: "63" }]
</script>

<template>
  <nav class="about">
    <Logo style="height: 42; fill: #A887F8;"/>
    <div class="blocks">
      <div class="links">
        <NuxtLink class="link" to="/">
          <Home/>
          <p>Главная</p>
        </NuxtLink>
        <NuxtLink class="link" to="/likes">
          <Like/>
          <p>Мне нравится</p>
        </NuxtLink>
        <button class="link">
          <Add/>
          <p>Создать плейлист</p>
        </button>
      </div>
      <div class="playlists">
        <template v-for="playlist of playlists" :key="playlist">
          <NuxtLink :to="`/playlist/${ playlist.id }`">{{ playlist.name }}</NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
  .about {
    background: #0A0A0A;
    display: flex;
    min-width: 282px;
    height: calc(100vh - 105px);
    padding: 70px 40px 40px;
    flex-direction: column;
    align-items: center;
    gap: 93px;
  }

  .blocks {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 48px;
  }

  .links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .link {
    gap: 16px;
    display: flex;
    align-items: center;
    
    font-size: 16px;
    font-family: Inter;
    font-weight: 500;

    background: none;
    border: none;

    & svg, & p {
      transition: all .2s linear;
      fill: #BCBCBC;
      color: #BCBCBC;
    }

    &:hover svg {
      fill: #A887F8;
    }

    &:hover p {
      color: #EBEBEB;
    }
  }

  .playlists {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    & a {
      transition: all .2s linear;
      color: #BCBCBC;
    }

    & a:hover {
      color: #EBEBEB;
    }
  }
</style>