export type FuelType = 'gasolina' | 'diesel' | 'hibrido' | 'electrico' | 'glp'

export interface Vehicle {
  id: string
  marca: string
  modelo: string
  version: string
  anio: number
  matricula: string
  vin: string
  combustible: FuelType
  potenciaCV: number
  kmActuales: number
  fechaCompra: string // ISO date
  kmCompra: number
  fotoUrl?: string
}

export interface KmUpdate {
  id: string
  vehicleId: string
  fecha: string // ISO date
  km: number
}

export type MaintenanceStatus = 'verde' | 'amarillo' | 'rojo'

export interface MaintenanceTypeDef {
  id: string
  nombre: string
  icono: string
  intervaloKm?: number
  intervaloMeses?: number
  categoria: 'motor' | 'frenos' | 'neumaticos' | 'legal' | 'confort'
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  typeId: string
  fechaUltimo?: string // ISO date
  kmUltimo?: number
  fechaProxima?: string // ISO date, override; if absent computed from intervalo
  kmProxima?: number
  coste?: number
  taller?: string
  facturaNombre?: string
  notas?: string
  marcaProducto?: string
  especificaciones?: string
}

export interface Expense {
  id: string
  vehicleId: string
  categoria: 'combustible' | 'revision' | 'neumaticos' | 'seguro' | 'itv' | 'reparacion' | 'lavado' | 'impuesto' | 'otro'
  concepto: string
  importe: number
  fecha: string // ISO date
}

export interface Insurance {
  vehicleId: string
  compania: string
  numPoliza: string
  fechaInicio: string
  fechaVencimiento: string
  coberturas: string
  franquicia: number
  telefono: string
}

export interface ItvRecord {
  id: string
  vehicleId: string
  fecha: string
  resultado: 'apta' | 'desfavorable' | 'negativa'
  proximaFecha: string
  centro: string
}

export interface TireSet {
  vehicleId: string
  marca: string
  modelo: string
  medidas: string
  fechaInstalacion: string
  kmInstalacion: number
  vidaUtilKm: number
}

export interface RoadsideContacts {
  vehicleId: string
  telefonoGrua: string
  telefonoAsistencia: string
  telefonoSeguro: string
  tallerHabitual: string
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system'
  notifPush: boolean
  notifEmail: boolean
  notifSms: boolean
  appLockEnabled: boolean
  appLockPinHash?: string
  appLockPinSalt?: string
  biometricEnabled: boolean
  biometricCredentialId?: string
}
