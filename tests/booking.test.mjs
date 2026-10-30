import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dateInAlmaty, newDraft, prettyDate, validateContact, validateSchedule } from '../src/booking.ts'

const validContact = () => ({ ...newDraft(), name: 'Демо Гость', phone: '+7 (000) 000-00-00', consent: true })

test('new booking starts tomorrow, without selected time or personal data', () => {
  const draft = newDraft('combo', 'mark')
  assert.equal(draft.service, 'combo')
  assert.equal(draft.master, 'mark')
  assert.equal(draft.date, dateInAlmaty(1))
  assert.equal(draft.name, '')
  assert.equal(draft.phone, '')
  assert.equal(draft.time, '')
  assert.equal(draft.consent, false)
})

test('time is required and outside dates cannot be booked', () => {
  assert.ok(validateSchedule(newDraft()).time)
  assert.deepEqual(validateSchedule({ ...newDraft(), time: '13:00' }), {})
  for (const date of ['', 'not-a-date', dateInAlmaty(0), dateInAlmaty(31), '2026-99-99']) {
    assert.ok(validateSchedule({ ...newDraft(), date, time: '13:00' }).date, date)
  }
  assert.ok(validateSchedule({ ...newDraft(), time: '23:00' }).time)
  assert.deepEqual(validateSchedule({ ...newDraft(), date: dateInAlmaty(30), time: '18:30' }), {})
})

test('names allow Cyrillic, Kazakh, Latin and hyphens; reject digits and blanks', () => {
  for (const name of ['Арман', 'Әлібек', 'Jean-Luc', "O'Neil", ' Анна Мария ']) {
    assert.equal(validateContact({ ...validContact(), name }).name, undefined)
  }
  for (const name of ['', ' ', 'A', '1234', 'Иван7', '<script>', 'а'.repeat(61)]) {
    assert.ok(validateContact({ ...validContact(), name }).name, name)
  }
})

test('phone accepts a complete +7 or domestic 8 format and rejects malformed values', () => {
  for (const phone of ['+7 (000) 000-00-00', '70000000000', '8 000 000 00 00']) {
    assert.equal(validateContact({ ...validContact(), phone }).phone, undefined)
  }
  for (const phone of ['', '123', '+1 234 567 8901', '+7 000 000 00', '+7 000 000 00 000', 'abc70000000000', '7+0000000000']) {
    assert.ok(validateContact({ ...validContact(), phone }).phone, phone)
  }
})

test('demo acknowledgement is required', () => {
  assert.ok(validateContact({ ...validContact(), consent: false }).consent)
  assert.deepEqual(validateContact(validContact()), {})
})

test('date labels are localized and stable', () => {
  assert.match(dateInAlmaty(), /^\d{4}-\d{2}-\d{2}$/)
  assert.match(prettyDate('2026-11-01'), /1 ноября/)
})
