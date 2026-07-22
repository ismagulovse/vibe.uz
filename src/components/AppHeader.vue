<template>
  <header class="app-header":class="{ 'app-header--scrolled': isScrolled }">
    <nav class="app-header__nav app-header__nav--left" aria-label="Навигация слева">
      <a href="#" class="app-header__link" @click.prevent="scrollToSection('section-1')">Главная</a>
      <a href="#" class="app-header__link" @click.prevent="scrollToSection('section-2')">Для кого?</a>
      <a href="#" class="app-header__link" @click.prevent="scrollToSection('section-3')">План</a>
    </nav>

    <div class="app-header__logos">
      <img :src="logoVibe" alt="Логотип компании 2" class="app-header__logo app-header__logo--vibe"/>
      <span class="app-header__cross">×</span>
      <img :src="logoTP" alt="Логотип компании 1" class="app-header__logo app-header__logo--tp" />
    </div>

    <nav class="app-header__nav app-header__nav--right" aria-label="Навигация справа">
      <a href="#" class="app-header__link" @click.prevent="scrollToSection('section-4')">Тренера</a>
      <a href="#" class="app-header__link" @click.prevent="scrollToSection('section-5')">Стоимость</a>
      <a href="#" class="app-header__link" @click.prevent="scrollToSection('section-6')">Контакты</a>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import logoTP from '../assets/LogoTP.svg'
import logoVibe from '../assets/Vibe.svg'

const route = useRoute()
const router = useRouter()

function scrollToSection(id: string) {
  // если мы не на главной — сначала переходим на неё, потом скроллим
  if (route.path !== '/') {
    router.push('/').then(() => {
      requestAnimationFrame(() => scrollNow(id))
    })
    return
  }
  scrollNow(id)
}

function scrollNow(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  transition: box-shadow 0.2s ease;
  
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  padding: 20px 32px;
  background-color: var(--color-background);
  font-family: var(--font-main);

  /* остальные стили без изменений */
}
.app-header--scrolled {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.app-header__nav {
  display: flex;
  gap: 24px;
}

.app-header__nav--left {
  justify-content: flex-end;
}

.app-header__nav--right {
  justify-content: flex-start;
}

.app-header__link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.app-header__link:hover {
  color: var(--color-sky);
}

.app-header__logos {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-self: center;
}

.app-header__logo {
  width: auto;
}

.app-header__logo--tp {
    height: 48px;
}

.app-header__logo--vibe {
  position: relative;
    height: 38px;
    top: -5px;
}

.app-header__cross {
  font-family: var(--font-hand);
  font-size: 28px;
  color: var(--color-sky);
}

@media (max-width: 768px) {
  .app-header {
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 16px 20px;
  }

  .app-header__nav {
    display: none;
  }
}
</style>