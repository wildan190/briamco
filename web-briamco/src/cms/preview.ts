import { locale } from '../i18n'
// Preview credentials stay in this tab and never enter public API requests.
const key = 'briamco-cms-preview'
export function previewToken(): string {
  if (typeof window === 'undefined') return ''
  try {
    const url = new URL(window.location.href)
    const incoming = url.searchParams.get('preview')
    if (incoming) {
      window.sessionStorage.setItem(key, incoming)
      url.searchParams.delete('preview')
      history.replaceState(history.state, '', url)
    }
    return window.sessionStorage.getItem(key) || ''
  } catch { return '' }
}
export function contentUrl(url: string): string {
  const token = previewToken()
  const target = new URL(url, window.location.origin)
  target.searchParams.set('locale', locale.value)
  if (!token) return target.href
  target.searchParams.set('preview', token)
  return target.href
}
export function exitPreview() {
  window.sessionStorage.removeItem(key)
  window.location.reload()
}
