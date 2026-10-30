import { useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCheck, Clock3, Scissors } from 'lucide-react'
import Dialog from './Dialog'
import { masters, money, services, type MasterId, type ServiceId } from '../data'
import { dateInAlmaty, newDraft, prettyDate, times, validateContact, validateSchedule, type BookingDraft, type BookingErrors } from '../booking'

type Props = { service?: ServiceId; master?: MasterId; onClose: () => void }
export default function Booking({ service, master, onClose }: Props) {
  const [draft, setDraft] = useState(() => newDraft(service, master))
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [errors, setErrors] = useState<BookingErrors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const selectedService = services.find(item => item.id === draft.service)!
  const selectedMaster = masters.find(item => item.id === draft.master)?.name ?? 'Любой мастер'

  function update<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
    setDraft(previous => ({ ...previous, [key]: value }))
    setErrors(previous => ({ ...previous, [key]: undefined }))
  }
  function goTo(next: 1 | 2 | 3) {
    setStep(next)
    setErrors({})
    requestAnimationFrame(() => {
      titleRef.current?.focus({ preventScroll: true })
      titleRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    })
  }
  function submit(event: FormEvent) {
    event.preventDefault()
    const scheduleErrors = validateSchedule(draft)
    const nextErrors = step === 1 ? scheduleErrors : { ...scheduleErrors, ...validateContact(draft) }
    if (Object.keys(nextErrors).length) {
      if (step === 2 && Object.keys(scheduleErrors).length) setStep(1)
      setErrors(nextErrors)
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    goTo(step === 1 ? 2 : 3)
  }
  const error = (key: keyof BookingDraft) => errors[key] ? <span className="field-error" id={`error-${key}`} role="alert">{errors[key]}</span> : null

  return <Dialog open onClose={onClose} labelledBy="booking-title" className="booking-modal">
    <div className="booking-top"><span className="eyebrow"><span className="accent-dot" /> DEMO BOOKING</span><span className="micro">BARBER CULT™</span></div>
    <div className="booking-layout">
      <div className="booking-main">
        <p className="eyebrow muted mb-4">{step === 3 ? 'РЕЗУЛЬТАТ ДЕМОНСТРАЦИИ' : `ШАГ 0${step} / 02`}</p>
        <h2 id="booking-title" ref={titleRef} tabIndex={-1} className="dialog-title">{step === 1 ? <>Твоё время.<br />Твой ритуал.</> : step === 2 ? <>Познакомимся<br />поближе.</> : <>Отличный<br /><span className="accent">выбор.</span></>}</h2>
        {step === 3 ? <div className="confirmation">
          <div className="success-mark"><CheckCheck size={28} /></div>
          <h3>{draft.name.trim()}, демозапись готова.</h3>
          <p>Это пример подтверждения. <strong>Реальная бронь не создана.</strong> Данные никуда не отправлены, звонка или SMS не будет.</p>
          <dl className="confirmation-summary">
            <div><dt>Услуга</dt><dd>{selectedService.name}</dd></div>
            <div><dt>Мастер</dt><dd>{selectedMaster}</dd></div>
            <div><dt>Когда</dt><dd>{prettyDate(draft.date)}, {draft.time}</dd></div>
            <div><dt>Стоимость в демо</dt><dd>{money(selectedService.price)}</dd></div>
          </dl>
          <button className="button button-accent w-full" onClick={onClose}>Вернуться на сайт <ArrowRight size={18} /></button>
          <p className="fine-print">После закрытия окна введённые данные будут удалены.</p>
        </div> : <form ref={formRef} onSubmit={submit} noValidate>
          {step === 1 ? <div className="form-fields">
            <div className="field"><label htmlFor="service">Услуга</label>
              <select id="service" value={draft.service} onChange={e => update('service', e.target.value as ServiceId)} aria-invalid={!!errors.service} aria-describedby={errors.service ? 'error-service' : undefined}>
                {services.map(item => <option key={item.id} value={item.id}>{item.name} — {money(item.price)}</option>)}
              </select>{error('service')}
            </div>
            <fieldset className="master-field"><legend>Мастер</legend><div className="master-options">
              <label className={draft.master === 'any' ? 'master-option selected' : 'master-option'}><input type="radio" name="master" value="any" checked={draft.master === 'any'} onChange={() => update('master', 'any')} /><Scissors size={21} /><span>Любой</span>{draft.master === 'any' && <Check className="selection-check" size={12} />}</label>
              {masters.map(item => <label key={item.id} className={draft.master === item.id ? 'master-option selected' : 'master-option'}><input type="radio" name="master" value={item.id} checked={draft.master === item.id} onChange={() => update('master', item.id)} /><span className="master-initial">{item.name.charAt(0)}</span><span>{item.name}</span>{draft.master === item.id && <Check className="selection-check" size={12} />}</label>)}
            </div></fieldset>
            <div className="field"><label htmlFor="date">Дата <span className="muted">· Алматы, UTC+5</span></label><input id="date" type="date" required value={draft.date} min={dateInAlmaty(1)} max={dateInAlmaty(30)} onChange={e => update('date', e.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'error-date' : 'date-hint'} />{error('date')}<span id="date-hint" className="fine-print">Ближайшие 30 дней, начиная с завтра.</span></div>
            <fieldset className="time-field"><legend>Время <span className="muted">· демонстрационные слоты</span></legend><div className="time-options">
              {times.map(time => <label className={draft.time === time ? 'time-option selected' : 'time-option'} key={time}><input type="radio" name="time" value={time} checked={draft.time === time} onChange={() => update('time', time)} aria-invalid={!!errors.time} aria-describedby={errors.time ? 'error-time' : undefined} />{time}</label>)}
            </div>{error('time')}</fieldset>
            <button className="button button-accent w-full" type="submit">Продолжить <ArrowRight size={18} /></button>
          </div> : <div className="form-fields">
            <p className="form-intro">Можно использовать вымышленные данные. Это демонстрация интерфейса записи.</p>
            <div className="field"><label htmlFor="name">Как к тебе обращаться <span aria-hidden="true">*</span></label><input id="name" name="name" autoComplete="off" placeholder="Твоё имя" maxLength={60} required value={draft.name} onChange={e => update('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'error-name' : undefined} />{error('name')}</div>
            <div className="field"><label htmlFor="phone">Телефон <span aria-hidden="true">*</span></label><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="off" placeholder="+7 (___) ___-__-__" maxLength={22} required value={draft.phone} onChange={e => update('phone', e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'error-phone' : 'phone-hint'} />{error('phone')}<span className="fine-print" id="phone-hint">Только для проверки формата. Звонков и сообщений не будет.</span></div>
            <div><label className="consent"><input id="consent" type="checkbox" checked={draft.consent} onChange={e => update('consent', e.target.checked)} required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'error-consent' : undefined} /><span>Я понимаю, что это демозапись. Настоящая бронь не создаётся, данные не отправляются.</span></label>{error('consent')}</div>
            <button className="button button-accent w-full" type="submit">Создать демозапись <ArrowRight size={18} /></button>
            <button className="text-button back-button" type="button" onClick={() => goTo(1)}><ArrowLeft size={16} /> Изменить выбор</button>
          </div>}
        </form>}
      </div>
      <aside className="booking-aside" aria-label="Ваш выбор">
        <Scissors size={34} strokeWidth={1} className="accent" />
        <span className="eyebrow mt-8">ТВОЙ РИТУАЛ</span><h3>{selectedService.name}</h3><p className="muted">{selectedService.description}</p>
        <div className="booking-price">{money(selectedService.price)}<span><Clock3 size={14} /> {selectedService.duration} мин</span></div>
        <dl className="booking-details"><div><dt>Мастер</dt><dd>{selectedMaster}</dd></div><div><dt>Дата</dt><dd>{draft.date && !Number.isNaN(Date.parse(draft.date)) ? prettyDate(draft.date) : 'Не выбрана'}</dd></div><div><dt>Время</dt><dd>{draft.time || 'Выбери время'}</dd></div></dl>
        <p className="demo-notice"><span className="accent-dot" /><span>Demo Project<br /><span className="muted">Всё происходит только в твоём браузере.</span></span></p>
      </aside>
    </div>
  </Dialog>
}
