<template>
  <section id="section-1" class="app-banner">
    <div
    v-for="orn in ornaments"
    :key="orn.key"
    class="app-banner__ornament"
    :class="[
        orn.spin === 'cw' ? 'app-banner__ornament--spin-cw' : 'app-banner__ornament--spin-ccw',
        orn.mobile ? 'app-banner__ornament--mobile-visible' : ''
    ]"
    :style="{ top: orn.top, left: orn.left, '--orn-size': orn.size + 'px', animationDuration: orn.spinDuration + 's' }"
    >
    <AnimatedOrnament :svg-content="orn.src" :animation="orn.anim" :delay="ornamentBaseDelay + orn.delay" />
    </div>

    <div class="app-banner__content">
      <h1 class="app-banner__title">
        <div
          v-for="(group, gIndex) in groups"
          :key="gIndex"
          class="app-banner__line"
          :class="`app-banner__line--${group.variant}`"
        >
          <span
            v-for="(word, wIndex) in group.words"
            :key="wIndex"
            class="app-banner__word"
          >
            <span
              v-for="(letter, lIndex) in word"
              :key="lIndex"
              class="app-banner__letter"
              :style="{ transitionDelay: `${letter.index * 30}ms` }"
              :class="{ 'app-banner__letter--visible': lettersStarted }"
            >{{ letter.char }}</span>
          </span>
        </div>
      </h1>

      <p class="app-banner__description" :class="{ 'app-banner__description--visible': descriptionVisible }">
        Открываем новую точку на карте VIBE путешествие, в котором теннис становится поводом увидеть новую страну и прожить неделю в сильном окружении единомышленников
      </p>

      <button class="app-banner__cta" type="button" @click="modal.open()">Записаться</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import AnimatedOrnament from './AnimatedOrnament.vue'

import ornament1 from '../assets/ornaments/ornament1.svg?raw'
import ornament2 from '../assets/ornaments/ornament2.svg?raw'
import ornament3 from '../assets/ornaments/ornament3.svg?raw'
import ornament4 from '../assets/ornaments/ornament4.svg?raw'
import ornament5 from '../assets/ornaments/ornament5.svg?raw'
import ornament6 from '../assets/ornaments/ornament6.svg?raw'
import ornament7 from '../assets/ornaments/ornament7.svg?raw'
import { useModalStore } from '@/stores/modal'
const modal = useModalStore()

type Anim = 'scale' | 'up' | 'rotate' | 'left' | 'right'
type Spin = 'cw' | 'ccw'

const ornaments: { key: string; src: string; top: string; left: string; size: number; anim: Anim; delay: number; spin: Spin; spinDuration: number, mobile?: boolean}[] = [
  { key: 'o2-a', src: ornament2, top: '-4%', left: '2%', size: 190, anim: 'scale', delay: 0, spin: 'cw', spinDuration: 90, mobile: true },
  { key: 'o2-b', src: ornament2, top: '84%', left: '68%', size: 110, anim: 'up', delay: 420, spin: 'ccw', spinDuration: 110 , mobile: true},
  { key: 'o6-a', src: ornament6, top: '68%', left: '-3%', size: 160, anim: 'left', delay: 90, spin: 'cw', spinDuration: 130},
  { key: 'o6-b', src: ornament6, top: '4%', left: '76%', size: 100, anim: 'rotate', delay: 510, spin: 'ccw', spinDuration: 75, mobile: true },
  { key: 'o7-a', src: ornament7, top: '36%', left: '90%', size: 180, anim: 'right', delay: 180, spin: 'cw', spinDuration: 100 , mobile: true},
  { key: 'o7-b', src: ornament7, top: '90%', left: '38%', size: 95, anim: 'scale', delay: 600, spin: 'ccw', spinDuration: 140 , mobile: true},
  { key: 'o1-a', src: ornament1, top: '12%', left: '18%', size: 70, anim: 'up', delay: 270, spin: 'cw', spinDuration: 85 , mobile: true},
  { key: 'o1-b', src: ornament1, top: '58%', left: '84%', size: 60, anim: 'rotate', delay: 720, spin: 'ccw', spinDuration: 120 , mobile: true},
  { key: 'o3-a', src: ornament3, top: '22%', left: '94%', size: 65, anim: 'left', delay: 240, spin: 'cw', spinDuration: 95 , mobile: true },
  { key: 'o3-b', src: ornament3, top: '76%', left: '22%', size: 78, anim: 'scale', delay: 660, spin: 'ccw', spinDuration: 105, mobile: true},
  { key: 'o4-a', src: ornament4, top: '2%', left: '44%', size: 55, anim: 'right', delay: 330, spin: 'cw', spinDuration: 115  , mobile: true},
  { key: 'o4-b', src: ornament4, top: '86%', left: '6%', size: 82, anim: 'up', delay: 780, spin: 'ccw', spinDuration: 80, mobile: true },
  { key: 'o5-a', src: ornament5, top: '48%', left: '4%', size: 60, anim: 'rotate', delay: 450, spin: 'cw', spinDuration: 125 , mobile: true},
  { key: 'o5-b', src: ornament5, top: '16%', left: '58%', size: 68, anim: 'scale', delay: 840, spin: 'ccw', spinDuration: 70 , mobile: true},
]

