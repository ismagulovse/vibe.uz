import { reactive, ref, computed } from 'vue'

export interface Country {
  name: string
  code: string   // код страны, напр. '+998'
  iso: string
  digits: number // сколько цифр должно быть после кода
  groups: number[] // на какие группы разбивать цифры при отображении, напр. [2,3,2,2]
}

export const countries: Country[] = [
  { name: 'Россия', code: '+7', iso: 'RU', digits: 10, groups: [3, 3, 2, 2] },
  { name: 'Узбекистан', code: '+998', iso: 'UZ', digits: 9, groups: [2, 3, 2, 2] },
  { name: 'Казахстан', code: '+7', iso: 'KZ', digits: 10, groups: [3, 3, 2, 2] },
  { name: 'Кыргызстан', code: '+996', iso: 'KG', digits: 9, groups: [3, 2, 2, 2] },
  { name: 'Таджикистан', code: '+992', iso: 'TJ', digits: 9, groups: [3, 2, 2, 2] },
  { name: 'Туркменистан', code: '+993', iso: 'TM', digits: 8, groups: [2, 2, 2, 2] },
  { name: 'Украина', code: '+380', iso: 'UA', digits: 9, groups: [2, 3, 2, 2] },
  { name: 'Беларусь', code: '+375', iso: 'BY', digits: 9, groups: [2, 3, 2, 2] },
]
export function getCountry(index: number): Country {
  return countries[index] ?? countries[0]!
} 

// ЗАМЕНИТЕ на вашу ссылку из Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFAiax0NMI1vHbMFoVp3dDKnr3WOQWDZJnOoV3vhuzfgg-_5NhrNtzGKRLVDL14Kd/exec'

const NAME_RE = /^[A-Za-zА-Яа-яЁё\s'-]{2,60}$/
const CITY_RE = /^[A-Za-zА-Яа-яЁё\s'-]{2,60}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// защита от формул-инъекций (если значение начинается с =, +, -, @ — Google Sheets
// может воспринять его как формулу; префикс апострофом нейтрализует это)
function sanitizeForSheet(value: string): string {
  const trimmed = value.trim()
  return /^[=+\-@]/.test(trimmed) ? `'${trimmed}` : trimmed
}

function collapseSpaces(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function formatPhoneDigits(digits: string, groups: number[]): string {
  const parts: string[] = []
  let pos = 0
  for (const size of groups) {
    if (pos >= digits.length) break
    parts.push(digits.slice(pos, pos + size))
    pos += size
  }
  return parts.join(' ')
}

export function useContactForm() {
  const mountedAt = Date.now() // для проверки "слишком быстрой" отправки ботом

  const form = reactive({
    name: '',
    city: '',
    email: '',
    phone: '',
    countryIndex: 0,
    website: '', // honeypot-поле, обычным людям не видно
  })

  const errors = reactive({
    name: '',
    city: '',
    email: '',
    phone: '',
  })

  const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')

const formattedPhone = computed(() =>
  formatPhoneDigits(form.phone, getCountry(form.countryIndex).groups)
)

  function validate(): boolean {
    errors.name = ''
    errors.city = ''
    errors.email = ''
    errors.phone = ''

    const name = collapseSpaces(form.name)
    if (!NAME_RE.test(name)) {
      errors.name = 'Введите имя (только буквы, 2–60 символов)'
    }

    const city = collapseSpaces(form.city)
    if (!CITY_RE.test(city)) {
      errors.city = 'Введите город (только буквы, 2–60 символов)'
    }

    const email = form.email.trim()
    if (!EMAIL_RE.test(email) || email.length > 254) {
      errors.email = 'Введите корректный email'
    }

    const country = getCountry(form.countryIndex)
  const digitsOnly = form.phone.replace(/\D/g, '')

    if (digitsOnly.length !== country.digits) {
      errors.phone = `Номер для ${country.name} должен содержать ${country.digits} цифр`
    }
    return !errors.name && !errors.city && !errors.email && !errors.phone
  }

  async function submit(): Promise<boolean> {
    // honeypot: если скрытое поле заполнено — это бот; тихо "успех", ничего не шлём
    if (form.website.trim() !== '') {
      status.value = 'success'
      return true
    }

    // слишком быстрая отправка — тоже признак бота (человеку нужно время на заполнение)
    if (Date.now() - mountedAt < 2000) {
      status.value = 'success'
      return true
    }

    if (!validate()) {
      status.value = 'error'
      return false
    }

    status.value = 'submitting'

   const country = getCountry(form.countryIndex)
    const digitsOnly = form.phone.replace(/\D/g, '')

    const payload = {
      name: sanitizeForSheet(collapseSpaces(form.name)),
      city: sanitizeForSheet(collapseSpaces(form.city)),
      email: sanitizeForSheet(form.email.trim()),
      phone: sanitizeForSheet(`${country.code}${digitsOnly}`),
      date: new Date().toISOString(),
    }

    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain' }, // иначе Apps Script ругается на CORS
      })
      if (!res.ok) throw new Error('bad response')
      await res.json()
      status.value = 'success'
      return true
    } catch {
      status.value = 'error'
      return false
    }
  }

  function reset() {
    form.name = ''
    form.city = ''
    form.email = ''
    form.phone = ''
    form.countryIndex = 0
    form.website = ''
    status.value = 'idle'
  }

  return { form, errors, status, countries, submit, reset, validate, formattedPhone }
}