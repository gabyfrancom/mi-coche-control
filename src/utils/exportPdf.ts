import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { AppData } from '../store/storage'
import { getMaintenanceType } from './maintenanceTypes'

const VIOLET = [124, 58, 237] as [number, number, number]

/**
 * Genera un PDF "ficha tecnica" de una pagina con los datos principales
 * del vehiculo, el estado de mantenimiento y el seguro. Pensado para
 * imprimir o compartir, por ejemplo al vender el vehiculo.
 */
export function exportVehiclePdf(data: AppData, vehicleId: string | null) {
  const vehicle = data.vehicles.find((v) => v.id === vehicleId) ?? data.vehicles[0]
  if (!vehicle) return

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const marginX = 14
  let y = 18

  doc.setFillColor(...VIOLET)
  doc.rect(0, 0, 210, 26, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text('Ficha tecnica del vehiculo', marginX, 16)
  doc.setFontSize(10)
  doc.text('Mi Coche Control', marginX, 22)

  y = 34
  doc.setTextColor(30, 20, 55)
  doc.setFontSize(14)
  doc.text(`${vehicle.marca} ${vehicle.modelo} ${vehicle.version}`, marginX, y)
  y += 8

  autoTable(doc, {
    startY: y,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 1.2 },
    body: [
      ['Matricula', vehicle.matricula, 'Año', String(vehicle.anio)],
      ['VIN', vehicle.vin, 'Combustible', vehicle.combustible],
      ['Potencia', `${vehicle.potenciaCV} CV`, 'Km actuales', vehicle.kmActuales.toLocaleString('es-ES')],
      ['Fecha de compra', vehicle.fechaCompra, 'Km de compra', vehicle.kmCompra.toLocaleString('es-ES')]
    ],
    columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } }
  })

  // @ts-expect-error jspdf-autotable extiende jsPDF en runtime
  y = doc.lastAutoTable.finalY + 8

  const maint = data.maintenanceRecords.filter((r) => r.vehicleId === vehicle.id)
  if (maint.length) {
    doc.setFontSize(12)
    doc.setTextColor(...VIOLET)
    doc.text('Historial de mantenimiento', marginX, y)
    y += 3
    autoTable(doc, {
      startY: y,
      head: [['Mantenimiento', 'Ultima fecha', 'Ultimo km', 'Marca/producto', 'Coste']],
      body: maint.map((r) => [
        getMaintenanceType(r.typeId)?.nombre ?? r.typeId,
        r.fechaUltimo ?? '-',
        r.kmUltimo ? r.kmUltimo.toLocaleString('es-ES') : '-',
        [r.marcaProducto, r.especificaciones].filter(Boolean).join(' · ') || '-',
        r.coste ? `${r.coste} €` : '-'
      ]),
      headStyles: { fillColor: VIOLET },
      styles: { fontSize: 8.5, cellPadding: 1.6 }
    })
    // @ts-expect-error jspdf-autotable extiende jsPDF en runtime
    y = doc.lastAutoTable.finalY + 8
  }

  const insurance = data.insurances.find((i) => i.vehicleId === vehicle.id)
  if (insurance) {
    if (y > 260) {
      doc.addPage()
      y = 18
    }
    doc.setFontSize(12)
    doc.setTextColor(...VIOLET)
    doc.text('Seguro', marginX, y)
    y += 3
    autoTable(doc, {
      startY: y,
      theme: 'plain',
      styles: { fontSize: 9.5, cellPadding: 1 },
      body: [
        ['Compania', insurance.compania, 'Poliza', insurance.numPoliza],
        ['Vencimiento', insurance.fechaVencimiento, 'Telefono', insurance.telefono]
      ],
      columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } }
    })
  }

  doc.setFontSize(8)
  doc.setTextColor(150, 150, 160)
  doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} con Mi Coche Control`, marginX, 290)

  doc.save(`ficha-tecnica_${vehicle.matricula.replace(/\s+/g, '')}.pdf`)
}
