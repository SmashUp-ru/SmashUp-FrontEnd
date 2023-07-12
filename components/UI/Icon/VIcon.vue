<template>
  <svg
    class="v-icon"
    :viewBox="`${view}`"
    :class="{
      [`v-icon--size-${size}`]: size,
      [`v-icon--theme-${theme}`]: theme,
    }"
  >
    <component :is="iconComponent"/>
  </svg>
</template>

<script setup>
  import { defineProps, computed, defineAsyncComponent } from 'vue';

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    view: {
      type: String,
      default: '0 0 32 32',
    },
    size: {
      type: String,
      default: 'medium',
    },
    theme: {
      type: String,
      default: 'primary',
    },
  });
  const iconComponent = computed(() => {
    const nameUppercase = props.name.charAt(0).toUpperCase() + props.name.slice(1);
    const componentName = `VIcon${nameUppercase}`;

    return defineAsyncComponent(() => import(`./icons/${componentName}.vue`));
  });
</script>

<style lang="scss" scoped>
.v-icon {
  display: inline-flex;
  flex-shrink: 0;

  transition: var(--transition-base);

  &--size {
    &-large {
      width: 32px;
      height: 32px;
    }

    &-medium {
      width: 24px;
      height: 24px;
    }
  }

  &--theme {
    &-primary {
      fill: var(--color-onsurface);
    }
    &-secondary {
      fill: var(--color-onsurface);
    }
  }
}
</style>
