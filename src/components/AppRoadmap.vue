<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import roadThickRaw from '../assets/roadmap/road-thick.svg?raw'

interface DayData {
  number: number
  title: string
  intro?: string
  points: string[]
}

const days: DayData[] = [
  { number: 1, title: 'Знакомство с новым вайбом', intro: 'День про адаптацию, первые удары на корте и ощущение, что впереди целая неделя приключений', points: [
    'Прилёт и заселение в отель',
    '2 часа лёгкой теннисной тренировки после дороги',
    'Знакомство с участниками и тренерской командой',
    'Welcome-ужин с национальной кухней Узбекистана',
  ]},
  { number: 2, title: 'Командный дух', points: [
    'Утренняя йога и растяжка',
    'Тренировка 1 (2 часа): техника ударов и стабильность игры',
    'Отдых, прогулки, знакомство с местной гастрономией',
    'Тренировка 2 (2 часа): игровые упражнения и работа в парах',
    'Вечерние игры и командный тимбилдинг',
  ]},
  { number: 3, title: 'Тактика и игровые ситуации', points: [
    'Утренняя йога',
    'Тренировка 1 (2 часа): работа над подачей и приёмом',
    'Свободное время и гастрономические открытия Ташкента',
    'Тренировка 2 (2 часа): тактика одиночной и парной игры',
    'Вечерняя программа и неформальное общение',
  ]},
  { number: 4, title: 'Перезагрузка и знакомство с Узбекистаном', points: [
    'Экскурсия по Ташкенту',
    'Посещение винодельни',
    'Национальная кухня и локальные традиции',
    'День без тренировок — время переключиться и напитаться впечатлениями',
  ]},
  { number: 5, title: 'Интенсив и индивидуальный прогресс', points: [
    'Йога и восстановление',
    'Тренировка 1 (2 часа): работа над слабыми сторонами',
    'Отдых и свободное время',
    'Тренировка 2 (2 часа): игровые сценарии и спецзадания от тренеров',
    'Возможно — приглашённая звезда тенниса Узбекистана',
  ]},
  { number: 6, title: 'Подготовка к турниру', points: [
    'Утренняя практика',
    'Тренировка 1 (2 часа): парная игра и взаимодействие на корте',
    'Время для отдыха и общения',
    'Тренировка 2 (2 часа): матчевые ситуации и турнирные форматы',
    'Подготовка к финальному игровому дню',
  ]},
  { number: 7, title: 'Финальный турнир и большой вечер', intro: 'День запомнится результатами, атмосферой и людьми рядом', points: [
    'Лёгкая утренняя разминка',
    'Итоговый турнир VIBE × Такие Перемены',
    'Матчи, эмоции, поддержка и награждение',
    'Заключительный ужин и праздничный вечер',
  ]},
  { number: 8, title: 'Дорога домой', points: [
    '2 часа утреннего тенниса в свободном формате',
    'Завтрак и прощание',
    'Свободное время для прогулки',
    'Трансфер в аэропорт и вылет домой',
  ]},
]

// ============================================================
// ГЕОМЕТРИЯ ПУТИ
// viewBox совпадает с толстой/тонкой лентой из Figma (5218 x 4522).
//
// ВАЖНО: axisPathD сейчас — это контур ТОНКОЙ ленты (fill-фигура из
// нескольких замкнутых подпутей), а не честная осевая линия. Мы используем
// только первую половину её длины как приближение центра дороги.
// На резких разворотах маршрута точки-дни могут слегка отклоняться от
// видимой ленты — если это будет заметно, нужно заменить axisPathD на
// настоящий одиночный path со stroke, нарисованный Pen tool'ом в Figma
// (см. инструкцию в чате), БЕЗ применения Outline Stroke.
// ============================================================
const viewBoxWidth = 5218
const viewBoxHeight = 4522

