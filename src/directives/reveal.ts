import type { Directive } from 'vue'

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
)

export const vReveal: Directive = {
  mounted(el: HTMLElement, binding) {
    el.classList.add('reveal')
    // v-reveal="100" — задержка в мс, необязательно
    if (typeof binding.value === 'number') {
      el.style.transitionDelay = `${binding.value}ms`
    }
    observer.observe(el)
  },
}