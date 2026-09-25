const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Interpreta una fecha guardada. Las fechas sin hora ('AAAA-MM-DD', las de los
 * <input type="date">) se leen como mediodia LOCAL: new Date('AAAA-MM-DD') las
 * toma como medianoche UTC y en America muestra el dia anterior.
 */
export function parseDate(value: string): Date {
  if (DATE_ONLY.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d, 12)
  }
  return new Date(value)
}

/** Valor de un <input type="date"> -> ISO a mediodia local (mismo dia en cualquier zona). */
export function dateInputToIso(ymd: string): string {
  return parseDate(ymd).toISOString()
}

/** Fecha guardada -> 'AAAA-MM-DD' local, para rellenar un <input type="date">. */
export function toDateInput(value?: string): string {
  if (!value) return ''
  const d = parseDate(value)
  if (Number.isNaN(d.getTime())) return ''
  return localYmd(d)
}

function localYmd(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function addMonths(iso: string, months: number): Date {
  const d = parseDate(iso)
  d.setMonth(d.getMonth() + months)
  return d
}

export function differenceInCalendarDays(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((utcA - utcB) / 86400000)
}

export function formatDate(iso?: string): string {
  if (!iso) return '-'
  return parseDate(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Hoy en la zona horaria del dispositivo ('AAAA-MM-DD'), no en UTC. */
export function todayIso(): string {
  return localYmd(new Date())
}

export function isoMonthsAgo(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString()
}
