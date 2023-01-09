
<template>
  <router-view/>
  <v-player/>
</template>

<script>
  import VPlayer from "../src/components/player/VPlayer.vue";
  export default {
    components: {
      VPlayer
    }
  };
</script>
