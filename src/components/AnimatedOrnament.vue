<template>
  <div class="animated-ornament" ref="wrapperRef" v-html="svgContent"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps<{
  svgContent: string
  animation: 'scale' | 'up' | 'rotate' | 'left' | 'right'
  delay?: number
}>()

const wrapperRef = ref<HTMLElement | null>(null)

type OrnamentAnimation = 'scale' | 'up' | 'rotate' | 'left' | 'right'

const initialTransforms: Record<OrnamentAnimation, string> = {
  scale: 'scale(0.6)',
  up: 'translateY(28px) scale(0.9)',
  rotate: 'rotate(-16deg) scale(0.85)',
  left: 'translateX(-28px)',
  right: 'translateX(28px)',
}

onMounted(async () => {
  await nextTick()
  const svgEl = wrapperRef.value?.querySelector('svg')
  if (!svgEl) return

  svgEl.style.opacity = '0'
  svgEl.style.transform = initialTransforms[props.animation]

  setTimeout(() => {
    svgEl.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)'
    svgEl.style.opacity = '1'
    svgEl.style.transform = 'none'
  }, props.delay ?? 0)
})
</script>

<style scoped>
.animated-ornament {
  display: inline-block;
  width: 100%;
  height: 100%;
  line-height: 0;
}

.animated-ornament :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>