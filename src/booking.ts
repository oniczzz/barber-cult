import { services, type ServiceId, type MasterId } from './data.ts'

export const times = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '18:30']
export function dateInAlmaty(offset = 0) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Almaty', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  const date = new Date(`${today}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}
export function prettyDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', weekday: 'short', timeZone: 'Asia/Almaty' }).format(new Date(`${value}T12:00:00Z`))
}
export type BookingDraft = { service: ServiceId; master: MasterId; date: string; time: string; name: string; phone: string; consent: boolean }
export type BookingErrors = Partial<Record<keyof BookingDraft, string>>
export const newDraft = (service: ServiceId = 'cut', master: MasterId = 'any'): BookingDraft => ({ service, master, date: dateInAlmaty(1), time: '', name: '', phone: '', consent: false })

export function validateSchedule(draft: BookingDraft): BookingErrors {
  const errors: BookingErrors = {}
  if (!services.some(s => s.id === draft.service)) errors.service = 'Выберите услугу.'
  const parsedDate = new Date(`${draft.date}T12:00:00Z`)
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(draft.date) && !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === draft.date
  if (!validDate || draft.date < dateInAlmaty(1) || draft.date > dateInAlmaty(30)) errors.date = 'Выберите дату от завтрашнего дня до 30 дней вперёд.'
  if (!times.includes(draft.time)) errors.time = 'Выберите удобное время.'
  return errors
}
export function validateContact(draft: BookingDraft): BookingErrors {
  const errors: BookingErrors = {}
  if (!/^[\p{L}][\p{L}\p{M} '\-]{1,59}$/u.test(draft.name.trim())) errors.name = 'Укажите имя: от 2 до 60 символов, без цифр.'
  const phone = draft.phone.replace(/\D/g, '')
  if (!/^\+?[\d\s()-]+$/.test(draft.phone.trim()) || !/^[78]\d{10}$/.test(phone)) errors.phone = 'Введите 11 цифр: +7 и десять цифр номера.'
  if (!draft.consent) errors.consent = 'Подтвердите, что понимаете демонстрационный характер записи.'
  return errors
}