const axisPathD = 'M284.919 534.796C284.807 534.544 284.511 534.431 284.259 534.543C284.007 534.656 283.893 534.951 284.006 535.204L284.462 535L284.919 534.796ZM227.962 2883.5L227.469 2883.58L227.473 2883.61L227.482 2883.64L227.962 2883.5ZM4997.96 3853.48C4998.22 3853.4 4998.37 3853.12 4998.29 3852.85L4996.97 3848.55C4996.89 3848.29 4996.61 3848.14 4996.35 3848.22C4996.09 3848.3 4995.94 3848.58 4996.02 3848.84L4997.19 3852.67L4993.36 3853.84C4993.1 3853.92 4992.95 3854.2 4993.03 3854.46C4993.11 3854.73 4993.39 3854.88 4993.66 3854.79L4997.96 3853.48ZM284.462 535L284.006 535.204C284.292 535.845 284.902 536.556 285.757 537.329C286.624 538.111 287.785 538.995 289.228 539.977C292.117 541.941 296.173 544.324 301.352 547.103C311.71 552.663 326.596 559.835 345.691 568.463C383.882 585.721 438.939 608.822 508.345 636.541C647.16 691.979 843.396 765.899 1076.96 848.518C1544.1 1013.76 2160.57 1213.79 2765.66 1370.36C3370.74 1526.92 3964.5 1640.03 4386.18 1631.39C4597 1627.07 4764.91 1592.31 4869.71 1517.25C4922.12 1479.71 4958.75 1432.09 4977.05 1373.15C4995.36 1314.23 4995.32 1244.03 4974.48 1161.38L4974 1161.5L4973.52 1161.62C4994.32 1244.15 4994.33 1314.15 4976.1 1372.86C4957.87 1431.56 4921.38 1479.01 4869.13 1516.44C4764.59 1591.32 4596.94 1626.07 4386.16 1630.39C3964.62 1639.03 3370.98 1525.95 2765.91 1369.39C2160.85 1212.83 1544.41 1012.81 1077.3 847.576C843.739 764.96 647.516 691.044 508.716 635.612C439.315 607.895 384.275 584.801 346.103 567.552C327.016 558.927 312.153 551.766 301.825 546.222C296.659 543.449 292.637 541.086 289.791 539.15C288.367 538.182 287.247 537.327 286.428 536.587C285.597 535.837 285.117 535.241 284.919 534.796L284.462 535ZM4974 1161.5L4974.48 1161.38C4953.64 1078.71 4918.29 1018.14 4870.18 976.94C4822.08 935.743 4761.28 913.962 4689.61 908.806C4546.31 898.495 4359.5 954.65 4143.64 1055.1C3711.91 1255.99 3163.67 1634.23 2614.35 2013.18C2065.01 2392.14 1514.57 2771.8 1078.38 2975.63C860.277 3077.55 670.812 3135.46 524.363 3127.4C451.152 3123.37 388.715 3102.85 338.817 3063.11C288.92 3023.38 251.52 2964.39 228.443 2883.36L227.962 2883.5L227.482 2883.64C250.601 2964.82 288.099 3024 338.194 3063.89C388.289 3103.79 450.941 3124.36 524.308 3128.4C671.018 3136.48 860.673 3078.47 1078.8 2976.54C1515.09 2772.67 2065.6 2392.94 2614.92 2014C3164.27 1635.04 3712.43 1256.86 4144.07 1056C4359.9 955.569 4546.51 899.512 4689.54 909.803C4761.04 914.948 4821.63 936.671 4869.53 977.699C4917.44 1018.73 4952.71 1079.1 4973.52 1161.62L4974 1161.5ZM227.962 2883.5L228.456 2883.42C216.053 2806.17 220.471 2740.61 239.835 2685.68C259.198 2630.76 293.514 2586.44 340.959 2551.67C435.868 2482.12 583.326 2450.79 768.672 2449.41C1139.34 2446.65 1661.19 2563.68 2216.14 2733.65C3326.02 3073.58 4568.11 3625.21 4997.58 3894.06L5019.63 3811.94C4587.56 3582.32 3342.71 3029.54 2229.9 2688.71C1674.4 2518.57 1146.68 2399.59 768.322 2402.41C579.993 2403.81 420.223 2435.31 313.177 2513.76C258.687 2553.69 218.251 2605.55 195.509 2670.05C172.931 2734.1 168.729 2807.9 182.05 2890.87L227.962 2883.5Z'

