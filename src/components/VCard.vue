<template>
  <div class="card">
    <router-link 
      class="card-logo-link"
      :to="link"
    >
      <div class="card-logo"/>
    </router-link>
    <router-link
      class="card-title-link"
      :to="link"
    >
      <div class="card-title">
        Мэшап-Радио
      </div>
    </router-link>
    <div class="card-autor">
      SmashUp
    </div>
  </div>
</template>
<script>
  import { PROP_TYPE_STRING } from "../utils/constants/props";
  export default {
    props: {
      href: {
        type: PROP_TYPE_STRING,
        default: ''
      }
    },
    computed: {
      link () {
        return `/${this.href}`;
      }
    }
  };
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
    background: url('../assets/images/Картинка.png') no-repeat;
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