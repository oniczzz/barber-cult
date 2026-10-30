import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, ChevronLeft, ChevronRight, Clock3, MapPin, Menu, Plus, Scissors, Star } from 'lucide-react'
import Dialog from './components/Dialog'
import Photo from './components/Photo'
import { faqs, gallery, heroImage, masters, money, reviews, services, type MasterId, type ServiceId } from './data'

const Booking = lazy(() => import('./components/Booking'))
const navigation = [
  { id: 'services', name: 'Услуги' }, { id: 'masters', name: 'Мастера' },
  { id: 'gallery', name: 'Атмосфера' }, { id: 'reviews', name: 'Отзывы' }, { id: 'contacts', name: 'Контакты' },
]
type BookingSelection = { service?: ServiceId; master?: MasterId }
type GalleryFilter = 'all' | 'cuts' | 'space'

export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [booking, setBooking] = useState<BookingSelection | null>(null)
  const [activeSection, setActiveSection] = useState('')
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [info, setInfo] = useState<'project' | 'privacy' | null>(null)
  const review = reviews[reviewIndex]
  const filteredGallery = gallery.map((item, index) => ({ ...item, index })).filter(item => filter === 'all' || item.category === filter)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id) })
    }, { rootMargin: '-15% 0px -55% 0px' })
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); setLightbox(index => index === null ? null : (index + 1) % gallery.length) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setLightbox(index => index === null ? null : (index + gallery.length - 1) % gallery.length) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox])

  function openBooking(selection: BookingSelection = {}) { setMobileMenu(false); setBooking(selection) }
  function navigateMobile(id: string) {
    setMobileMenu(false)
    requestAnimationFrame(() => { document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); history.replaceState(null, '', `#${id}`) })
  }

  return <>
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <div className="demo-bar"><span>НЕЗАВИСИМЫЙ КОНЦЕПТ БАРБЕРШОПА</span><button onClick={() => setInfo('project')}><span className="accent-dot" /> DEMO PROJECT <ArrowUpRight size={12} /></button></div>
    <header className="header">
      <a className="wordmark" href="#home" aria-label="BARBER CULT — на главную">BARBER CULT<span className="brand-dot">™</span></a>
      <nav className="desktop-nav" aria-label="Основная навигация">{navigation.map(link => <a href={`#${link.id}`} key={link.id} className={activeSection === link.id ? 'active' : ''} aria-current={activeSection === link.id ? 'location' : undefined}>{link.name}</a>)}</nav>
      <div className="header-actions"><button className="button button-small button-cream header-book" onClick={() => openBooking()}>Записаться <ArrowUpRight size={15} /></button><button className="icon-button menu-toggle" aria-label="Открыть меню" aria-expanded={mobileMenu} aria-controls="mobile-navigation" onClick={() => setMobileMenu(true)}><Menu size={24} /></button></div>
    </header>
    <main id="main" tabIndex={-1}>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="accent-dot" /> БАРБЕРШОП С ХАРАКТЕРОМ <span className="hero-location">АЛМАТЫ, KZ</span></div>
          <h1 id="hero-title">BARBER<br /><span>CULT<span className="hero-period">.</span></span><span className="sr-only"> — Характер в деталях</span></h1>
          <div className="hero-description"><h2>Характер в деталях.</h2><p>Точная стрижка. Свой стиль. Никакой суеты.<br className="desktop-break" /> Место, где можно быть собой.</p></div>
          <div className="hero-actions"><button className="button button-accent" onClick={() => openBooking()}>Выбрать свой ритуал <ArrowUpRight size={19} /></button><a href="#services" className="text-link">Услуги и цены <ArrowDown size={16} /></a></div>
          <div className="hero-footnote"><span>CRAFT OVER TRENDS.</span><span>ТВОЙ СТИЛЬ. НАШЕ РЕМЕСЛО.</span></div>
        </div>
        <div className="hero-visual">
          <Photo id={heroImage} eager alt="Барбер сосредоточенно стрижёт клиента ножницами в приглушённом свете" sizes="(max-width: 760px) 100vw, 55vw" className="hero-photo" position="50% 46%" />
          <div className="photo-corner"><span className="crosshair">+</span><span>THE ART OF<br />LOOKING YOURSELF.</span></div>
          <div className="hero-photo-caption"><span>01 / ВНИМАНИЕ К КАЖДОЙ ЛИНИИ</span><span>BC—26</span></div>
          <a className="hero-seal" href="#philosophy" aria-label="Философия BARBER CULT"><span>СДЕЛАНО С ХАРАКТЕРОМ</span><Scissors size={31} strokeWidth={1.4} /><span>BARBER CULT · ALMATY</span></a>
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div><span>ЧИСТЫЕ ЛИНИИ</span><Plus /><span>СВОЙ ХАРАКТЕР</span><Plus /><span>ТОЧНАЯ РАБОТА</span><Plus /><span>БЕЗ СУЕТЫ</span><Plus /><span>ЧИСТЫЕ ЛИНИИ</span><Plus /><span>СВОЙ ХАРАКТЕР</span><Plus /></div></div>

      <section className="philosophy section-shell" id="philosophy" aria-labelledby="philosophy-title">
        <div className="section-index"><span className="eyebrow">01 / ФИЛОСОФИЯ</span><Scissors size={25} strokeWidth={1.2} className="accent" /></div>
        <div className="philosophy-content"><h2 id="philosophy-title">Мода меняется.<br /><span className="muted-heading">Характер остаётся.</span></h2><div className="philosophy-bottom"><p>Мы за стрижки, которые идут тебе. За внимание к деталям и разговор по делу. За час, который принадлежит только тебе.</p><p>Без лишнего шума. С уважением к ремеслу.<br /><span className="signature">Это и есть CULT.</span></p></div></div>
      </section>

      <section className="services section-shell" id="services" aria-labelledby="services-title">
        <div className="section-top"><span className="eyebrow">02 / УСЛУГИ И ЦЕНЫ</span><span className="micro muted">КАЖДАЯ ДЕТАЛЬ ИМЕЕТ ЗНАЧЕНИЕ</span></div>
        <div className="services-layout"><div className="services-intro"><h2 className="section-title" id="services-title">Выбери<br />свой <span className="accent">ритуал.</span></h2><p className="muted">От быстрой стрижки до полного обновления. В стоимость уже включены консультация и укладка.</p><div className="service-note"><Clock3 size={18} /><span>Без спешки.<br />Ровно столько времени, сколько нужно.</span></div><span className="micro muted">ДЕМОНСТРАЦИОННЫЕ ЦЕНЫ · KZT</span></div>
          <div className="service-list">{services.map((service, index) => <button className="service-row" key={service.id} onClick={() => openBooking({ service: service.id })} aria-label={`Записаться: ${service.name}, ${money(service.price)}`}>
            <span className="service-number">0{index + 1}</span><span className="service-name"><span className="service-english">{service.english}{'tag' in service && <span className="service-tag">{service.tag}</span>}</span><span className="service-heading">{service.name}</span><span className="service-duration">{service.duration} минут</span></span><span className="service-cost">{money(service.price)}</span><span className="service-arrow"><ArrowUpRight size={22} /></span>
          </button>)}<p className="fine-print service-list-note">Выбери услугу, чтобы попробовать демозапись. Оплата не требуется.</p></div>
        </div>
      </section>

      <section className="masters light-section" id="masters" aria-labelledby="masters-title"><div className="section-shell">
        <div className="section-top"><span className="eyebrow">03 / ЛЮДИ CULT</span><span className="micro">У КАЖДОГО СВОЙ ПОЧЕРК</span></div>
        <div className="section-heading-row"><h2 className="section-title" id="masters-title">Дело в <span className="outline-text">руках.</span></h2><p>Три характера. Один подход к качеству.<br />Найди мастера, с которым на одной волне.</p></div>
        <div className="masters-grid">{masters.map(master => <article className="master-card" key={master.id}>
          <button className="master-portrait" aria-label={`Выбрать мастера ${master.name}`} onClick={() => openBooking({ master: master.id })}><Photo id={master.image} alt={`Иллюстративный портрет персонажа ${master.name}`} position={master.position} sizes="(max-width: 600px) 90vw, 33vw" /><span className="portrait-index">BC / 0{master.number.slice(-1)}</span><span className="portrait-quote">«{master.quote}»</span><span className="portrait-action"><ArrowUpRight size={24} /></span></button>
          <div className="master-title-row"><h3>{master.name}</h3><span>{master.role}</span></div><p className="master-specialty">{master.specialty}</p><button className="master-book" onClick={() => openBooking({ master: master.id })}>Записаться к мастеру <ArrowUpRight size={18} /></button>
        </article>)}</div>
        <p className="section-disclaimer">Команда вымышлена. Стоковые портреты иллюстрируют персонажей и не представляют реальных сотрудников.</p>
      </div></section>

      <section className="gallery-section section-shell" id="gallery" aria-labelledby="gallery-title">
        <div className="section-top"><span className="eyebrow">04 / ВНУТРИ CULT</span><span className="micro muted">МЕНЬШЕ СЛОВ. БОЛЬШЕ АТМОСФЕРЫ.</span></div>
        <div className="section-heading-row"><h2 className="section-title" id="gallery-title">Место. Люди.<br /><span className="accent">Детали.</span></h2><div className="gallery-intro"><p className="muted">Приглушённый свет, любимый плейлист<br className="desktop-break" /> и полная концентрация на тебе.</p><div className="gallery-filters" aria-label="Фильтр галереи">{([{ id: 'all', label: 'Всё' }, { id: 'cuts', label: 'Процесс' }, { id: 'space', label: 'Пространство' }] as const).map(item => <button key={item.id} aria-pressed={filter === item.id} className={filter === item.id ? 'active' : ''} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div></div></div>
        <div className={`gallery-grid ${filter !== 'all' ? 'gallery-filtered' : ''}`}>
          {filteredGallery.map((item, index) => <button className={`gallery-item gallery-item-${index + 1}`} key={item.image} onClick={() => setLightbox(item.index)} aria-label={`Открыть фотографию: ${item.title}`}><Photo id={item.image} alt={item.alt} sizes={index === 0 ? '(max-width: 700px) 100vw, 55vw' : '(max-width: 700px) 50vw, 30vw'} /><span className="gallery-caption"><span>{item.title}</span><Plus size={20} /></span><span className="gallery-index">0{item.index + 1}</span></button>)}
        </div>
        <div className="gallery-bottom"><p className="fine-print">Визуальное настроение концепта. Стоковые фотографии, не реальные работы BARBER CULT.</p><span className="micro" aria-live="polite">{String(filteredGallery.length).padStart(2, '0')} / 05 ФОТОГРАФИЙ</span></div>
      </section>

      <section className="reviews section-shell" id="reviews" aria-labelledby="reviews-title">
        <div className="reviews-label"><span className="eyebrow">05 / ОБРАТНАЯ СВЯЗЬ</span><h2 id="reviews-title">Слово<br />после стрижки.</h2><span className="demo-chip">ДЕМО-ОТЗЫВЫ</span><p className="fine-print">Вымышленные истории для демонстрации интерфейса.</p></div>
        <div className="review-body"><span className="quote-mark" aria-hidden="true">“</span><div className="review-content" aria-live="polite" aria-atomic="true"><div className="review-stars" aria-label="Иллюстративная оценка 5 из 5">{[1, 2, 3, 4, 5].map(star => <Star size={14} fill="currentColor" key={star} />)}</div><blockquote key={reviewIndex}>{review.quote}</blockquote><div className="review-author"><div className="review-avatar" aria-hidden="true">{review.name.charAt(0)}</div><div><p>{review.name}</p><span>{review.service}</span></div><span className="review-scenario">{review.date}</span></div></div><div className="review-controls"><div className="review-dots">{reviews.map((_, index) => <button key={index} aria-label={`Показать демоотзыв ${index + 1}`} aria-pressed={reviewIndex === index} onClick={() => setReviewIndex(index)}><span /></button>)}</div><div className="flex gap-2"><button className="icon-button bordered" aria-label="Предыдущий отзыв" onClick={() => setReviewIndex(index => (index + reviews.length - 1) % reviews.length)}><ArrowLeft size={19} /></button><button className="icon-button bordered" aria-label="Следующий отзыв" onClick={() => setReviewIndex(index => (index + 1) % reviews.length)}><ArrowRight size={19} /></button></div></div></div>
      </section>

      <section className="booking-banner" aria-labelledby="banner-title"><div className="section-shell"><div><span className="eyebrow">ХОРОШИЙ МОМЕНТ ДЛЯ ПЕРЕМЕН</span><h2 id="banner-title">Новый день.<br />Твой <span className="banner-outline">стиль.</span></h2></div><div className="banner-action"><p>Остальное оставь за дверью.<br />В кресле — время для себя.</p><button className="button button-dark" onClick={() => openBooking()}>Выбрать время <ArrowUpRight size={20} /></button><span className="micro">ДЕМОНСТРАЦИОННАЯ ЗАПИСЬ · БЕЗ ОПЛАТЫ</span></div><Scissors className="banner-scissors" size={190} strokeWidth={0.7} aria-hidden="true" /></div></section>

      <section className="faq light-section" id="faq" aria-labelledby="faq-title"><div className="section-shell faq-layout"><div><span className="eyebrow">06 / ПЕРЕД ВИЗИТОМ</span><h2 className="section-title" id="faq-title">Есть<br />вопросы?</h2><p>Хорошая стрижка начинается<br />с понимания.</p></div><div className="faq-list">{faqs.map((faq, index) => <details key={faq.question}><summary><span className="faq-number">0{index + 1}</span><span>{faq.question}</span><Plus size={20} className="faq-plus" /></summary><div className="faq-answer"><p>{faq.answer}</p>{index === 3 && <button className="text-button" onClick={() => openBooking()}>Попробовать демозапись <ArrowUpRight size={16} /></button>}</div></details>)}</div></div></section>

      <section className="contacts section-shell" id="contacts" aria-labelledby="contacts-title">
        <div className="contacts-copy"><span className="eyebrow">07 / НАЙДИ СВОЙ CULT</span><h2 className="section-title" id="contacts-title">Увидимся<br />в <span className="accent">кресле.</span></h2><p className="contacts-lead">В самом ритме Алматы.<br />Чуть в стороне от суеты.</p><div className="contact-detail"><MapPin size={18} /><div><span>Алматы, Казахстан</span><p>Концептуальная локация. Физического адреса нет.</p></div></div><div className="contact-detail"><Clock3 size={18} /><div><span>Ежедневно · 10:00–20:00</span><p>Часы работы в демонстрационном сценарии.</p></div></div><button className="button button-cream" onClick={() => openBooking()}>Попробовать запись <ArrowUpRight size={18} /></button><p className="fine-print contacts-disclaimer">Реальный телефон, адрес и социальные сети<br />не указаны: BARBER CULT — вымышленный бренд.</p></div>
        <div className="contact-art"><Photo id="photo-1585747860715-2ba37e788b70" alt="Классические барберские кресла в интерьере — иллюстрация концепта" sizes="(max-width: 760px) 100vw, 50vw" /><div className="contact-art-overlay"><span className="eyebrow">БУДУЩЕЕ МЕСТО СИЛЫ</span><span className="contact-city">ALMATY.</span><span className="contact-concept"><span className="accent-dot" /> КОНЦЕПТ ПРОСТРАНСТВА / DEMO</span></div><span className="contact-art-corner">43° N / 76° E<br />ГОРОД ВДОХНОВЕНИЯ</span></div>
      </section>
    </main>
    <footer className="footer section-shell"><div className="footer-top"><a href="#home" className="wordmark" aria-label="BARBER CULT — на главную">BARBER CULT<span className="brand-dot">™</span></a><span className="footer-motto">ТВОЙ СТИЛЬ. НАШЕ РЕМЕСЛО.</span><a href="#home" className="back-to-top">Наверх <ArrowUp size={17} /></a></div><div className="footer-links"><nav aria-label="Навигация в подвале">{navigation.map(link => <a key={link.id} href={`#${link.id}`}>{link.name}</a>)}<a href="#faq">FAQ</a></nav><button onClick={() => setInfo('privacy')}>О данных и приватности</button></div><div className="footer-bottom"><span>© {new Date().getFullYear()} BARBER CULT. Концептуальный проект.</span><button className="footer-demo" onClick={() => setInfo('project')}><span className="accent-dot" /> DEMO PROJECT <ArrowUpRight size={13} /></button><span>DESIGNED WITH INTENTION.</span></div><p className="footer-note">Создано для портфолио веб-разработчика. Бренд, услуги, мастера и отзывы вымышлены. Реальные заявки не принимаются.</p></footer>

    {mobileMenu && <Dialog open onClose={() => setMobileMenu(false)} labelledBy="menu-title" className="mobile-menu"><span className="wordmark" id="menu-title">BARBER CULT™</span><nav id="mobile-navigation" aria-label="Мобильная навигация">{[...navigation, { id: 'faq', name: 'Вопросы' }].map((link, index) => <a key={link.id} href={`#${link.id}`} onClick={event => { event.preventDefault(); navigateMobile(link.id) }}><span className="micro">0{index + 1}</span>{link.name}<ArrowUpRight size={23} /></a>)}</nav><button className="button button-accent w-full" onClick={() => openBooking()}>Записаться <ArrowUpRight size={20} /></button><span className="fine-print">DEMO PROJECT · АЛМАТЫ</span></Dialog>}
    {booking !== null && <Suspense fallback={<Dialog open onClose={() => setBooking(null)} labelledBy="loading-title" className="info-modal"><h2 id="loading-title">Открываем запись…</h2></Dialog>}><Booking {...booking} onClose={() => setBooking(null)} /></Suspense>}
    {lightbox !== null && <Dialog open onClose={() => setLightbox(null)} labelledBy="lightbox-title" className="lightbox"><Photo key={gallery[lightbox].image} id={gallery[lightbox].image} alt={gallery[lightbox].alt} eager sizes="90vw" /><div className="lightbox-bottom"><div><h2 id="lightbox-title">{gallery[lightbox].title}</h2><p className="fine-print">Стоковая фотография · Иллюстрация концепта</p></div><div className="lightbox-controls"><button className="icon-button bordered" aria-label="Предыдущая фотография" onClick={() => setLightbox((lightbox + gallery.length - 1) % gallery.length)}><ChevronLeft size={24} /></button><span aria-live="polite">0{lightbox + 1} / 05</span><button className="icon-button bordered" aria-label="Следующая фотография" onClick={() => setLightbox((lightbox + 1) % gallery.length)}><ChevronRight size={24} /></button></div></div></Dialog>}
    {info && <Dialog open onClose={() => setInfo(null)} labelledBy="info-title" className="info-modal"><span className="eyebrow accent">ПРОЗРАЧНО ПО ЗАМЫСЛУ</span><h2 id="info-title">{info === 'project' ? 'Это Demo Project.' : 'Твои данные — у тебя.'}</h2>{info === 'project' ? <><p>BARBER CULT — независимый концепт премиального барбершопа, созданный для портфолио веб-разработчика.</p><p>Бренд, мастера, цены, расписание и отзывы вымышлены. Фотографии с Unsplash иллюстрируют настроение и не представляют реальный салон или его команду.</p><p>Запись работает как интерактивная демонстрация: можно выбрать услугу и мастера, пройти проверку полей и увидеть итог. Настоящие брони и платежи не создаются.</p></> : <><p>Имя, телефон и выбранные параметры хранятся только в памяти этой страницы, пока открыта форма. Они не отправляются на сервер, не попадают в URL и не сохраняются в cookies или localStorage.</p><p>После закрытия формы или обновления страницы эти данные исчезают. Для демонстрации можно использовать вымышленные имя и телефон.</p><p>Фотографии загружаются с images.unsplash.com. Этот внешний сервис получает стандартные технические данные запроса, включая IP-адрес. Поля формы ему не передаются. Аналитики и рекламных трекеров на сайте нет.</p></>}<button className="button button-cream" onClick={() => setInfo(null)}>Понятно <Check size={17} /></button></Dialog>}
  </>
}
