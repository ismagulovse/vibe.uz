<script setup lang="ts">
import { ref } from 'vue'
import pricingBg from '../assets/Background_image.jpg'
import { useModalStore } from '@/stores/modal'
const modal = useModalStore()

const PRICE = '104 000 ₽'

const includedItems = [
  'Комфортное проживание в двухместном номере отеля 4★',
  'Завтраки «шведский стол» — на любой вкус',
  'Трансфер аэропорт — отель — аэропорт без лишних хлопот',
  'Аренда кортов на всё время сбора',
  'Ежедневные тренировки с профессиональным тренером',
  'Итоговый турнир с призами',
  'Экскурсия на винодельню с дегустацией',
  '2 торжественных ужина в тёплой компании',
  'Фирменный мерч на память',
  'Утренние занятия йогой для восстановления',
]

const extraItems = [
  'Авиаперелёт (ориентировочно 45–50 тыс. руб., Utair)',
  'Обеды и ужины по желанию',
  'Дополнительные активности и сувениры',
  'Индивидуальная медицинская страховка',
  'Личные расходы',
]

type TabKey = 'included' | 'extra'

const activeTab = ref<TabKey>('included')

const tabs: { key: TabKey; label: string }[] = [
  { key: 'included', label: 'Входит в стоимость' },
  { key: 'extra', label: 'Дополнительные расходы' },
]

</script>

<template>
  <section id="section-5" class="pricing">
    <div class="pricing__bg">
      <img :src="pricingBg" alt="" class="pricing__bg-image" />
      <div class="pricing__bg-overlay"></div>
    </div>
    <div class="pricing__content">
        <div class="pricing__intro">
          <h2 class="pricing__title">Стоимость кэмпа</h2> 
        <h2 class="pricing__price">{{ PRICE }}</h2>
        <p class="pricing__price-note">за участие в кэмпе, полная программа на 8 дней</p>
        <button class="pricing__cta" type="button"  @click="modal.open()">Забронировать место</button>
      </div>

      <div class="pricing__tabs-block">
        <div class="pricing__tabs" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="pricing__tab"
            :class="{ 'pricing__tab--active': activeTab === tab.key }"
            role="tab"
            :aria-selected="activeTab === tab.key"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="pricing__list-wrapper">
          <ul
            v-for="tab in tabs"
            :key="tab.key"
            class="pricing__list"
            :class="{ 'pricing__list--active': activeTab === tab.key }"
          >
            <li v-for="(item, index) in (tab.key === 'included' ? includedItems : extraItems)" :key="index">
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

.pricing__title {
  grid-column: 1 / -1;   /* растянуть на обе колонки */
  font-family: var(--font-main);
  font-weight: 700;
  font-size: clamp(28px, 3vw, 40px);
  margin: 0 0 8px;
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

.pricing__intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.pricing__price {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: clamp(40px, 5vw, 60px);
  line-height: 1.05;
  margin: 0;
}

.pricing__price-note {
  font-family: var(--font-main);
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  max-width: 320px;
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

.pricing__tabs-block {
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 8px;
  backdrop-filter: blur(6px);
}

.pricing__tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.pricing__tab {
  flex: 1;
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  background: transparent;
  border: none;
  border-radius: 12px;
  padding: 14px 12px;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.pricing__tab--active {
  background-color: rgba(255, 255, 255, 0.14);
  color: var(--color-white);
}

.pricing__list-wrapper {
  display: grid;
}

.pricing__list {
  grid-area: 1 / 1;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 16px 24px;
  opacity: 0;
  transform: translateY(6px);
  pointer-events: none;
  visibility: hidden;
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0s linear 0.4s;
}

.pricing__list--active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  visibility: visible;
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0s linear 0s;
}

.pricing__list li {
  position: relative;
  padding-left: 24px;
  font-family: var(--font-main);
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}

.pricing__list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-sky);
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
  }
}

@media (max-width: 480px) {
  .pricing__tabs {
    flex-direction: column;
  }
}
</style>