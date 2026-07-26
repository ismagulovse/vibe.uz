<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import ContactForm from '@/components/ContactForm.vue'
import contactBg from '../assets/Background_image2.jpg'
import telegramIcon from '@/assets/telegram.svg'
import maxIcon from '@/assets/max.svg'

const socialLinks = [
  { name: 'Telegram', href: 'https://t.me/tennisvibetmn', icon: telegramIcon },
  { name: 'Max', href: 'https://t.me/tennisvibetmn', icon: maxIcon },
]

// --- Появление при скролле ---
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
  <section id="section-6" ref="sectionRef" class="contact" :class="{ 'contact--visible': isVisible }">
    <div class="contact__panel contact__panel--visual">
      <div class="contact__frame contact__reveal contact__reveal--1">
        <img :src="contactBg" alt="Tashkent Tennis Camp" class="contact__bg-image" />
        <div class="contact__bg-overlay"></div>

        <div class="contact__copy">
          <span class="contact__eyebrow">1–8 октября 2026 <i class="contact__dot"></i> Ташкент, Узбекистан</span>
          <h2 class="contact__brand">Tashkent<br />Tennis Camp</h2>
          <p class="contact__tagline">
            <span class="contact__tagline-text">Теннис со вкусом востока</span>
            <span class="contact__tagline-line"></span>
          </p>
        </div>
      </div>
    </div>

    <div class="contact__panel contact__panel--form contact__reveal contact__reveal--3">
      <div class="contact__form-inner">
        <h3 class="contact__form-title">Оставить заявку</h3>
        <p class="contact__form-subtitle">Заполните форму — мы свяжемся с вами и ответим на все вопросы</p>

        <ContactForm />

        <div class="contact__social">
          <span class="contact__social-label">Наши группы</span>
          <div class="contact__social-icons">
            <a
              v-for="link in socialLinks"
              :key="link.name"
              :href="link.href"
              target="_blank"
              rel="noopener"
              class="contact__social-link"
            >
              <img :src="link.icon" :alt="link.name" class="contact__social-svg" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 640px;
  background-color: var(--color-background);
}

/* --- Reveal: карточка фото → текст → линия под тэглайном → форма --- */
.contact__reveal {
  opacity: 0;
  transform: translateY(24px);

  transition: opacity 0.7s ease, transform 0.7s ease;
}

.contact--visible .contact__reveal--1 { opacity: 1; transform: translateY(0); transition-delay: 0s; }
.contact--visible .contact__reveal--2 { opacity: 1; transform: translateY(0); transition-delay: 0.15s; }
.contact--visible .contact__reveal--3 { opacity: 1; transform: translateY(0); transition-delay: 0.25s; }

.contact--visible .contact__tagline-line {
  transform: scaleX(1);
  transition-delay: 0.65s;
}

@media (prefers-reduced-motion: reduce) {
  .contact__reveal,
  .contact__tagline-line {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}

/* --- Левая панель: фото-карточка + текстовый блок --- */
.contact__panel--visual {
  display: flex;
  align-items: center;
  padding: 56px;
  background-color: var(--color-background);
}

.contact__frame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 48px -24px rgba(30, 30, 30, 0.35);
  outline: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent);
  outline-offset: 8px;
}

.contact__bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact__bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(20, 20, 20, 0.15) 0%,
    rgba(20, 20, 20, 0.75) 100%
  );
}

.contact__copy {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  padding: 40px;
  color: var(--color-white);
}

.contact__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  width: fit-content;
}

.contact__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--color-accent);
  flex-shrink: 0;
}

.contact__brand {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.05;
  color: var(--color-white);
  margin: 0;
}

.contact__tagline {
  position: relative;
  display: inline-block;
  width: fit-content;
  padding-bottom: 10px;
}

.contact__tagline-text {
  font-family: var(--font-main);
  font-style: italic;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
}

.contact__tagline-line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s ease;
}

/* --- Правая панель: форма --- */
.contact__panel--form {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 48px;
  background-color: var(--color-background);
}

.contact__form-inner {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact__form-title {
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 26px;
  color: var(--color-text);
  margin: 0;
}

.contact__form-subtitle {
  font-family: var(--font-main);
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0 0 16px;
}

.contact__social {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact__social-label {
  font-family: var(--font-main);
  font-size: 13px;
  color: var(--color-text-muted);
}

.contact__social-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.contact__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-text-muted) 30%, transparent);
  text-decoration: none;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.contact__social-link:hover {
  border-color: var(--color-accent);
  background-color: color-mix(in srgb, var(--color-accent) 8%, transparent);
  transform: translateY(-1px);
}

.contact__social-svg {
  height: 24px;
  width: auto;
  display: block;
}

@media (max-width: 900px) {
  .contact {
    grid-template-columns: 1fr;
  }

  .contact__panel--visual {
    padding: 40px 28px;
    gap: 28px;
  }

  .contact__frame {
    aspect-ratio: 16 / 10;
    outline-offset: 6px;
  }

  .contact__panel--form {
    padding: 40px 28px;
  }
}
</style>