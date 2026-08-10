import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'
import i18n from '../i18/i18'

void i18n.changeLanguage('en')

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

afterEach(() => {
  localStorage.clear()
})
