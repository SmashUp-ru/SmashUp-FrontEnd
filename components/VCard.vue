<template>
  <div class="card">
    <v-link 
      class="card-logo-link"
      :to="link"
    >
      <div class="card-logo"/>
    </v-link>
    <v-link
      class="card-title-link"
      :to="link"
    >
      <div class="card-title">
        Мэшап-Радио
      </div>
    </v-link>
    <div class="card-autor">
      SmashUp
    </div>
  </div>
</template>
<script setup>
  import { defineProps, computed } from 'vue';
  import VLink from './UI/VLink.vue';
  const props = defineProps( {
    href: {
      type: String,
      default: ''
    }
  });

  const link = computed(()=> `/${props.href}`);
</script>
<style lang="scss" scoped>
.card {
  width: 240px;
  height: 300px;
  display: flex;
  flex-direction: column;

  font-size: 16px;
  line-height: 19px;
  color: var(--color-onsurface);

  &-autor {
    font-weight: 400;
    margin: 8px 25px 25px;
  }
    

  &-logo {
    background: url('../Картинка.png') no-repeat;
    height: 188px;

    &-link {
      text-decoration: none;
      margin: 25px 25px 15px;
    }
  }

  &-title {
    font-weight: 600;

    &-link {
      color: var(--color-onsurface);
      text-decoration: none;
      margin: 0 25px;
    }
  }
}
</style>