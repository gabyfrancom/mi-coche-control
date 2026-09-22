import { uid } from '../utils/id'
import { isoMonthsAgo, todayIso } from '../utils/date'
import type { AppData } from './storage'

// Datos de ejemplo para que la app no arranque vacia. El usuario puede
// editar o borrar el vehiculo de demo desde "Mi vehiculo".
export function seedData(): AppData {
  const vehicleId = uid()

  return {
    vehicles: [
      {
        id: vehicleId,
        marca: 'Volkswagen',
        modelo: 'Golf',
        version: '1.6 TDI Advance',
        anio: 2019,
        matricula: '4521 KLB',
        vin: 'WVWZZZ1KZAW123456',
        combustible: 'diesel',
        potenciaCV: 115,
        kmActuales: 87450,
        fechaCompra: '2020-03-01',
        kmCompra: 32100
      }
    ],
    activeVehicleId: vehicleId,
    kmUpdates: [
      { id: uid(), vehicleId, fecha: isoMonthsAgo(1), km: 87130 },
      { id: uid(), vehicleId, fecha: todayIso(), km: 87450 }
    ],
    maintenanceRecords: [
      { id: uid(), vehicleId, typeId: 'aceite-motor', fechaUltimo: isoMonthsAgo(8), kmUltimo: 82100 },
      { id: uid(), vehicleId, typeId: 'filtro-aire', fechaUltimo: isoMonthsAgo(5), kmUltimo: 79400 },
      { id: uid(), vehicleId, typeId: 'correa-distribucion', fechaUltimo: isoMonthsAgo(30), kmUltimo: 60000 },
      { id: uid(), vehicleId, typeId: 'pastillas-freno', fechaUltimo: isoMonthsAgo(10), kmUltimo: 70000 },
      { id: uid(), vehicleId, typeId: 'bateria', fechaUltimo: isoMonthsAgo(8) },
      { id: uid(), vehicleId, typeId: 'neumaticos', fechaUltimo: isoMonthsAgo(20), kmUltimo: 40000 },
      { id: uid(), vehicleId, typeId: 'itv', fechaUltimo: isoMonthsAgo(10), fechaProxima: new Date(Date.now() + 35 * 86400000).toISOString() },
      { id: uid(), vehicleId, typeId: 'seguro', fechaProxima: new Date(Date.now() - 4 * 86400000).toISOString() }
    ],
    expenses: [
      { id: uid(), vehicleId, categoria: 'combustible', concepto: 'Repostaje diesel', importe: 62.4, fecha: isoMonthsAgo(0) },
      { id: uid(), vehicleId, categoria: 'revision', concepto: 'Cambio de aceite y filtro', importe: 145, fecha: isoMonthsAgo(8) },
      { id: uid(), vehicleId, categoria: 'lavado', concepto: 'Lavado completo', importe: 12, fecha: isoMonthsAgo(1) },
      { id: uid(), vehicleId, categoria: 'seguro', concepto: 'Prima anual seguro', importe: 410, fecha: isoMonthsAgo(11) },
      { id: uid(), vehicleId, categoria: 'itv', concepto: 'Tasa ITV', importe: 38, fecha: isoMonthsAgo(10) },
      { id: uid(), vehicleId, categoria: 'reparacion', concepto: 'Pastillas de freno delanteras', importe: 180, fecha: isoMonthsAgo(10) }
    ],
    insurances: [
      {
        vehicleId,
        compania: 'Mapfre',
        numPoliza: 'ES-0098234',
        fechaInicio: isoMonthsAgo(11),
        fechaVencimiento: new Date(Date.now() - 4 * 86400000).toISOString(),
        coberturas: 'Todo riesgo con franquicia',
        franquicia: 300,
        telefono: '900123456'
      }
    ],
    itvRecords: [
      { id: uid(), vehicleId, fecha: isoMonthsAgo(10), resultado: 'apta', proximaFecha: new Date(Date.now() + 35 * 86400000).toISOString(), centro: 'ITV Tenerife Sur' }
    ],
    tireSets: [
      { vehicleId, marca: 'Michelin', modelo: 'Primacy 4', medidas: '205/55 R16', fechaInstalacion: isoMonthsAgo(20), kmInstalacion: 40000, vidaUtilKm: 45000 }
    ],
    roadsideContacts: [
      { vehicleId, telefonoGrua: '900 100 100', telefonoAsistencia: '900 200 200', telefonoSeguro: '900123456', tallerHabitual: 'Taller Hermanos Perez' }
    ],
    settings: {
      theme: 'dark',
      notifPush: true,
      notifEmail: true,
      notifSms: false,
      appLockEnabled: false,
      biometricEnabled: false
    }
  }
}
