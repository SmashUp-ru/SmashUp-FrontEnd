<template>
  <router-link
    class="link"
    :to="href"
  >
    <slot/>
  </router-link>
</template>
<script setup>
  defineProps({
    href: {
      type: String,
      default:''
    }
  });
</script>
<style lang="scss" scoped>
.link {
    color: var(--color-onsurface);
    text-decoration: none;
  }
</style>