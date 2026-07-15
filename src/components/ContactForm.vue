<script setup lang="ts">
import { useContactForm, getCountry } from '@/composables/useContactForm'

const { form, errors, status, countries, submit, reset, formattedPhone } = useContactForm()

function onPhoneInput(e: Event) {
  const target = e.target as HTMLInputElement
  // берём из введённого текста только цифры, ограничивая длиной под текущую страну
  const maxDigits = getCountry(form.countryIndex).digits
  const rawDigits = target.value.replace(/\D/g, '').slice(0, maxDigits)
  form.phone = rawDigits
}

async function onSubmit() {
  await submit()
}
function blockNonDigitKeys(e: KeyboardEvent) {
  // разрешаем служебные клавиши (Backspace, Tab, стрелки, Ctrl+V и т.д.)
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return

  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
  }
}
</script>

<template>
  <div class="contact-form">
    <transition name="fade" mode="out-in">
      <div v-if="status === 'success'" key="success" class="contact-form__success">
        <svg class="success-check" viewBox="0 0 52 52">
          <circle class="success-check__circle" cx="26" cy="26" r="24" fill="none" />
          <path class="success-check__mark" fill="none" d="M14 27l7 7 16-16" />
        </svg>
        <p class="contact-form__success-text">Заявка отправлена!</p>
        <p class="contact-form__success-sub">Мы свяжемся с вами в ближайшее время</p>
        <button class="contact-form__again" @click="reset">Оставить ещё одну заявку</button>
      </div>

      <form v-else key="form" class="contact-form__fields" @submit.prevent="onSubmit" novalidate>
        <div class="contact-form__honeypot" aria-hidden="true">
          <label>Website</label>
          <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" />
        </div>

        <div class="contact-form__field">
          <input v-model="form.name" type="text" placeholder="Ваше имя" maxlength="60" required />
          <span v-if="errors.name" class="contact-form__error">{{ errors.name }}</span>
        </div>

        <div class="contact-form__field">
          <input v-model="form.city" type="text" placeholder="Город" maxlength="60" required />
          <span v-if="errors.city" class="contact-form__error">{{ errors.city }}</span>
        </div>

        <div class="contact-form__field">
          <input v-model="form.email" type="email" placeholder="Email" maxlength="254" required />
          <span v-if="errors.email" class="contact-form__error">{{ errors.email }}</span>
        </div>

        <div class="contact-form__field">
          <div class="contact-form__phone">
            <div class="contact-form__select-wrap">
              <select v-model.number="form.countryIndex" class="contact-form__country">
                <option v-for="(country, i) in countries" :key="country.iso" :value="i">
                  {{ country.name }} ({{ country.code }})
                </option>
              </select>
            </div>
            <input
              :value="formattedPhone"
              @input="onPhoneInput"
              type="tel"
              placeholder="Номер телефона"
              inputmode="numeric"
              @keydown="blockNonDigitKeys"
              maxlength="20"
              required
            />
          </div>
          <span v-if="errors.phone" class="contact-form__error">{{ errors.phone }}</span>
        </div>

        <button type="submit" class="contact-form__submit" :disabled="status === 'submitting'">
          {{ status === 'submitting' ? 'Отправляем…' : 'Оставить заявку' }}
        </button>

        <p v-if="status === 'error'" class="contact-form__error contact-form__error--general">
          Не получилось отправить, попробуйте ещё раз
        </p>
      </form>
    </transition>
  </div>
</template>

<style scoped>
.contact-form { max-width: 480px; margin: 0 auto; }

.contact-form__honeypot {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}

.contact-form__fields { display: flex; flex-direction: column; gap: 18px; }
.contact-form__field { display: flex; flex-direction: column; gap: 6px; }

.contact-form input {
  border: 1px solid rgba(58, 73, 104, 0.2);
  border-radius: 12px;
  padding: 14px 16px;
  font-family: var(--font-main);
  font-size: 0.95rem;
  color: var(--color-text);
  background: var(--color-white);
  outline: none;
  transition: border-color 0.2s;
}

.contact-form input:focus { border-color: var(--color-sky); }

.contact-form__phone {
  display: flex;
  gap: 8px;
}

.contact-form__select-wrap {
  position: relative;
  flex: 0 0 150px;
}

.contact-form__select-wrap::after {
  content: '';
  position: absolute;
  right: 14px;
  top: 50%;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--color-text-muted);
  border-bottom: 2px solid var(--color-text-muted);
  transform: translateY(-65%) rotate(45deg);
  pointer-events: none;
  transition: border-color 0.2s;
}

.contact-form__select-wrap:focus-within::after {
  border-color: var(--color-sky);
}

.contact-form__country {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 1px solid rgba(58, 73, 104, 0.2);
  border-radius: 12px;
  padding: 14px 32px 14px 16px;
  font-family: var(--font-main);
  font-size: 0.95rem;
  color: var(--color-text);
  background: var(--color-white);
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.contact-form__country:focus {
  border-color: var(--color-sky);
}

.contact-form__phone input {
  flex: 1;
  min-width: 0;
}

.contact-form__error { color: var(--color-accent); font-size: 0.8rem; }
.contact-form__error--general { text-align: center; margin-top: 4px; }

.contact-form__submit {
  border: none;
  border-radius: 12px;
  padding: 16px;
  background: var(--color-accent);
  color: var(--color-white);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.contact-form__submit:disabled { opacity: 0.6; cursor: default; }
.contact-form__submit:hover:not(:disabled) { opacity: 0.9; }

.contact-form__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 24px 0;
}

.success-check { width: 72px; height: 72px; margin-bottom: 8px; }

.success-check__circle {
  stroke: var(--color-sky);
  stroke-width: 2;
  stroke-dasharray: 151;
  stroke-dashoffset: 151;
  animation: circle-draw 0.5s ease forwards;
}

.success-check__mark {
  stroke: var(--color-accent);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 36;
  stroke-dashoffset: 36;
  animation: mark-draw 0.35s ease forwards 0.4s;
}

@keyframes circle-draw { to { stroke-dashoffset: 0; } }
@keyframes mark-draw { to { stroke-dashoffset: 0; } }

.contact-form__success-text { color: var(--color-text); font-weight: 700; font-size: 1.2rem; }
.contact-form__success-sub { color: var(--color-text-muted); font-size: 0.9rem; }

.contact-form__again {
  margin-top: 12px;
  border: none;
  background: none;
  color: var(--color-sky);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 480px) {
  .contact-form { max-width: 100%; }

  .contact-form__phone {
    flex-direction: column;
  }

  .contact-form__select-wrap {
    flex: 1 1 auto;
    width: 100%;
  }

  .contact-form input,
  .contact-form__country {
    padding: 13px 14px;
    font-size: 0.9rem;
  }

  .contact-form__country {
    padding-right: 32px;
  }

  .contact-form__fields {
    gap: 14px;
  }
}
</style>