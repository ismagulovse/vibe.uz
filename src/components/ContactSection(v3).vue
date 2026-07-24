<script setup lang="ts">
import ContactForm from '@/components/ContactForm.vue'
</script>

<template>
  <section id="section-6" class="contact">
    <h2 class="contact__title">Как оставить заявку?</h2>

    <div class="contact__steps">
      <div class="contact__step">
        <span class="contact__step-num">1</span>
        <p>Заполните форму ниже</p>
      </div>
      <div class="contact__step">
        <span class="contact__step-num">2</span>
        <p>Нажмите «Оставить заявку»</p>
      </div>
      <div class="contact__step">
        <span class="contact__step-num">3</span>
        <p>Мы свяжемся с вами и ответим на все вопросы</p>
      </div>
    </div>

    <ContactForm />
  </section>
</template>

<style scoped>
.contact { padding: 80px 40px; text-align: center; }
.contact__title { color: var(--color-text); font-weight: 700; font-size: 2.2rem; margin-bottom: 40px; }
.contact__steps { display: flex; justify-content: center; gap: 32px; margin-bottom: 48px; flex-wrap: wrap; }
.contact__step { display: flex; flex-direction: column; align-items: center; gap: 10px; max-width: 200px; }
.contact__step-num {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--color-sky); color: var(--color-white);
  display: flex; align-items: center; justify-content: center; font-weight: 700;
}
.contact__step p { color: var(--color-text-muted); font-size: 0.9rem; }
</style>