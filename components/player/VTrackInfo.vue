<template>
  <div
    class="player-track-info"
    :class="{ hide : !title?.length }"
  >
    <v-link :href="info?.link">
      <img
        class="player-track-info-img"
        :src="info?.img"
        alt="$"
      >
    </v-link>
    <div class="player-track-info-container">
      <div class="player-track-info-title">
        <v-link
          :href="info?.link"
        >
          {{ title }}
        </v-link>
      </div>
      <div class="player-track-info-autor">
        <v-link
          :href="info?.autorLink"
        >
          {{ info?.autor }}
        </v-link>
      </div>
    </div>
    <v-icon
      ref="favorite"
      v-model="favoriteStatus"
      class="player-track-info-favorite"
      :name="favoriteIcon.name"
      size="large"
      @click="togleLike"
    />
  </div>
</template>
<script setup>
  import VIcon from '../UI/Icon/VIcon.vue';
  import VLink from '../UI/VLink.vue';

  defineProps({
    title: {
      type: String,
      default: '',
    },
    autor: {
      type: Array,
      default: () => [],
    },
    info: {
      type: Object
    }
  });

  const favoriteStatus = ref(false);

  const favoriteIcon = computed (()=> {
    return {
      name: favoriteStatus.value ? "likeActive" : "like"
    };
  });

  const togleLike = () => favoriteStatus.value = !favoriteStatus.value;
</script>
<style lang="scss" scoped>
.player-track-info {
  display: flex;
  gap: 24px;

  &-container {
    display: flex;
    gap: 5px;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    line-height: 17px;
  }

  &.hide {
    visibility: hidden;
  }

  &-favorite{ 
    margin-top: auto;
    margin-bottom: auto;
    &:hover {
      cursor: pointer;
    }
  }
  
  &-img {
    width: 64px;
    height: 64px;
    object-fit: cover;
  }

  &-title {
    font-weight: 600;
  }
}
</style>