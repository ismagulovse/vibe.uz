<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const imageModules = import.meta.glob('../assets/images/*.{jpg,JPG,jpeg,png}', {
  eager: true,
  import: 'default',
})
const photoSources = Object.values(imageModules) as string[]

// Скорость движения — px/sec, одна на всё
const PX_PER_SECOND = 30

interface PhotoMeta {
  src: string
  ratio: number // width / height
}

const photosWithRatio = ref<PhotoMeta[]>([])
const isReady = ref(false)

// Подгружаем реальные пропорции каждого фото
async function loadDimensions() {
  const results = await Promise.all(
    photoSources.map(
      (src) =>
        new Promise<PhotoMeta>((resolve) => {
          const img = new Image()
          img.onload = () => resolve({ src, ratio: img.naturalWidth / img.naturalHeight })
          img.onerror = () => resolve({ src, ratio: 1 }) // fallback — квадрат, если фото не загрузилось
          img.src = src
        })
    )
  )
  photosWithRatio.value = results
  isReady.value = true
}

// Адаптивное число колонок
function getColumnCount(width: number) {
  if (width <= 600) return 2
  if (width <= 900) return 3
  if (width <= 1200) return 4
  return 5
}

const columnCount = ref(typeof window !== 'undefined' ? getColumnCount(window.innerWidth) : 4)
function handleResize() {
  columnCount.value = getColumnCount(window.innerWidth)
}

const TILE_WIDTH = 280 // базовая ширина колонки в px — для расчёта высоты плитки
const ROW_GAP = 16

interface Column {
  photos: PhotoMeta[]
  totalHeight: number
  duration: number
}

// Раскладка masonry: каждое новое фото — в самую короткую колонку
const columns = computed<Column[]>(() => {
  const count = columnCount.value
  const heights = Array(count).fill(0)
  const groups: PhotoMeta[][] = Array.from({ length: count }, () => [])

  photosWithRatio.value.forEach((photo) => {
    // индекс самой короткой на данный момент колонки
    let shortestIndex = 0
    for (let i = 1; i < count; i++) {
      if (heights[i] < heights[shortestIndex]) shortestIndex = i
    }
    const tileHeight = TILE_WIDTH / photo.ratio
    groups[shortestIndex]?.push(photo)
    heights[shortestIndex] += tileHeight + ROW_GAP
  })

  return groups.map((groupPhotos, i) => ({
    photos: groupPhotos,
    totalHeight: heights[i],
    duration: heights[i] / PX_PER_SECOND,
  }))
})

onMounted(() => {
  loadDimensions()
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section id = "section-2" class="gallery-section">
    <h2 class="gallery-section__title">Как это было</h2>

    <div class="gallery-section__frame" v-if="isReady">
      <div class="gallery-section__mask">
        <div class="gallery-section__columns">
          <div v-for="(column, ci) in columns" :key="ci" class="gallery-col">
            <div
              class="gallery-col__track"
              :style="{ animationDuration: column.duration + 's' }"
            >
              <div
                v-for="(photo, pi) in [...column.photos, ...column.photos]"
                :key="pi"
                class="gallery-tile"
                :style="{ aspectRatio: photo.ratio }"
              >
                <img :src="photo.src" alt="" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- боковой блюр -->
      <div class="gallery-section__edge gallery-section__edge--left"></div>
      <div class="gallery-section__edge gallery-section__edge--right"></div>
    </div>
  </section>
</template>

<style scoped>
.gallery-section {
  width: 100%;
  padding: 60px 40px;
}

.gallery-section__title {
  font-size: clamp(25px, 3.3vw, 40px);
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 32px;
  color: var(--color-text, #1a1a1a);
}

.gallery-section__frame {
  position: relative;
  width: 100%;
  height: 640px; /* высота "окна" галереи */
  border-radius: 24px;
  overflow: hidden;
}

/* верх/низ — плавное появление/исчезание плиток */
.gallery-section__mask {
  height: 100%;
  mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
}

.gallery-section__columns {
  display: flex;
  justify-content: center;
  gap: 16px;
  height: 100%;
}

.gallery-col {
  width: 280px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.gallery-col__track {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: scroll-vertical linear infinite;
  will-change: transform;
}

.gallery-tile {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
}

.gallery-tile img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

@keyframes scroll-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-50% - 8px)); }
}

/* лёгкий боковой блюр — накладка поверх краёв */
/* .gallery-section__edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 60px;
  pointer-events: none;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  mask-image: linear-gradient(to right, black, transparent);
  -webkit-mask-image: linear-gradient(to right, black, transparent);
} */
.gallery-section__edge--left {
  left: 0;
}
.gallery-section__edge--right {
  right: 0;
  transform: scaleX(-1); /* разворачиваем градиент маски на правую сторону */
}

@media (max-width: 900px) {
  .gallery-section__frame { height: 520px; }
  .gallery-col { width: 200px; }
}

@media (max-width: 600px) {
  .gallery-section { padding: 40px 16px; }
  .gallery-section__frame { height: 420px; }
  .gallery-col { width: 140px; }
}
</style>