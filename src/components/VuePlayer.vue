<template>
    <div class="player">
      <div class="player-bar">
        <div class="player-bar-progress"/>
      </div>
      <div class="player-container">
        <div class="player-track-info">
          <a href="/playlist">
            <img
              class="player-track-info-img"
              src="../../assets/images/Картинка.png"
              alt="$"
            >
          </a>
          <div class="player-track-info-container">
            <div class="player-track-info-title">
              <a
                class="player-track-info-link"
                href="/playlist"
              >Без названия</a>
            </div>
            <div class="player-track-info-autor">
              <a
                class="player-track-info-link"
                href="/playlist"
              >Неизвестен</a>
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
        <div>
          <v-audio/>
        </div>
        <div>
          <div class="player-track-info-volume">
            <v-icon
              name="volume"
              size="large"
            />
            <div class="player-track-info-volume-bar">
              <input
                id="bar"
                type="range"
                min="0"
                max="50"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
    import { ref,computed } from 'vue';
    import VAudio from './VAudio.vue';
    import VIcon from '../UI/Icon/VIcon.vue';
  
    export default {
      components: {
        VAudio,
        VIcon
      },
      setup() {
        const favoriteStatus = ref(false);
        const favoriteIcon = computed (()=> {
          return {
            name: favoriteStatus.value ? "likeActive" : "like"
          };
        });
  
        function togleLike () {
          favoriteStatus.value ? favoriteStatus.value = false : favoriteStatus.value = true;
        }
  
        return {
          togleLike,
          favoriteStatus,
          favoriteIcon
        };
      }
    };
  </script>
  <style lang="scss">
    .player{
      font-family: 'Inter', sans-serif;
      height: 105px;
      background-color: var(--color-background);
  
      &-bar {
        width: 100%;
        height: 6px;
        background-color: var(--color-surface);
  
        &-progress {
          background-color: var(--color-onsurface);
          height: 100%;
          width: 10%;
          border-radius: var(--radius-4);
        }
      }
      
  
      &-container {
        height: calc(100% - 6px);
  
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
  
      &-track-info {
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
  
        &-volume {
          display: flex;
          align-items: center;
          gap: var(--gutter-12);
          margin-right: var(--gutter-32);
          &-bar {
            
          }
        }
      }
      #bar{ 
        &::-webkit-slider-runnable-track {
          height: 4px;
        }
        &::-webkit-slider-thumb {
          visibility: hidden;
        }
      }
    }
  </style>