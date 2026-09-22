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
    return JSON.parse(raw) as AppData
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