// две смысловые части заголовка — основная фраза и строка с местом/датами
const titleGroups = [
  { text: 'Новый VIBE. Новый маршрут. Новый опыт.', variant: 'main' as const },
  { text: 'Ташкент, Узбекистан · 1–8 октября 2026', variant: 'dates' as const },
]

// счётчик индекса объявлен ВНУТРИ computed — пересоздаётся при каждом пересчёте,
// поэтому задержки букв всегда строго последовательны, без "уезжания"
const groups = computed(() => {
  let index = 0
  return titleGroups.map((group) => ({
    variant: group.variant,
    words: group.text.split(' ').map((word) =>
      word.split('').map((char) => ({ char, index: index++ }))
    ),
  }))
})

const totalLetters = computed(() =>
  titleGroups.reduce((sum, g) => sum + g.text.replace(/ /g, '').length, 0)
)

const lettersStarted = ref(false)
const descriptionVisible = ref(false)
const ornamentBaseDelay = ref(0)

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    lettersStarted.value = true
  })

  const lettersDuration = totalLetters.value * 30 + 500
  ornamentBaseDelay.value = lettersDuration

  setTimeout(() => {
    descriptionVisible.value = true
  }, lettersDuration)
})
</script>


<style scoped>
.app-banner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 60px 24px;
  margin-bottom: 120px;
  background-color: var(--color-background);
  overflow: visible;
}

.app-banner__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  max-width: 720px;
}

.app-banner__title {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: clamp(24px, 4.5vw, 44px);
  color: var(--color-text);
  margin: 0;
  line-height: 1.3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.app-banner__line {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.app-banner__word {
  display: inline-block;
  white-space: nowrap;
  margin: 0 0.28em 0.15em 0;
}

/* строка с местом и датами — крупнее серого текста, но без рамок/фонов/капса */
.app-banner__line--dates .app-banner__word {
  font-size: clamp(15px, 2.2vw, 20px);
  font-weight: 600;
  color: var(--color-accent);
}

.app-banner__letter {
  display: inline-block;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.app-banner__letter--visible {
  opacity: 1;
}

.app-banner__description {
  font-family: var(--font-main);
  font-size: 16px;
  color: var(--color-text-muted);
  margin: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.app-banner__description--visible {
  opacity: 1;
}

.app-banner__cta {
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 16px;
  color: var(--color-white);
  background-color: var(--color-accent);
  border: none;
  border-radius: 8px;
  padding: 14px 36px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.app-banner__cta:hover {
  background-color: var(--color-sky);
  transform: translateY(-2px);
}

.app-banner__ornament {
  position: absolute;
  z-index: 1;
  width: var(--orn-size);
  height: var(--orn-size);
}

@keyframes ornament-spin-cw {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ornament-spin-ccw {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

.app-banner__ornament--spin-cw {
  animation-name: ornament-spin-cw;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.app-banner__ornament--spin-ccw {
  animation-name: ornament-spin-ccw;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@media (max-width: 768px) {
  .app-banner {
    margin-bottom: 60px;
  }

  .app-banner__ornament {
    display: none;
  }

  .app-banner__ornament--mobile-visible {
    display: block;
    width: calc(var(--orn-size) * 0.5);
    height: calc(var(--orn-size) * 0.5);
  }
}
</style>