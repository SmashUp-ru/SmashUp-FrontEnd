<template>
  <div class="main-container">
    <v-card href="playlist"/>
  </div>
</template>

<script>
  import VCard from "../components/VCard.vue";
  export default {
    components: {
      VCard
    }
  };
</script>

<style scoped lang="scss">
.main {
  &-container {
    width: 100%;
    height: calc(100vh - 105px);
    background-color: black;

    font-family: 'Inter', sans-serif;
  }
}
</style>
