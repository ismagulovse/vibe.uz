<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import pricingBg from '../assets/Background_image.jpg'
import { useModalStore } from '@/stores/modal'
const modal = useModalStore()

// --- Цена ---
const EARLY_PRICE = '99 000 ₽'
const FULL_PRICE = '115 000 ₽'
const SAVE_AMOUNT = '16 000 ₽'
const DEADLINE = '20 августа'

// --- Что входит в стоимость ---
const includedItems = [
  { title: 'Отель Bently Hotel Tashkent 4 ★', desc: 'Двухместное размещение' },
  { title: 'Питание · полупансион', desc: 'Завтрак и ужин' },
  { title: 'Трансфер', desc: 'Групповой трансфер аэропорт — отель — аэропорт' },
  { title: 'Корты', desc: 'Аренда на весь кэмп' },
  { title: 'Тренировки', desc: 'Теннис + Йога' },
  { title: 'Развлекательная программа', desc: 'Винодельня + Мастер-класс по приготовлению плова' },
  { title: 'Турнир', desc: 'Международный' },
  { title: 'Два праздничных ужина', desc: 'Welcome-вечер · Финальный ужин' },
]

// --- Что оплачивается отдельно ---
const extraItems = [
  // 'Авиаперелёт 45–50 000 ₽',
  'Авиаперелёт',
  'Страховка',
  'Личные расходы',
]

// --- Анимация появления при скролле ---
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
  <section id="section-5" ref="sectionRef" class="pricing" :class="{ 'pricing--visible': isVisible }">
    <div class="pricing__bg">
      <img :src="pricingBg" alt="" class="pricing__bg-image" />
      <div class="pricing__bg-overlay"></div>
    </div>

    <div class="pricing__content">
      <div class="pricing__intro pricing__reveal">
        <h2 class="pricing__title">Стоимость кэмпа</h2>

        <span class="pricing__badge">Раннее бронирование · до {{ DEADLINE }}</span>

        <div class="pricing__price-row">
          <span class="pricing__price">{{ EARLY_PRICE }}</span>
          <span class="pricing__price-old">{{ FULL_PRICE }}</span>
        </div>

        <p class="pricing__price-note">
          Экономия {{ SAVE_AMOUNT }} при бронировании до {{ DEADLINE }}, далее — {{ FULL_PRICE }}
        </p>
        <!-- <p class="pricing__price-note pricing__price-note--muted">
          Полная программа кэмпа на 8 дней
        </p> -->

        <button class="pricing__cta" type="button" @click="modal.open()">Зафиксировать цену</button>
      </div>

      <div class="pricing__details">
        <div class="pricing__block pricing__reveal">
          <h3 class="pricing__block-title">В стоимость входит</h3>
          <ul class="pricing__included">
            <li
              v-for="(item, index) in includedItems"
              :key="item.title"
              class="pricing__included-item pricing__reveal"
              :style="{ transitionDelay: (index * 0.06) + 's' }"
            >
              <span class="pricing__check">✓</span>
              <span class="pricing__included-text">
                <span class="pricing__included-title">{{ item.title }}</span>
                <span class="pricing__included-desc">{{ item.desc }}</span>
              </span>
            </li>
          </ul>
        </div>

        <div class="pricing__block pricing__reveal">
          <h3 class="pricing__block-title pricing__block-title--muted">Оплачивается отдельно</h3>
          <ul class="pricing__extra">
            <li v-for="item in extraItems" :key="item" class="pricing__extra-item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing {
  position: relative;
  padding: 100px 40px;
  overflow: hidden;
  color: var(--color-white);
}

.pricing__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.pricing__bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pricing__bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(58, 73, 104, 0.88) 0%,
    rgba(43, 43, 43, 0.82) 100%
  );
}

.pricing__content {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 64px;
  align-items: start;
}

/* --- Появление при скролле --- */
.pricing__reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.pricing--visible .pricing__reveal {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .pricing__reveal {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

/* --- Левая колонка: цена --- */
.pricing__intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.pricing__title {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: clamp(28px, 3vw, 40px);
  margin: 0 0 4px;
}

.pricing__badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-white);
  background-color: var(--color-accent);
  border-radius: 999px;
  padding: 6px 14px;
}

.pricing__price-row {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-top: 8px;
}

.pricing__price {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: clamp(40px, 5vw, 60px);
  line-height: 1.05;
}

.pricing__price-old {
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
}

.pricing__price-note {
  font-family: var(--font-main);
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  max-width: 340px;
  margin: 0;
}

.pricing__price-note--muted {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.pricing__cta {
  margin-top: 16px;
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

.pricing__cta:hover {
  background-color: var(--color-sky);
  transform: translateY(-2px);
}

/* --- Правая колонка: содержание --- */
.pricing__details {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.pricing__block {
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(6px);
}

.pricing__block-title {
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-white);
  margin: 0 0 16px;
}

.pricing__block-title--muted {
  color: rgba(255, 255, 255, 0.6);
}

.pricing__included {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
}

.pricing__included-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.pricing__check {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--color-accent);
  color: var(--color-white);
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}

.pricing__included-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pricing__included-title {
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-white);
}

.pricing__included-desc {
  font-family: var(--font-main);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.4;
}

.pricing__extra {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pricing__extra-item {
  font-family: var(--font-main);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 8px 16px;
}

@media (max-width: 900px) {
  .pricing {
    padding: 70px 24px;
  }

  .pricing__content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .pricing__intro {
    align-items: center;
    text-align: center;
  }

  .pricing__price-note {
    max-width: none;
    margin-left: auto;
    margin-right: auto;
  }

  .pricing__included {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .pricing__price-row {
    flex-direction: column;
    gap: 4px;
  }
}
</style>