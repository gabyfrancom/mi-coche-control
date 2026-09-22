import type { MaintenanceRecord, MaintenanceStatus, MaintenanceTypeDef } from '../types'
import { addMonths, differenceInCalendarDays } from './date'

export interface ComputedMaintenance {
  status: MaintenanceStatus
  proximaFecha?: string
  proximaKm?: number
  restanteKm?: number
  restanteDias?: number
  mensaje: string
}

/**
 * Calcula la proxima fecha/km de un mantenimiento y su estado (verde/amarillo/rojo)
 * segun las reglas del brief:
 *  - AMARILLO: quedan menos de 2 meses o menos de 2000 km
 *  - ROJO: mantenimiento vencido (por fecha o por km)
 */
export function computeMaintenance(
  type: MaintenanceTypeDef,
  record: MaintenanceRecord | undefined,
  kmActuales: number,
  hoy: Date = new Date()
): ComputedMaintenance {
  if (!record || (!record.fechaUltimo && !record.kmUltimo && !record.fechaProxima && !record.kmProxima)) {
    return { status: 'verde', mensaje: 'Sin registros todavia' }
  }

  const proximaKm =
    record.kmProxima ?? (record.kmUltimo != null && type.intervaloKm ? record.kmUltimo + type.intervaloKm : undefined)

  const proximaFecha =
    record.fechaProxima ??
    (record.fechaUltimo && type.intervaloMeses ? addMonths(record.fechaUltimo, type.intervaloMeses).toISOString() : undefined)

  const restanteKm = proximaKm != null ? proximaKm - kmActuales : undefined
  const restanteDias = proximaFecha ? differenceInCalendarDays(new Date(proximaFecha), hoy) : undefined

  let status: MaintenanceStatus = 'verde'
  const vencidoPorKm = restanteKm != null && restanteKm <= 0
  const vencidoPorFecha = restanteDias != null && restanteDias <= 0
  const proximoPorKm = restanteKm != null && restanteKm <= 2000
  const proximoPorFecha = restanteDias != null && restanteDias <= 60

  if (vencidoPorKm || vencidoPorFecha) status = 'rojo'
  else if (proximoPorKm || proximoPorFecha) status = 'amarillo'

  let mensaje = 'Al dia'
  if (status === 'rojo') {
    if (vencidoPorFecha && restanteDias != null) mensaje = `Vencido hace ${Math.abs(restanteDias)} dias`
    else if (restanteKm != null) mensaje = `Vencido hace ${Math.abs(restanteKm).toLocaleString('es-ES')} km`
  } else if (status === 'amarillo') {
    if (proximoPorKm && restanteKm != null) mensaje = `Faltan ${restanteKm.toLocaleString('es-ES')} km`
    else if (restanteDias != null) mensaje = `Quedan ${restanteDias} dias`
  } else if (proximaKm != null) {
    mensaje = `Proximo a los ${proximaKm.toLocaleString('es-ES')} km`
  } else if (proximaFecha) {
    mensaje = `Proximo el ${new Date(proximaFecha).toLocaleDateString('es-ES')}`
  }

  return { status, proximaFecha, proximaKm, restanteKm, restanteDias, mensaje }
}

export function statusColor(status: MaintenanceStatus) {
  switch (status) {
    case 'verde':
      return { dot: 'bg-status-green', text: 'text-status-green', bg: 'bg-status-green/15' }
    case 'amarillo':
      return { dot: 'bg-status-yellow', text: 'text-status-yellow', bg: 'bg-status-yellow/15' }
    case 'rojo':
      return { dot: 'bg-status-red', text: 'text-status-red', bg: 'bg-status-red/15' }
  }
}
