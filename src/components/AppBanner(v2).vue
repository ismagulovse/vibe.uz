<template>
  <section id="section-1" class="hero" :style="heroBgStyle">
    <div class="hero__overlay" />

    <div class="hero__content">
      <!-- мини-заголовок с подчёркиванием в виде линий корта -->
      <div class="hero__eyebrow-row">
        <span  class="hero__eyebrow" :class="{ 'hero__eyebrow--visible': stage >= 1 }">
          Tashkent Tennis Camp
        </span>
        <svg
          class="hero__eyebrow-line"
          :class="{ 'hero__eyebrow-line--visible': stage >= 1 }"
          viewBox="0 0 120 8"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="0" y1="1" x2="120" y2="1" />
          <line x1="0" y1="7" x2="90" y2="7" />
        </svg>
      </div>

      <h1 class="hero__title">
        <span
          v-for="(word, wIndex) in titleWords"
          :key="wIndex"
          class="hero__title-line"
        >
          <span
            v-for="(letter, lIndex) in word"
            :key="lIndex"
            class="hero__letter"
            :class="{ 'hero__letter--visible': stage >= 2 }"
            :style="{ transitionDelay: `${letter.index * 28}ms` }"
          >{{ letter.char }}</span>
        </span>
      </h1>

      <div class="hero__meta" :class="{ 'hero__meta--visible': stage >= 3 }">
        <span class="hero__meta-item">
          <svg class="hero__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Ташкент, Узбекистан
        </span>
        <span class="hero__meta-item">
          <svg class="hero__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="5.5" width="17" height="15" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M3.5 9.5h17" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7.5 3.5v3.5M16.5 3.5v3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          1–8 октября 2026
        </span>
      </div>

      <ul class="hero__tags" :class="{ 'hero__tags--visible': stage >= 4 }">
        <li
          v-for="(tag, i) in tags"
          :key="tag"
          class="hero__tag"
          :style="{ transitionDelay: `${i * 70}ms` }"
        >{{ tag }}</li>
      </ul>

      <div class="hero__actions" :class="{ 'hero__actions--visible': stage >= 5 }">
        <button class="hero__cta" type="button" @click="modal.open()">Хочу поехать</button>
        <p class="hero__note">
          <span class="hero__note-dot" />
          Количество мест ограничено
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useModalStore } from '@/stores/modal'

const modal = useModalStore()

// TODO: подставить финальное изображение, когда дизайнер его отдаст
const bgImage = '/images/tashkent-hero.jpg'
const heroBgStyle = computed(() => ({
  backgroundImage: `linear-gradient(90deg, rgba(10,10,12,0.72) 0%, rgba(10,10,12,0.42) 45%, rgba(10,10,12,0.15) 75%), url(${bgImage})`,
}))

const tags = ['8 дней', 'Грунтовые корты', 'Профессиональные тренеры', 'Любой уровень игры']

const titleText = ['Теннисные', 'Каникулы']
const titleWords = computed(() => {
  let index = 0
  return titleText.map((word) =>
    word.split('').map((char) => ({ char, index: index++ }))
  )
})
const totalLetters = computed(() => titleText.join('').length)

// stage: 0 — ничего, 1 — eyebrow, 2 — заголовок, 3 — мета, 4 — теги, 5 — кнопка
const stage = ref(0)

onMounted(() => {
  requestAnimationFrame(() => { stage.value = 1 })
  const t1 = 250
  const t2 = t1 + totalLetters.value * 28 + 250
  const t3 = t2 + 250
  const t4 = t3 + 250

  setTimeout(() => { stage.value = 2 }, t1)
  setTimeout(() => { stage.value = 3 }, t2)
  setTimeout(() => { stage.value = 4 }, t3)
  setTimeout(() => { stage.value = 5 }, t4)
})
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 88vh;
  padding: 60px 24px;
  margin-bottom: 120px;
  background-color: var(--color-background);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  /* лёгкое затемнение снизу, чтобы кнопка и теги всегда читались
     независимо от того, что окажется в этой части фото */
  background: linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%);
}

.hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  max-width: 560px;
  text-align: left;
}

/* --- eyebrow --- */
.hero__eyebrow-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero__eyebrow {
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-white);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.hero__eyebrow--visible {
  opacity: 0.92;
  transform: translateY(0);
}

/* подчёркивание в виде двух линий корта — своя деталь, а не дефолтный <hr> */
.hero__eyebrow-line {
  width: 120px;
  height: 8px;
  overflow: visible;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s ease 0.15s;
}

.hero__eyebrow-line--visible {
  transform: scaleX(1);
}

.hero__eyebrow-line line {
  stroke: var(--color-accent);
  stroke-width: 1.5;
}

/* --- title --- */
.hero__title {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: clamp(40px, 7vw, 76px);
  line-height: 0.98;
  letter-spacing: -0.01em;
  color: var(--color-white);
  margin: 0;
  display: flex;
  flex-direction: column;
}

.hero__title-line {
  display: block;
  white-space: nowrap;
}

.hero__letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.hero__letter--visible {
  opacity: 1;
  transform: translateY(0);
}

/* --- meta (место + даты) --- */
.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.hero__meta--visible {
  opacity: 1;
  transform: translateY(0);
}

.hero__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-main);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-white);
}

.hero__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--color-accent);
}

/* --- tags --- */
.hero__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 4px 0 0;
  padding: 0;
}

.hero__tag {
  font-family: var(--font-main);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-white);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  padding: 7px 16px;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.06);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.45s ease, transform 0.45s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.hero__tags--visible .hero__tag {
  opacity: 1;
  transform: translateY(0);
}

.hero__tag:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.7);
}

/* --- actions --- */
.hero__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-top: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.hero__actions--visible {
  opacity: 1;
  transform: translateY(0);
}

.hero__cta {
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 16px;
  color: var(--color-white);
  background-color: var(--color-accent);
  border: none;
  border-radius: 8px;
  padding: 15px 38px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.hero__cta:hover {
  background-color: var(--color-sky);
  transform: translateY(-2px);
}

.hero__note {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-family: var(--font-main);
  font-size: 13px;
  color: var(--color-white);
  opacity: 0.8;
}

.hero__note-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-accent);
  animation: note-pulse 1.8s ease-in-out infinite;
}

@keyframes note-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@media (max-width: 768px) {
  .hero {
    min-height: 82vh;
    margin-bottom: 60px;
    padding: 40px 20px;
    align-items: flex-end;
  }

  .hero__overlay {
    background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.7) 100%);
  }

  .hero__content {
    max-width: 100%;
    padding-bottom: 24px;
    gap: 16px;
  }

  .hero__title {
    font-size: clamp(32px, 11vw, 48px);
  }

  .hero__meta {
    gap: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__eyebrow,
  .hero__eyebrow-line,
  .hero__letter,
  .hero__meta,
  .hero__tag,
  .hero__actions,
  .hero__note-dot {
    transition: none;
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>