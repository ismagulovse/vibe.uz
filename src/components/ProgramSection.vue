<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

// TODO: замени на реальные фото (по аналогии с pricingBg в pricing.vue)
import tennisPhoto from '../assets/img1.png'
import cityPhoto from '../assets/img2.png'

// --- Контент левого блока ---
const tennisLabel = 'СПОРТИВНАЯ ПРОГРАММА'
const tennisTitle = 'Vibe'
const tennisBadge = '25 ЧАСОВ ТЕННИСА'

const tennisStats = [
  { value: '5', title: 'КОРТОВ', desc: 'Международного класса' },
  { value: '30', title: 'ЕДИНОМЫШЛЕННИКОВ', desc: 'Влюблённых в теннис' },
  { value: '3', title: 'ЧАСА ВИДЕОРАЗБОРА', desc: 'Теории по технике тенниса' },
  { value: '1', title: 'МЕЖДУНАРОДНЫЙ ТУРНИР', desc: 'Финал среди участников' },
  { value: '5', title: 'ЧАСОВ ЙОГИ', desc: 'Растяжка и восстановление' },
  { value: '4', title: 'ЛЕГЕНДАРНЫХ ТРЕНЕРА', desc: 'Рядом каждый день' },
]

// --- Контент правого блока ---
const cultureLabel = 'РАЗВЛЕКАТЕЛЬНАЯ ПРОГРАММА'
const cultureTitle = 'Такие перемены'
const cultureBadge = 'ИГРА СО СПЕЦИЯМИ'

const cultureItems = [
  { title: 'ГАСТРОМАРШРУТ', desc: 'Вкусы Востока' },
  { title: 'ВИНОДЕЛЬНЯ', desc: 'Экскурсия · дегустация' },
  { title: 'КРАСИВЫЕ МЕСТА', desc: 'Город и окрестности' },
  { title: 'ПЛОВ', desc: 'Мастер-класс по приготовлению' },
  { title: 'ШУМНЫЕ РЫНКИ', desc: 'Краски и колорит' },
  { title: 'АРХИТЕКТУРА', desc: 'Уникальные места и атмосфера старых улочек' },
]

