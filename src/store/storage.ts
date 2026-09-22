/**
 * Persistencia local (localStorage). No hay backend: todos los datos viven
 * en el dispositivo del usuario. Es sencillo migrar esto a llamadas HTTP
 * el dia que se agregue una API (ver README).
 */
const KEY = 'mcc:v1'

export interface AppData {
  vehicles: import('../types').Vehicle[]
  activeVehicleId: string | null
  kmUpdates: import('../types').KmUpdate[]
  maintenanceRecords: import('../types').MaintenanceRecord[]
  expenses: import('../types').Expense[]
  insurances: import('../types').Insurance[]
  itvRecords: import('../types').ItvRecord[]
  tireSets: import('../types').TireSet[]
  roadsideContacts: import('../types').RoadsideContacts[]
  settings: import('../types').AppSettings
}

export function loadData(): AppData | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as AppData
    // Migracion suave: usuarios con datos guardados antes de agregar el
    // bloqueo de app no tienen estos campos todavia.
    if (data.settings) {
      if (data.settings.appLockEnabled === undefined) data.settings.appLockEnabled = false
      if (data.settings.biometricEnabled === undefined) data.settings.biometricEnabled = false
    }
    return data
  } catch {
    return null
  }
}

export function saveData(data: AppData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // almacenamiento lleno o no disponible: se ignora, la app sigue en memoria
  }
}
