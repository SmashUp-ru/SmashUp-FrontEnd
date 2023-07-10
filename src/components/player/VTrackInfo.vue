<template>
  <div class="player-track-info">
    <a href="/playlist">
      <img
        class="player-track-info-img"
        :src="info.img"
        alt="$"
      >
    </a>
    <div class="player-track-info-container">
      <div class="player-track-info-title">
        <a
          class="player-track-info-link"
          href="/playlist"
        >{{ info.title }}</a>
      </div>
      <div class="player-track-info-autor">
        <a
          class="player-track-info-link"
          href="/playlist"
        >{{ info.autor }}</a>
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
  import {ref, computed, defineProps} from 'vue';
  import VIcon from '../UI/Icon/VIcon.vue';

  defineProps({
    info: {
      type: Object,
      default: ()=> ({})
    }
  });

  const favoriteStatus = ref(false);

  const favoriteIcon = computed (()=> {
    return {
      name: favoriteStatus.value ? "likeActive" : "like"
    };
  });
</script>
<style lang="scss" scoped>
.player-track-info {
  margin-left: var(--gutter-40);
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

  &-link {
    color: var(--color-onsurface);
    text-decoration: none;
  }

  &-title {
    font-weight: 600;
  }
}
</style>