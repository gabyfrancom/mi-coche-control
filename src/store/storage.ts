/**
 * Persistencia local (localStorage). No hay backend: todos los datos viven
 * en el dispositivo del usuario.
 */
import type { AppSettings, Expense, Insurance, ItvRecord, KmUpdate, MaintenanceRecord, RoadsideContacts, TireSet, Vehicle } from '../types'

export const KEY = 'mcc:v1'
const BROKEN_KEY = 'mcc:v1:corrupto'
export const SCHEMA_VERSION = 1

export interface AppData {
  schemaVersion?: number
  vehicles: Vehicle[]
  activeVehicleId: string | null
  kmUpdates: KmUpdate[]
  maintenanceRecords: MaintenanceRecord[]
  expenses: Expense[]
  insurances: Insurance[]
  itvRecords: ItvRecord[]
  tireSets: TireSet[]
  roadsideContacts: RoadsideContacts[]
  settings: AppSettings
}

export type LoadResult = { status: 'ok'; data: AppData } | { status: 'empty' } | { status: 'corrupt'; error: string }

/** Validacion minima de forma: evita arrancar con datos a medias. */
export function isAppData(x: unknown): x is AppData {
  const d = x as AppData
  return (
    !!d &&
    typeof d === 'object' &&
    Array.isArray(d.vehicles) &&
    Array.isArray(d.maintenanceRecords) &&
    Array.isArray(d.expenses) &&
    Array.isArray(d.kmUpdates) &&
    typeof d.settings === 'object'
  )
}

export function loadData(): LoadResult {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
    if (!raw) return { status: 'empty' }
    const data = JSON.parse(raw)
    if (!isAppData(data)) throw new Error('Formato de datos no reconocido')
    data.settings.appLockEnabled ??= false
    data.settings.biometricEnabled ??= false
    data.insurances ??= []
    data.itvRecords ??= []
    data.tireSets ??= []
    data.roadsideContacts ??= []
    return { status: 'ok', data }
  } catch (e) {
    // Nunca se pisa: se aparta una copia del contenido roto para poder recuperarlo.
    try {
      if (raw) localStorage.setItem(BROKEN_KEY, raw)
    } catch {}
    return { status: 'corrupt', error: String(e) }
  }
}

/** Devuelve false si no se pudo guardar (almacenamiento lleno o bloqueado). */
export function saveData(data: AppData): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...data, schemaVersion: SCHEMA_VERSION }))
    return true
  } catch {
    return false
  }
}

/** Pide al navegador que no borre los datos por falta de espacio o inactividad. */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persisted && (await navigator.storage.persisted())) return true
    return (await navigator.storage?.persist?.()) ?? false
  } catch {
    return false
  }
}

/** Copia de seguridad completa y restaurable (a diferencia del Excel). */
export function exportBackup(data: AppData) {
  const { appLockPinHash, appLockPinSalt, biometricCredentialId, ...safeSettings } = data.settings
  const backup = { app: 'mi-coche-control', schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), data: { ...data, settings: { ...safeSettings, appLockEnabled: false, biometricEnabled: false } } }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mi-coche-control_copia_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function readBackup(file: File): Promise<AppData> {
  if (file.size > 20 * 1024 * 1024) throw new Error('El archivo es demasiado grande')
  const parsed = JSON.parse(await file.text())
  const data = parsed?.app === 'mi-coche-control' ? parsed.data : parsed
  if (!isAppData(data)) throw new Error('No es una copia valida de Mi Coche Control')
  return data
}