const PX_PER_SECOND = 250 // скорость прорисовки — px в секунду

const sectionRef = ref<HTMLElement | null>(null)
const pathElRef = ref<SVGPathElement | null>(null)

const rawPathLength = ref(0) // полная длина контура тонкой ленты (обе стороны)
const pathLength = ref(0) // используемая половина длины — приближение центра

const points = reactive<{ number: number; xPercent: number; yPercent: number; delayFraction: number }[]>([])

function computePoints() {
  const pathEl = pathElRef.value
  if (!pathEl) return
  const raw = pathEl.getTotalLength()
  rawPathLength.value = raw
  const length = raw / 2
  pathLength.value = length

  points.length = 0
  days.forEach((day, index) => {
    const fraction = days.length > 1 ? index / (days.length - 1) : 0
    const pt = pathEl.getPointAtLength(fraction * length)
    points.push({
      number: day.number,
      xPercent: (pt.x / viewBoxWidth) * 100,
      yPercent: (pt.y / viewBoxHeight) * 100,
      delayFraction: fraction,
    })
  })
}

// Достаём внутреннее содержимое (path'ы) из сырого SVG толстой ленты,
// чтобы вставить его через v-html внутрь нашего собственного <svg>.
const roadArtInnerHTML = computed(() => {
  const match = roadThickRaw.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  return match ? match[1] : ''
})

const supportsHover = ref(true)
const started = ref(false)
let observer: IntersectionObserver | null = null

