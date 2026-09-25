import type { Expense } from '../types'
import { parseDate } from './date'

export function totalThisYear(expenses: Expense[]): number {
  const year = new Date().getFullYear()
  return expenses.filter((e) => parseDate(e.fecha).getFullYear() === year).reduce((sum, e) => sum + e.importe, 0)
}

export function costPerKm(expenses: Expense[], kmRecorridos: number): number {
  if (kmRecorridos <= 0) return 0
  return totalThisYear(expenses) / kmRecorridos
}

/** Ultimos N meses -> total gastado, para el mini grafico de barras. */
export function lastMonths(expenses: Expense[], n = 6): { label: string; total: number }[] {
  const now = new Date()
  const buckets: { label: string; total: number; y: number; m: number }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({ label: d.toLocaleDateString('es-ES', { month: 'short' }), total: 0, y: d.getFullYear(), m: d.getMonth() })
  }
  for (const e of expenses) {
    const d = parseDate(e.fecha)
    const bucket = buckets.find((b) => b.y === d.getFullYear() && b.m === d.getMonth())
    if (bucket) bucket.total += e.importe
  }
  return buckets.map(({ label, total }) => ({ label, total }))
}

export const CATEGORY_LABELS: Record<Expense['categoria'], string> = {
  combustible: 'Combustible',
  revision: 'Revision',
  neumaticos: 'Neumaticos',
  seguro: 'Seguro',
  itv: 'ITV',
  reparacion: 'Reparacion',
  lavado: 'Lavado',
  impuesto: 'Impuesto',
  otro: 'Otro'
}
