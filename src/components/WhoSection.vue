<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { computed } from 'vue'

const imageModules = import.meta.glob('../assets/images/*.{jpg,JPG,jpeg,png}', {
  eager: true,
  import: 'default',
})
const photos = Object.values(imageModules) as string[]

// Скорость в пикселях/секунду — одна на все колонки, задаёт ощущение движения
const PX_PER_SECOND = 38 // <-- меняешь только это число, чтобы ускорить/замедлить все колонки

function splitIntoColumns(items: string[], count: number) {
  const result: string[][] = Array.from({ length: count }, () => [])
  items.forEach((item, index) => {
    result[index % count].push(item)
  })
  return result
}

const columns = computed(() => {
  const groups = splitIntoColumns(photos, 3)
  return groups.map((groupPhotos) => {
    // Условная высота одной плитки в пикселях (примерно, под базовую ширину 350px)
    const approxTileHeight = 482
    const totalHeight = groupPhotos.length * approxTileHeight
    const duration = totalHeight / PX_PER_SECOND
    return { photos: groupPhotos, duration }
  })
})

const points = [
  'Для игроков любого уровня — от начинающих до уверенных любителей',
  'Для тех, кто хочет улучшить технику и получить много игровой практики',
  'Для тех, кому важны люди, атмосфера и совместные путешествия',
  'Семьи, которые любят активный отдых и хотят провести неделю вместе в новой стране',
  'Для участников прошлых кэмпов VIBE и тех, кто едет впервые',
  'Для друзей и знакомых',
]

// --- Скролл-анимация появления пунктов списка ---
const sectionRef = ref<HTMLElement | null>(null)
const listVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          listVisible.value = true
          observer?.disconnect()
        }
      })
    },
    { threshold: 0.25 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <section id="section-2" class="who" ref="sectionRef">

    <svg width="0" height="0" style="position:absolute">
      <defs>
        <clipPath id="tile-clip" clipPathUnits="objectBoundingBox">
          <path
            d="M0.5,0
            C0.514,0.061 0.586,0.189 0.754,0.208
            V0.304
            C1.032,0.304 1.120,0.675 0.754,0.717
            V0.791
            C0.680,0.796 0.526,0.846 0.5,1
            C0.473,0.846 0.318,0.796 0.244,0.791
            V0.717
            C-0.122,0.675 -0.034,0.304 0.244,0.304
            V0.208
            C0.412,0.189 0.484,0.061 0.5,0
            Z"
          />
        </clipPath>
      </defs>
    </svg>

    <div class="who__text">
      <h2 class="who__title">Для кого этот кэмп?</h2>

      <ul class="who__list">
        <li
          v-for="(point, index) in points"
          :key="index"
          class="who__list-item"
          :class="{ 'who__list-item--visible': listVisible }"
          :style="{ transitionDelay: `${index * 90}ms` }"
        >
          {{ point }}
        </li>
      </ul>
    </div>

    <!-- Десктоп: 3 вертикальные колонки -->
    <div class="who__gallery who__gallery--desktop">
      <div
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        class="who__column"
        :class="{ 'who__column--offset': columnIndex % 2 === 1 }"
      >
        <div class="who__track" :style="{ animationDuration: column.duration + 's' }">
          <div v-for="(photo, index) in [...column.photos, ...column.photos]" :key="index" class="who__tile">
            <img :src="photo" alt="" loading="lazy" />
          </div>
        </div>
      </div>
    </div>

    <!-- Мобильные/планшет: одна горизонтальная полоса -->
    <div class="who__gallery who__gallery--strip">
      <div class="who__strip-track">
        <div v-for="(photo, index) in [...photos, ...photos]" :key="index" class="who__tile who__tile--strip">
          <img :src="photo" alt="" loading="lazy" />
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.who {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 64px;
  padding: 80px 40px;
  overflow: hidden;
}

.who__text {
  flex: 1;
  max-width: 520px;
}

.who__title {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: var(--color-text);
}

.who__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.who__list-item {
  position: relative;
  padding-left: 28px;
  color: var(--color-text-muted);
  line-height: 1.6;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.who__list-item--visible {
  opacity: 1;
  transform: translateY(0);
}

.who__list-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 11px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--color-accent);
}

/* ===================================== */
/*         ГАЛЕРЕЯ — ДЕСКТОП              */
/* ===================================== */

.who__gallery {
  --tile-width: 350px;
  --tile-height: calc(var(--tile-width) * 482 / 392);
  --column-gap: 0px;
  --row-gap: 18px;
  --offset: 225px;
  --column-overlap: 125px;

  flex: 1;
  display: flex;
  justify-content: center;
  gap: var(--column-gap);
  overflow: hidden;

  mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
}

.who__gallery--desktop {
  height: 760px;
}

.who__gallery--strip {
  display: none;
}

.who__column + .who__column {
  margin-left: calc(-1 * var(--column-overlap));
}
.who__column {
  width: var(--tile-width);
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}

.who__column--offset {
  padding-top: var(--offset);
}

.who__track {
  display: flex;
  flex-direction: column;
  gap: var(--row-gap);
  animation: scroll-vertical linear infinite;
  will-change: transform;
}

.who__tile {
  width: 100%;
  height: var(--tile-height);
  flex-shrink: 0;
  overflow: hidden;
  clip-path: url(#tile-clip);
}

.who__tile img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

@keyframes scroll-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-50% - (var(--row-gap) / 2))); }
}

.who__column:nth-child(1) .who__track { animation-duration: 34s; }
.who__column:nth-child(2) .who__track { animation-duration: 34s; }
.who__column:nth-child(3) .who__track { animation-duration: 34s; }

/* ===================================== */
/*    ГАЛЕРЕЯ — ГОРИЗОНТАЛЬНАЯ ПОЛОСА     */
/* ===================================== */

.who__strip-track {
  display: flex;
  flex-direction: row;
  gap: var(--row-gap);
  animation: scroll-horizontal linear infinite;
  animation-duration: 40s;
  will-change: transform;
}

.who__tile--strip {
  width: var(--tile-width);
  height: var(--tile-height);
}

@keyframes scroll-horizontal {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - (var(--row-gap) / 2))); }
}

@media (max-width: 1200px) {
  .who { gap: 40px; }
  .who__gallery--desktop {
    --tile-width: 210px;
    --offset: 120px;
    --column-overlap: 30px;
    height: 650px;
  }
}

@media (max-width: 1200px) {
  .who { gap: 40px; }
  .who__gallery--desktop { --tile-width: 210px; --offset: 120px; height: 650px; }
}

/* От этой ширины и уже — переключаемся на горизонтальную полосу для планшета и мобильных */
@media (max-width: 900px) {
  .who {
    flex-direction: column;
    align-items: flex-start;
  }

  .who__gallery--desktop {
    display: none;
  }

  .who__gallery--strip {
    display: flex;
    width: 100%;
  }

  .who__gallery--strip {
    --tile-width: 230px;
    --tile-height: calc(var(--tile-width) * 482 / 392);
    height: var(--tile-height);
  }
}

@media (max-width: 600px) {
  .who { padding: 60px 20px; }

  .who__gallery--strip {
    --tile-width: 150px;
  }
}
</style>