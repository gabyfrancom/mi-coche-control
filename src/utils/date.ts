export function addMonths(iso: string, months: number): Date {
  const d = new Date(iso)
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
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isoMonthsAgo(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString()
}
