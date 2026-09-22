import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { MAINTENANCE_TYPES } from './maintenanceTypes'
import { computeMaintenance, type ComputedMaintenance } from './status'
import type { MaintenanceRecord, MaintenanceTypeDef } from '../types'

export interface MaintenanceRow {
  type: MaintenanceTypeDef
  record?: MaintenanceRecord
  computed: ComputedMaintenance
}

export function useVehicleMaintenance() {
  const { data, activeVehicle } = useApp()

  const rows: MaintenanceRow[] = useMemo(() => {
    if (!activeVehicle) return []
    return MAINTENANCE_TYPES.map((type) => {
      const record = data.maintenanceRecords.find((r) => r.vehicleId === activeVehicle.id && r.typeId === type.id)
      const computed = computeMaintenance(type, record, activeVehicle.kmActuales)
      return { type, record, computed }
    })
  }, [data.maintenanceRecords, activeVehicle])

  const counts = useMemo(
    () => ({
      verde: rows.filter((r) => r.computed.status === 'verde').length,
      amarillo: rows.filter((r) => r.computed.status === 'amarillo').length,
      rojo: rows.filter((r) => r.computed.status === 'rojo').length
    }),
    [rows]
  )

  const proximos = useMemo(
    () =>
      rows
        .filter((r) => r.computed.status !== 'verde')
        .sort((a, b) => {
          if (a.computed.status !== b.computed.status) return a.computed.status === 'rojo' ? -1 : 1
          return (a.computed.restanteKm ?? a.computed.restanteDias ?? 0) - (b.computed.restanteKm ?? b.computed.restanteDias ?? 0)
        }),
    [rows]
  )

  return { rows, counts, proximos }
}
