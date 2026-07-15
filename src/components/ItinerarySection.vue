<script setup lang="ts">
import { ref } from 'vue'
import day1 from '@/assets/days/day1.jpg'
import day2 from '@/assets/days/day2.jpg'
import day3 from '@/assets/days/day3.jpg'
import day4 from '@/assets/days/day4.jpg'
import day5 from '@/assets/days/day5.jpg'
import day6 from '@/assets/days/day6.jpg'
import day7 from '@/assets/days/day7.jpg'
import day8 from '@/assets/days/day8.jpg'



interface Day {
  number: number
  title: string
  activities: string[]
  note?: string
  photo: string
}

// Фото — заглушки, замените photo на реальные пути, когда подберёте (например '@/assets/itinerary/day1.jpg')
const days: Day[] = [
  {
    number: 1,
    title: 'Знакомство с новым вайбом',
    activities: [
      'Прилёт и заселение в отель',
      '2 часа лёгкой теннисной тренировки после дороги',
      'Знакомство с участниками и тренерской командой',
      'Welcome-ужин с национальной кухней Узбекистана',
    ],
    note: 'День про адаптацию, первые удары на корте и ощущение, что впереди целая неделя приключений',
    photo: day1,
  },
  {
    number: 2,
    title: 'Командный дух',
    activities: [
      'Утренняя йога и растяжка',
      'Тренировка 1 (2 часа): техника ударов и стабильность игры',
      'Отдых, прогулки и местная гастрономия',
      'Тренировка 2 (2 часа): игровые упражнения и работа в парах',
      'Вечерние игры и командный тимбилдинг',
    ],
    photo:day2,
  },
  {
    number: 3,
    title: 'Тактика и игровые ситуации',
    activities: [
      'Утренняя йога',
      'Тренировка 1 (2 часа): работа над подачей и приёмом',
      'Свободное время и гастрономические открытия Ташкента',
      'Тренировка 2 (2 часа): тактика одиночной и парной игры',
      'Вечерняя программа и неформальное общение',
    ],
    photo: day3,
  },
  {
    number: 4,
    title: 'Перезагрузка и знакомство с Узбекистаном',
    activities: [
      'Экскурсия по Ташкенту',
      'Посещение винодельни',
      'Национальная кухня и локальные традиции',
      'День без тренировок — время переключиться и напитаться впечатлениями',
    ],
    note: 'Едем не только играть в теннис, но и открывать новую точку на карте VIBE',
    photo: day4,
  },
  {
    number: 5,
    title: 'Интенсив и индивидуальный прогресс',
    activities: [
      'Йога и восстановление',
      'Тренировка 1 (2 часа): работа над собственными слабыми сторонами',
      'Отдых и свободное время',
      'Тренировка 2 (2 часа): игровые сценарии и спецзадания от тренеров',
      'Возможно — приглашённая звезда тенниса Узбекистана',
    ],
    photo:day5,
  },
  {
    number: 6,
    title: 'Подготовка к турниру',
    activities: [
      'Утренняя практика',
      'Тренировка 1 (2 часа): парная игра и взаимодействие на корте',
      'Отдых и общение',
      'Тренировка 2 (2 часа): матчевые ситуации и турнирные форматы',
      'Подготовка к финальному игровому дню',
    ],
    photo: day6,
  },
  {
    number: 7,
    title: 'Финальный турнир и большой вечер',
    activities: [
      'Лёгкая утренняя разминка',
      'Итоговый турнир VIBE × Такие Перемены',
      'Матчи, эмоции, поддержка и награждение',
      'Заключительный ужин и праздничный вечер',
    ],
    note: 'День запомнится результатами, атмосферой и людьми рядом',
    photo: day7,
  },
  {
    number: 8,
    title: 'Дорога домой',
    activities: [
      '2 часа утреннего тенниса в свободном формате',
      'Завтрак и прощание',
      'Свободное время, прогулки',
      'Трансфер в аэропорт и вылет домой',
    ],
    photo: day8,
  },
]

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section id="section-3" class="itinerary">
    <h2 class="itinerary__title">План поездки</h2>

    <div class="itinerary__row">
      <div
        v-for="(day, i) in days"
        :key="day.number"
        class="day-card"
        :class="{ 'day-card--open': openIndex === i }"
        @click="toggle(i)"
      >
        <!-- затемнённая обложка, видна пока карточка узкая -->
        <div class="day-card__cover" :style="{ backgroundImage: `url(${day.photo})` }">
          <div class="day-card__cover-overlay"></div>
          <div class="day-card__label">
            <span class="day-card__label-day">День {{ day.number }}</span>
            <span class="day-card__label-title">{{ day.title }}</span>
          </div>
        </div>

        <!-- раскрытое содержимое -->
        <div class="day-card__panel">
          <div class="day-card__panel-media" :style="{ backgroundImage: `url(${day.photo})` }"></div>
          <div class="day-card__panel-body">
            <span class="day-card__panel-day">День {{ day.number }}</span>
            <h3 class="day-card__panel-title">{{ day.title }}</h3>
            <ul class="day-card__list">
              <li v-for="(activity, j) in day.activities" :key="j">{{ activity }}</li>
            </ul>
            <p v-if="day.note" class="day-card__note">{{ day.note }}</p>
          </div>
        </div>

        <!-- <button class="day-card__toggle" @click.stop="toggle(i)" aria-label="Раскрыть день">
          <svg viewBox="0 0 24 24" width="18" height="18">
           <path d="M17 7L7 17M7 17H15M7 17V9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button> -->
      </div>
    </div>
  </section>
