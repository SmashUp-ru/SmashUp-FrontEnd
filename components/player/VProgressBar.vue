<template>
  <div class="progress-bar">
    <div class="progress-bar-track">
      <div
        class="progress-bar-fill"
        :style="{ width: fillWidth }"
      />
    </div>
  </div>
</template>
<script setup>
  import { computed, watch, defineProps } from 'vue';

  import { useAudioStore } from '@assets/utils/audio';

  const audioStore = useAudioStore();

  // Доступ к текущему значению времени воспроизведения
  const currentTimeFormatted = computed(() => audioStore.currentTimeFormatted);

  const props = defineProps({
    duration: {
      type: Number,
      default: null
    }
  })

  const fillWidth = computed(() => `${(currentTimeFormatted.value / props.duration) * 100}%`);

</script>

<style lang="scss" scoped>
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #ccc;
  border-radius: 4px;
  overflow: hidden;
  &-track {
    height: 100%;
    background-color: #aaa;
  }

  &-fill {
    height: 100%;
    background-color: #007bff;
    transition: width 0.3s ease-in-out;
  }
}
</style>