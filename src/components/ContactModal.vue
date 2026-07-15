<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import ContactForm from '@/components/ContactForm.vue'

const modal = useModalStore()
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="modal.isOpen" class="modal-overlay" @click.self="modal.close">
        <div class="modal-window">
          <button class="modal-close" @click="modal.close" aria-label="Закрыть">×</button>
          <h3 class="modal-title">Оставить заявку</h3>
          <ContactForm />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 30, 30, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
}

.modal-window {
  position: relative;
  background: var(--color-background);
  border-radius: 24px;
  padding: 40px 32px 48px; /* нижний padding увеличен для отступа под кнопкой */
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.4rem;
  text-align: center;
  margin-bottom: 24px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background: none;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--color-text-muted);
  cursor: pointer;
  z-index: 1;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* планшет */
@media (max-width: 768px) {
  .modal-window {
    padding: 32px 24px 40px;
    border-radius: 20px;
    max-height: 92vh;
  }

  .modal-title {
    font-size: 1.25rem;
    margin-bottom: 20px;
  }
}

/* мобильные */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end; /* модалка "выезжает" снизу — удобнее на телефоне */
  }

  .modal-window {
    max-width: 100%;
    max-height: 88vh;
    border-radius: 20px 20px 0 0;
    padding: 28px 20px 36px;
  }

  .modal-title {
    font-size: 1.15rem;
    margin-bottom: 16px;
  }

  .modal-close {
    top: 12px;
    right: 12px;
    font-size: 1.4rem;
  }
}
</style>