</template>

<style scoped>
.itinerary {
  padding: 80px 40px;
}

.itinerary__title {
  color: var(--color-text);
  font-weight: 700;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 48px;
}

.itinerary__row {
  display: flex;
  justify-content: center; /* центрируем, когда карточки помещаются */
  gap: 12px;
  max-width: 1400px;      /* чтобы не растягивались на весь очень широкий экран */
  margin: 0 auto;          /* центрируем сам контейнер тоже */
  overflow-x: auto;
  padding-bottom: 12px;
}

/* ===== Карточка: базовые общие стили ===== */
.day-card {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 100px;
  overflow: hidden;
  transition: flex-basis 0.6s cubic-bezier(0.22, 1, 0.36, 1), width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.day-card__cover {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: opacity 0.25s ease;
}

.day-card__cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 30, 30, 0.45); /* затемнение обложки в узком состоянии */
  transition: opacity 0.25s ease;
}

.day-card__label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--color-white);
  white-space: nowrap;
  transition: opacity 0.25s ease;
}

.day-card__label-day {
  font-weight: 700;
  font-size: 1.1rem;
}

.day-card__label-title {
  font-size: 0.85rem;
  opacity: 0.85;
}

.day-card__panel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
    transition: opacity 0.35s ease;
}

.day-card__panel-media {
  flex: 0 0 40%;
  background-size: cover;
  background-position: center 50%;
}

.day-card__panel-body {
  flex: 1;
  background: var(--color-white);
  padding: 24px;
  overflow-y: auto;
}

.day-card__panel-day {
  color: var(--color-sky);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.day-card__panel-title {
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.3rem;
  margin: 8px 0 16px;
}

.day-card__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.day-card__list li {
  position: relative;
  padding-left: 20px;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  line-height: 1.4;
}

.day-card__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
}

.day-card__note {
  color: var(--color-text);
  font-style: italic;
  font-size: 0.9rem;
  border-top: 1px solid rgba(58, 73, 104, 0.15);
  padding-top: 14px;
}

.day-card__toggle {
  position: absolute;
  border: none;
  border-radius: 50%;
  background: var(--color-white);
  color: var(black);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), left 0.6s ease, bottom 0.6s ease;
  z-index: 2;
}

.day-card--open .day-card__toggle {
    border-radius: 50px;
    background: var(--color-accent);
     color: var(--color-white);
  transform: rotate(135deg); /* стрелка "разворачивается" на закрытие */

}
.day-card--open .day-card__panel {
  transition-delay: 0.45s;
}
/* ===== ДЕСКТОП / ПЛАНШЕТ: вертикальные карточки в ряд ===== */
@media (min-width: 768px) {
  .day-card {
    flex-basis: 110px;
    height: 560px;
  }

  .day-card--open {
    flex-basis: 480px;
    border-radius: 50px;
  }

  .day-card__label {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
  }

  .day-card--open .day-card__cover {
    opacity: 0; /* прячем узкую обложку — она заменяется медиа внутри панели */
  }

  .day-card--open .day-card__cover-overlay {
    opacity: 0;
  }

  .day-card--open .day-card__label {
    opacity: 0;
  }

  .day-card--open .day-card__panel {
    opacity: 1;
    pointer-events: auto;
  }

  .day-card__toggle {
  width: 65px;
  height: 65px;
  bottom: 12px;
  left: 22px;
 

}

.day-card--open .day-card__toggle {
  width: 44px;
  height: 44px;
  bottom: 12px;
  left: auto;
  right: 12px; /* сразу справа, без анимации перемещения */
  
}
}

/* ===== МОБИЛЬНЫЕ: горизонтальные карточки в колонку ===== */
@media (max-width: 767px) {
  .itinerary__row {
    flex-direction: column;
    overflow-x: visible;
  }

  .day-card {
    width: 100%;
    height: 100px;
  }

  .day-card--open {
    height: 420px;
    border-radius: 20px; /* добавьте эту строку */
  }

  .day-card__label {
    left: 24px;
    top: 50%;
    transform: translateY(-50%);
    align-items: flex-start;
  }

  .day-card--open .day-card__cover {
    opacity: 0;
  }

  .day-card--open .day-card__cover-overlay {
    opacity: 0;
  }

  .day-card--open .day-card__label {
    opacity: 0;
  }

  .day-card--open .day-card__panel {
    opacity: 1;
    pointer-events: auto;
  }

  .day-card__panel {
    flex-direction: column;
  }

  .day-card__toggle {
    width: 100px;
    height: 100px;
    right: 0;
    top: 0;
  }

  .day-card--open .day-card__toggle {
    width: 56px;
    height: 56px;
    right: 12px;
    top: 12px;
  }
}
</style>