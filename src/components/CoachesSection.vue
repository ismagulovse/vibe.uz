<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import olgaPhoto from '@/assets/coaches/olga.jpg'
import vladPhoto from '@/assets/coaches/vlad.jpg'
import denPhoto from '@/assets/coaches/den.jpg'
import mariyaPhoto from '@/assets/coaches/mariya.jpg'
import olgaPhoto2 from '@/assets/coaches/olga2.jpg'

interface DescPart {
  text: string
  highlight?: boolean
}

interface Coach {
  name: string
  photo: string
  description: DescPart[]
}

const coaches: Coach[] = [
  {
    name: 'Минкина Ольга',
    photo: olgaPhoto,
    description: [
      { text: 'Старший тренер', highlight: true },
      { text: ', тренер-преподаватель, ' },
      { text: 'судья 3 категории', highlight: true },
    ],
  },
  {
    name: 'Столярова Ольга',
    photo: olgaPhoto2,
    description: [
      { text: 'Тренер по ' },
      { text: 'функциональной йоге', highlight: true },
    ],
  },
  {
    name: 'Минкин Влад',
    photo: vladPhoto,
    description: [
      { text: 'Тренер-преподаватель, судья 3 категории. Участник турниров ' },
      { text: 'Tennis Europe и ITF TOUR', highlight: true },
      { text: ', ' },
      { text: 'КМС', highlight: true },
    ],
  },
  {
    name: 'Минаков Денис',
    photo: denPhoto,
    description: [
      { text: '1 взрослый разряд. Победитель и призёр городских и областных соревнований. ' },
      { text: 'Финалист «Золотая ракетка 2020»', highlight: true },
      { text: ', г. Москва' },
    ],
  },
  {
    name: 'Дрожжакина Мария',
    photo: mariyaPhoto,
    description: [
      { text: 'Тренер по сайклингу и групповым форматам, ' },
      { text: '5+ лет практики', highlight: true },
      { text: ' управления фитнес-проектами' },
    ],
  },
]

// сколько карточек видно одновременно — теперь зависит от ширины экрана
function getVisibleCount() {
  if (typeof window === 'undefined') return 4
  const w = window.innerWidth
  if (w >= 1200) return 4
  if (w >= 900) return 3
  if (w >= 600) return 2
  return 1
}

const visibleCount = ref(getVisibleCount())
const cardWidth = 260

const extended = computed(() => [
  ...coaches.slice(-visibleCount.value),
  ...coaches,
  ...coaches.slice(0, visibleCount.value),
])

const totalItems = computed(() => extended.value.length)

const currentIndex = ref(visibleCount.value)
const withTransition = ref(true)
const isAnimating = ref(false)

function next() {
  if (isAnimating.value) return
  isAnimating.value = true
  currentIndex.value++
}

function prev() {
  if (isAnimating.value) return
  isAnimating.value = true
  currentIndex.value--
}

function onTransitionEnd() {
  const total = coaches.length

  if (currentIndex.value >= total + visibleCount.value) {
    jumpTo(currentIndex.value - total)
  } else if (currentIndex.value < visibleCount.value) {
    jumpTo(currentIndex.value + total)
  } else {
    isAnimating.value = false
  }
}

function jumpTo(newIndex: number) {
  withTransition.value = false
  currentIndex.value = newIndex

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      withTransition.value = true
      isAnimating.value = false
    })
  })
}

// при смене ширины экрана (поворот телефона, ресайз) сбрасываем карусель
// на первую реальную карточку — иначе позиция "поедет"
function handleResize() {
  const newCount = getVisibleCount()
  if (newCount !== visibleCount.value) {
    visibleCount.value = newCount
    jumpTo(newCount)
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section id="section-4" class="coaches">
    <h2 class="coaches__title">Команда, которая будет рядом</h2>

    <div class="coaches__carousel">
      <button class="coaches__arrow coaches__arrow--left" @click="prev" aria-label="Предыдущий тренер">
        ‹
      </button>

      <div class="coaches__viewport">
        <div
          class="coaches__track"
          :class="{ 'coaches__track--animated': withTransition }"
          :style="{
            width: `calc(${totalItems} / ${visibleCount} * 100%)`,
            transform: `translateX(-${(currentIndex / totalItems) * 100}%)`,
          }"
          @transitionend="onTransitionEnd"
        >
          <div
            v-for="(coach, i) in extended"
            :key="i"
            class="coaches__card"
          >
            <div class="coaches__surface">
              <img :src="coach.photo" :alt="coach.name" class="coaches__photo" />
              <h3 class="coaches__name">{{ coach.name }}</h3>
              <p class="coaches__desc">
                <span
                  v-for="(part, j) in coach.description"
                  :key="j"
                  :class="{ 'coaches__desc--accent': part.highlight }"
                >{{ part.text }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <button class="coaches__arrow coaches__arrow--right" @click="next" aria-label="Следующий тренер">
        ›
      </button>
    </div>
  </section>
</template>

<style scoped>
.coaches {
  padding: 80px 40px;
  text-align: center;
}

.coaches__title {
  color: var(--color-text);
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 48px;
}

.coaches__carousel {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: calc(v-bind(visibleCount) * v-bind(cardWidth) * 1px + 120px); /* +120px под стрелки и отступы */
  margin: 0 auto;
}

.coaches__viewport {
  flex: 1;
  overflow: hidden;
}

.coaches__track {
  display: flex;
}

.coaches__track--animated {
  transition: transform 0.5s ease;
}

.coaches__card {
  flex: 0 0 calc(100% / v-bind(totalItems));
  padding: 0 20px;
  display: flex;
}

.coaches__surface {
  width: 100%;
  min-height: 360px; /* вытянутая пропорция; подгоните под свой вкус */
  background: var(--color-white);
  border-radius: 24px;
  padding: 32px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 16px rgba(58, 73, 104, 0.08);
}

.coaches__photo {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 3px solid var(--color-sky); /* редкий голубой акцент по палитре */
}

.coaches__name {
  color: var(--color-text);
  font-weight: 600;
  font-size: 1.15rem;
  margin-bottom: 12px;
}

.coaches__desc {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.coaches__desc--accent {
  color: var(--color-accent); /* терракот — выделение ключевых регалий */
  font-weight: 600;
}

.coaches__arrow {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1.6rem;
  cursor: pointer;
  transition: background 0.2s;
}

.coaches__arrow:hover {
  background: var(--color-sky);
  color: var(--color-white);
}

@media (max-width: 480px) {
  .coaches__carousel {
    max-width: 100%;
    gap: 8px;
  }

  .coaches__arrow {
    width: 36px;
    height: 36px;
    font-size: 1.3rem;
  }

  .coaches__surface {
    padding: 24px 16px 20px;
    min-height: 320px;
  }
}
</style>