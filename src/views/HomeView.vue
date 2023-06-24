<script setup>
// import TheWelcome from '../components/default/TheWelcome.vue'
import Home from '/src/assets/icons/home/home.vue'
import Like from '/src/assets/icons/home/like.vue'
import Add from '/src/assets/icons/home/add.vue'

</script>

<template>
  <nav class="about">
    <img src="logo.svg" height="42" alt="">
    <div class="links">
      <a class="link" href="">
        <Home/>
        <p>Главная</p>
      </a>
      <a class="link" href="">
        <Like/>
        <p>Мне нравится</p>
      </a>
      <a class="link" href="">
        <Add/>
        <p>Создать плейлист</p>
      </a>
    </div>
    <div>
      
    </div>
  </nav>
  <main>
    <!-- <TheWelcome /> -->
  </main>
</template>

<style scoped lang="scss">
  .about {
    background: #0A0A0A;
    display: flex;
    width: 282px;
    height: 990px;
    padding: 70px 40px 579px 40px;
    flex-direction: column;
    align-items: center;
    gap: 93px;
  }

  .links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .link {
    display: flex;
    align-items: center;
    gap: 16px;

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
</style>