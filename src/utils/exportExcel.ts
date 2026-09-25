import * as XLSX from 'xlsx'
import type { AppData } from '../store/storage'
import { getMaintenanceType } from './maintenanceTypes'
import { toDateInput } from './date'

/**
 * Exporta todos los datos del vehiculo activo (y generales de la app) a un
 * archivo Excel con varias hojas. Todo se genera en el navegador, sin
 * backend: XLSX.writeFile dispara la descarga directamente.
 */
export function exportToExcel(data: AppData, vehicleId: string | null) {
  const vehicle = data.vehicles.find((v) => v.id === vehicleId) ?? data.vehicles[0]
  const wb = XLSX.utils.book_new()

  if (vehicle) {
    const vehicleSheet = XLSX.utils.json_to_sheet([
      {
        Marca: vehicle.marca,
        Modelo: vehicle.modelo,
        Version: vehicle.version,
        Anio: vehicle.anio,
        Matricula: vehicle.matricula,
        VIN: vehicle.vin,
        Combustible: vehicle.combustible,
        'Potencia (CV)': vehicle.potenciaCV,
        'Km actuales': vehicle.kmActuales,
        'Fecha de compra': toDateInput(vehicle.fechaCompra),
        'Km de compra': vehicle.kmCompra
      }
    ])
    XLSX.utils.book_append_sheet(wb, vehicleSheet, 'Vehiculo')

    const maint = data.maintenanceRecords
      .filter((r) => r.vehicleId === vehicle.id)
      .map((r) => {
        const type = getMaintenanceType(r.typeId)
        return {
          Mantenimiento: type?.nombre ?? r.typeId,
          'Ultima fecha': toDateInput(r.fechaUltimo),
          'Ultimo km': r.kmUltimo ?? '',
          'Proxima fecha': toDateInput(r.fechaProxima),
          'Proximo km': r.kmProxima ?? '',
          Coste: r.coste ?? '',
          Taller: r.taller ?? '',
          'Marca del producto': r.marcaProducto ?? '',
          Especificaciones: r.especificaciones ?? '',
          Notas: r.notas ?? ''
        }
      })
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(maint), 'Mantenimientos')

    const expenses = data.expenses
      .filter((e) => e.vehicleId === vehicle.id)
      .map((e) => ({ Fecha: toDateInput(e.fecha), Categoria: e.categoria, Concepto: e.concepto, Importe: e.importe }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expenses), 'Gastos')

    const insurance = data.insurances.find((i) => i.vehicleId === vehicle.id)
    if (insurance) {
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([
          {
            Compania: insurance.compania,
            'N° poliza': insurance.numPoliza,
            'Fecha inicio': toDateInput(insurance.fechaInicio),
            'Fecha vencimiento': toDateInput(insurance.fechaVencimiento),
            Coberturas: insurance.coberturas,
            Franquicia: insurance.franquicia,
            Telefono: insurance.telefono
          }
        ]),
        'Seguro'
      )
    }

    const itv = data.itvRecords
      .filter((r) => r.vehicleId === vehicle.id)
      .map((r) => ({ Fecha: toDateInput(r.fecha), Resultado: r.resultado, 'Proxima fecha': toDateInput(r.proximaFecha), Centro: r.centro }))
    if (itv.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(itv), 'ITV')

    const kmUpdates = data.kmUpdates
      .filter((k) => k.vehicleId === vehicle.id)
      .map((k) => ({ Fecha: toDateInput(k.fecha), Km: k.km }))
    if (kmUpdates.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kmUpdates), 'Kilometraje')
  }

  const fileName = vehicle ? `mi-coche-control_${vehicle.matricula.replace(/\s+/g, '')}.xlsx` : 'mi-coche-control.xlsx'
  XLSX.writeFile(wb, fileName)
}