// --- Анимация появления при скролле (как в pricing.vue) ---
const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
        }
      })
    },
    { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <section id="section-3" ref="sectionRef" class="program" :class="{ 'program--visible': isVisible }">
    <div class="program__inner">
      <h2 class="program__title program__reveal">Теннис со вкусом востока</h2>
      <div class="program__grid">
        <!-- Левая карточка: теннис -->
        <div class="program__card program__reveal">
          <div class="program__photo">
            <img :src="tennisPhoto" alt="" class="program__photo-image" />
            <div class="program__photo-placeholder">Фото</div>
            <div class="program__photo-overlay"></div>
            <span class="program__photo-badge">{{ tennisBadge }}</span>
          </div>

          <div class="program__body">
            <span class="program__label">{{ tennisLabel }}</span>
            <h3 class="program__subtitle">{{ tennisTitle }}</h3>

            <ul class="program__stats">
              <li
                v-for="(item, index) in tennisStats"
                :key="item.title"
                class="program__stat program__reveal"
                :style="{ transitionDelay: (index * 0.06) + 's' }"
              >
                <span class="program__stat-value">{{ item.value }}</span>
                <span class="program__stat-text">
                  <span class="program__stat-title">{{ item.title }}</span>
                  <span class="program__stat-desc">{{ item.desc }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Разделитель "+" -->
        <div class="program__connector program__reveal">
          <!-- <spa n class="program__connector-icon">+</span> -->
        </div>

        <!-- Правая карточка: развлечения -->
        <div class="program__card program__reveal">
          <div class="program__photo">
            <img :src="cityPhoto" alt="" class="program__photo-image" />
            <div class="program__photo-placeholder">Фото</div>
            <div class="program__photo-overlay"></div>
            <span class="program__photo-badge">{{ cultureBadge }}</span>
          </div>

          <div class="program__body">
            <span class="program__label">{{ cultureLabel }}</span>
            <h3 class="program__subtitle">{{ cultureTitle }}</h3>

            <ul class="program__checklist">
              <li
                v-for="(item, index) in cultureItems"
                :key="item.title"
                class="program__check-item program__reveal"
                :style="{ transitionDelay: (index * 0.06) + 's' }"
              >
                <span class="program__check">✓</span>
                <span class="program__check-text">
                  <span class="program__check-title">{{ item.title }}</span>
                  <span class="program__check-desc">{{ item.desc }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p class="program__tagline program__reveal">
        БОЛЬШЕ ПРАКТИКИ · БОЛЬШЕ ВПЕЧАТЛЕНИЙ · БОЛЬШЕ VIBE
      </p>
    </div>
  </section>
</template>

<style scoped>
.program {
  position: relative;
  padding: 100px 40px;
  /* background-color: var(--color-dark, #1c2536); */
  color: var(--color-white);
  overflow: hidden;
}

/* --- Появление при скролле (как в pricing.vue) --- */
.program__reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.program--visible .program__reveal {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .program__reveal {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

.program__inner {
  position: relative;
  z-index: 1;
  max-width: 1300px;
  margin: 0 auto;
}

.program__title {
  font-family: var(--font-main);
  font-weight: 800;
  font-size: clamp(25px, 3.3vw, 40px);
  letter-spacing: 0.01em;
  text-transform: uppercase;
  margin: 0 0 40px;
  text-align: center;
}

.program__grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
}

/* --- Карточка --- */
.program__card {
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  height: 100%; /* растягивается на высоту grid-строки */
}
/* --- Фото-зона (место под картинку, полупрозрачная плашка сверху) --- */
.program__photo {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 220px;
}

.program__photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.program__photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.06) 10px,
    rgba(255, 255, 255, 0.03) 10px,
    rgba(255, 255, 255, 0.03) 20px
  );
  font-family: var(--font-main);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}

.program__photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%);
  pointer-events: none;
}

.program__photo-badge {
  position: absolute;
  left: 20px;
  bottom: 16px;
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.01em;
  color: var(--color-white);
  background-color: rgba(43, 43, 43, 0.55);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  padding: 8px 14px;
}

.program__body {
  padding: 24px;
  flex: 1; /* заполняет оставшееся место, высоты карточек выравниваются */
  display: flex;
  flex-direction: column;
}

.program__label {
  display: block;
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 4px;
}

.program__subtitle {
  font-family: var(--font-main);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  margin: 0 0 20px;
}

/* --- Статистика (левый блок) --- */
.program__stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 14px;
}

.program__stat {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 12px;
}

.program__stat-value {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-accent);
  line-height: 1.1;
}

.program__stat-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.program__stat-title {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.01em;
  color: var(--color-white);
}

.program__stat-desc {
  font-family: var(--font-main);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.3;
}

/* --- Чек-лист (правый блок) --- */
.program__checklist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}

.program__check-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.program__check {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--color-accent);
  color: var(--color-white);
  font-size: 12px;
  font-weight: 700;
  line-height: 22px;
  text-align: center;
}

.program__check-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.program__check-title {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 13px;
  color: var(--color-white);
}

.program__check-desc {
  font-family: var(--font-main);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.3;
}

/* --- Разделитель "+" --- */
.program__connector {
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.program__connector-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--color-accent);
  color: var(--color-white);
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 22px;
  line-height: 44px;
  text-align: center;
}

/* --- Нижняя строка --- */
.program__tagline {
  margin: 36px 0 0;
  text-align: center;
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

/* --- Адаптив --- */
@media (max-width: 900px) {
  .program {
    padding: 70px 24px;
  }

  .program__grid {
    grid-template-columns: 1fr;
  }

  .program__connector {
    transform: rotate(90deg);
    margin: -4px 0;
  }

  .program__stats,
  .program__checklist {
    grid-template-columns: 1fr;
  }
}
</style>
