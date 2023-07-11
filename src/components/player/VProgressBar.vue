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
  import { ref, computed, watch } from 'vue';

  const progress = ref(0);
  const duration = ref(0);

  const fillWidth = computed(() => `${(progress.value / duration.value) * 100}%`);

  watch([progress, duration], () => {
  });
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