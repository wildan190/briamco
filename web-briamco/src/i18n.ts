import { ref } from 'vue'
export type Locale = 'en' | 'id'
export function detectLocale(languages: readonly string[], timezone = ''): Locale {
  const preferred = languages[0]?.toLowerCase() || ''
  if (preferred === 'id' || preferred.startsWith('id-') || preferred.endsWith('-id')) return 'id'
  if (['Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Jayapura'].includes(timezone)) return 'id'
  return 'en'
}
function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const requested = new URLSearchParams(window.location.search).get('lang')
  if (requested === 'en' || requested === 'id') return requested
  try { const saved = window.localStorage.getItem('briamco-language'); if (saved === 'en' || saved === 'id') return saved } catch { /* Storage can be disabled. */ }
  return detectLocale(navigator.languages, Intl.DateTimeFormat().resolvedOptions().timeZone)
}
export const locale = ref<Locale>(initialLocale())
export function setLanguage(value: Locale) {
  locale.value = value
  try { window.localStorage.setItem('briamco-language', value) } catch { /* Session still works. */ }
  const url = new URL(window.location.href)
  if (url.searchParams.has('lang')) { url.searchParams.set('lang', value); history.replaceState(history.state, '', url) }
  document.documentElement.lang = value
}
if (typeof document !== 'undefined') document.documentElement.lang = locale.value
const messages: Record<string, string> = {
  'About BRIAMCO':'Tentang BRIAMCO', 'Our Services':'Layanan Kami', 'Contact BRIAMCO':'Hubungi BRIAMCO', 'All Services':'Semua Layanan',
  'Home':'Beranda', 'About':'Tentang Kami', 'Services':'Layanan', 'Solutions':'Solusi', 'Contact':'Kontak', 'Service':'Layanan', 'Insight':'Wawasan', 'News':'Berita', 'Blog':'Blog',
  'Company':'Perusahaan', 'Explore':'Jelajahi', 'All Insights':'Semua Wawasan', 'All News':'Semua Berita', 'All Blog Articles':'Semua Artikel Blog',
  'News & Insights':'Berita & Wawasan', 'Perspectives on business, change and leadership, alongside updates from BRIAMCO.':'Perspektif tentang bisnis, perubahan, dan kepemimpinan, serta berita terbaru dari BRIAMCO.',
  'Loading insights…':'Memuat wawasan…', 'Loading article…':'Memuat artikel…', 'Loading service…':'Memuat layanan…', 'Try again':'Coba lagi',
  'Article not found':'Artikel tidak ditemukan', 'Service not found':'Layanan tidak ditemukan', 'Page not found':'Halaman tidak ditemukan',
  'The page you requested could not be found.':'Halaman yang Anda minta tidak ditemukan.', 'Back to Home':'Kembali ke Beranda',
  'How We Can Help':'Bagaimana Kami Dapat Membantu', 'Discuss Your Priorities':'Diskusikan Prioritas Anda',
  'Previous':'Sebelumnya', 'Next':'Berikutnya', 'Page':'Halaman', 'of':'dari', 'No articles published yet.':'Belum ada artikel yang diterbitkan.',
  'See all blog posts':'Lihat semua artikel', 'Read article':'Baca artikel', 'Sending...':'Mengirim...', 'Submit Request':'Kirim Permintaan',
  'Request reference':'Nomor Permintaan',
  'Valued Partner':'Mitra Kami', 'Content unavailable.':'Konten tidak tersedia.', 'This page could not be found.':'Halaman ini tidak ditemukan.',
  'Content could not be loaded. Please try again.':'Konten tidak dapat dimuat. Silakan coba lagi.',
  'Your request could not be saved. Please try again.':'Permintaan Anda tidak dapat disimpan. Silakan coba lagi.',
}
export function t(text: string): string { return locale.value === 'id' ? messages[text] || text : text }
