<template>
  <svg
    class="v-icon"
    :viewBox="`${view}`"
    :class="{
      [`v-icon--size-${size}`]: size,
      [`v-icon--theme-${theme}`]: theme,
    }"
  >
    <component :is="currentIcon"/>
  </svg>
</template>

<script>
  import { defineComponent, computed } from 'vue';
  import * as icons from './icons';

  export default defineComponent({
    name: 'VIcon',
    components: {
      ...icons,
    },
    props: {
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
    },
    setup(props) {
      const currentIcon = computed(() => {
        const nameUppercase = props.name.charAt(0).toUpperCase() + props.name.slice(1);

        return `VIcon${nameUppercase}`;
      });

      return {
        currentIcon,
      };
    },
  });
</script>

<style lang="scss">
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