onMounted(async () => {
  supportsHover.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  await nextTick()
  computePoints()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          started.value = true
          observer?.disconnect()
        }
      })
    },
    { threshold: 0.2 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

const totalDuration = computed(() => pathLength.value / PX_PER_SECOND)

// Стиль маски: раскрывает только первую половину контура — то есть весь
// путь от начала до конца дороги (без обратного хода по второй стороне ленты).
const maskLineStyle = computed(() => ({
  strokeDasharray: `${pathLength.value} ${rawPathLength.value}`,
  strokeDashoffset: started.value ? 0 : pathLength.value,
  transition: `stroke-dashoffset ${totalDuration.value}s ease-in-out`,
}))

function getDay(number: number) {
  return days.find((d) => d.number === number)!
}

const activeDay = ref<number | null>(null)

function handleMarkerClick(number: number) {
  if (!supportsHover.value) activeDay.value = activeDay.value === number ? null : number
}
function handleMarkerEnter(number: number) {
  if (supportsHover.value) activeDay.value = number
}
function handleMarkerLeave(number: number) {
  if (supportsHover.value && activeDay.value === number) activeDay.value = null
}
</script>

<template>
  <section class="roadmap" ref="sectionRef">
    <div class="roadmap__intro">
      <h2 class="roadmap__title">План поездки</h2>
      <p class="roadmap__subtitle">8 дней в Ташкенте — маршрут по дням</p>
    </div>

    <div class="roadmap__canvas" :style="{ aspectRatio: `${viewBoxWidth} / ${viewBoxHeight}` }">
      <svg class="roadmap__svg" :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`" preserveAspectRatio="xMidYMid meet">
        <defs>
          <mask id="roadmap-reveal-mask" maskUnits="userSpaceOnUse" x="0" y="0" :width="viewBoxWidth" :height="viewBoxHeight">
            <path
              ref="pathElRef"
              :d="axisPathD"
              fill="none"
              stroke="white"
              stroke-width="260"
              stroke-linecap="round"
              stroke-linejoin="round"
              :style="maskLineStyle"
            />
          </mask>
        </defs>

        <g mask="url(#roadmap-reveal-mask)" v-html="roadArtInnerHTML"></g>
      </svg>

      <div
        v-for="point in points"
        :key="point.number"
        class="roadmap__day"
        :style="{ left: point.xPercent + '%', top: point.yPercent + '%' }"
      >
        <button
          type="button"
          class="roadmap__marker"
          :class="{ 'roadmap__marker--visible': started }"
          :style="{ transitionDelay: `${point.delayFraction * totalDuration}s` }"
          @click="handleMarkerClick(point.number)"
          @mouseenter="handleMarkerEnter(point.number)"
          @mouseleave="handleMarkerLeave(point.number)"
        >
          {{ point.number }}
        </button>

        <div
          class="roadmap__label"
          :class="{ 'roadmap__label--visible': started }"
          :style="{ transitionDelay: `${point.delayFraction * totalDuration}s` }"
        >
          День {{ point.number }}<br />{{ getDay(point.number).title }}
        </div>

        <transition name="roadmap-fade">
          <div v-if="supportsHover && activeDay === point.number" class="roadmap__card roadmap__card--float">
            <p v-if="getDay(point.number).intro" class="roadmap__card-intro">{{ getDay(point.number).intro }}</p>
            <ul>
              <li v-for="(p, i) in getDay(point.number).points" :key="i">{{ p }}</li>
            </ul>
          </div>
        </transition>

        <div
          v-if="!supportsHover"
          class="roadmap__card roadmap__card--inline"
          :class="{ 'roadmap__card--open': activeDay === point.number }"
        >
          <div class="roadmap__card-inner">
            <p v-if="getDay(point.number).intro" class="roadmap__card-intro">{{ getDay(point.number).intro }}</p>
            <ul>
              <li v-for="(p, i) in getDay(point.number).points" :key="i">{{ p }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.roadmap {
  padding: 100px 40px;
  background-color: var(--color-background);
}

.roadmap__intro {
  text-align: center;
  margin-bottom: 48px;
}

.roadmap__title {
  font-family: var(--font-main);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
}

.roadmap__subtitle {
  font-family: var(--font-main);
  color: var(--color-text-muted);
}

.roadmap__canvas {
  position: relative;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.roadmap__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.roadmap__day {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 2;
}

.roadmap__marker {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background-color: var(--color-accent);
  color: var(--color-white);
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.4);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease;
}

.roadmap__marker--visible {
  opacity: 1;
  transform: scale(1);
}

.roadmap__marker:hover {
  background-color: var(--color-sky);
}

.roadmap__label {
  position: absolute;
  top: calc(100% + 10px);
  width: 140px;
  font-family: var(--font-main);
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.4;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.roadmap__label--visible {
  opacity: 1;
  transform: translateY(0);
}

.roadmap__card {
  font-family: var(--font-main);
  text-align: left;
}

.roadmap__card--float {
  position: absolute;
  bottom: calc(100% + 60px);
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  z-index: 3;
}

.roadmap__card-intro {
  font-size: 13px;
  color: var(--color-sky);
  margin-bottom: 10px;
  font-style: italic;
}

.roadmap__card ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.roadmap__card li {
  position: relative;
  padding-left: 18px;
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.roadmap__card li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
}

.roadmap-fade-enter-active,
.roadmap-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.roadmap-fade-enter-from,
.roadmap-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

.roadmap__card--inline {
  position: absolute;
  top: calc(100% + 60px);
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.roadmap__card--inline.roadmap__card--open {
  max-height: 500px;
}

.roadmap__card-inner {
  padding-top: 8px;
}

@media (max-width: 640px) {
  .roadmap {
    padding: 60px 20px;
  }
}
</style>