import type { MaintenanceTypeDef } from '../types'

// Los 30 puntos de control pedidos en el brief, con intervalos por defecto
// (el usuario puede ajustarlos por vehiculo mas adelante; aqui quedan los
// valores tipicos usados por la mayoria de fabricantes).
export const MAINTENANCE_TYPES: MaintenanceTypeDef[] = [
  { id: 'aceite-motor', nombre: 'Cambio de aceite motor', icono: 'oil', intervaloKm: 15000, intervaloMeses: 12, categoria: 'motor' },
  { id: 'filtro-aceite', nombre: 'Filtro de aceite', icono: 'filter', intervaloKm: 15000, intervaloMeses: 12, categoria: 'motor' },
  { id: 'filtro-aire', nombre: 'Filtro de aire', icono: 'filter', intervaloKm: 30000, intervaloMeses: 24, categoria: 'motor' },
  { id: 'filtro-combustible', nombre: 'Filtro de combustible', icono: 'filter', intervaloKm: 40000, intervaloMeses: 36, categoria: 'motor' },
  { id: 'filtro-habitaculo', nombre: 'Filtro de habitaculo', icono: 'filter', intervaloKm: 20000, intervaloMeses: 12, categoria: 'confort' },
  { id: 'liquido-refrigerante', nombre: 'Liquido refrigerante', icono: 'drop', intervaloKm: 60000, intervaloMeses: 48, categoria: 'motor' },
  { id: 'liquido-frenos', nombre: 'Liquido de frenos', icono: 'drop', intervaloKm: 40000, intervaloMeses: 24, categoria: 'frenos' },
  { id: 'liquido-direccion', nombre: 'Liquido direccion asistida', icono: 'drop', intervaloKm: 60000, intervaloMeses: 48, categoria: 'motor' },
  { id: 'aceite-caja-cambios', nombre: 'Aceite caja de cambios', icono: 'oil', intervaloKm: 60000, intervaloMeses: 48, categoria: 'motor' },
  { id: 'aceite-diferencial', nombre: 'Aceite diferencial', icono: 'oil', intervaloKm: 60000, intervaloMeses: 48, categoria: 'motor' },
  { id: 'correa-distribucion', nombre: 'Correa de distribucion', icono: 'belt', intervaloKm: 120000, intervaloMeses: 60, categoria: 'motor' },
  { id: 'cadena-distribucion', nombre: 'Cadena de distribucion', icono: 'belt', intervaloKm: 180000, intervaloMeses: 96, categoria: 'motor' },
  { id: 'bomba-agua', nombre: 'Bomba de agua', icono: 'drop', intervaloKm: 120000, intervaloMeses: 60, categoria: 'motor' },
  { id: 'bujias', nombre: 'Bujias', icono: 'spark', intervaloKm: 40000, intervaloMeses: 36, categoria: 'motor' },
  { id: 'calentadores-diesel', nombre: 'Calentadores diesel', icono: 'spark', intervaloKm: 100000, intervaloMeses: 60, categoria: 'motor' },
  { id: 'pastillas-freno', nombre: 'Pastillas de freno', icono: 'brake', intervaloKm: 30000, intervaloMeses: 24, categoria: 'frenos' },
  { id: 'discos-freno', nombre: 'Discos de freno', icono: 'brake', intervaloKm: 60000, intervaloMeses: 48, categoria: 'frenos' },
  { id: 'amortiguadores', nombre: 'Amortiguadores', icono: 'suspension', intervaloKm: 80000, intervaloMeses: 60, categoria: 'motor' },
  { id: 'embrague', nombre: 'Embrague', icono: 'gear', intervaloKm: 120000, intervaloMeses: 84, categoria: 'motor' },
  { id: 'bateria', nombre: 'Bateria', icono: 'battery', intervaloKm: undefined, intervaloMeses: 48, categoria: 'motor' },
  { id: 'neumaticos', nombre: 'Neumaticos', icono: 'tire', intervaloKm: 45000, intervaloMeses: 60, categoria: 'neumaticos' },
  { id: 'alineacion', nombre: 'Alineacion', icono: 'align', intervaloKm: 20000, intervaloMeses: 12, categoria: 'neumaticos' },
  { id: 'equilibrado', nombre: 'Equilibrado', icono: 'align', intervaloKm: 20000, intervaloMeses: 12, categoria: 'neumaticos' },
  { id: 'escobillas', nombre: 'Escobillas limpiaparabrisas', icono: 'wiper', intervaloKm: undefined, intervaloMeses: 12, categoria: 'confort' },
  { id: 'aire-acondicionado', nombre: 'Sistema de aire acondicionado', icono: 'ac', intervaloKm: undefined, intervaloMeses: 24, categoria: 'confort' },
  { id: 'revision-general', nombre: 'Revision general', icono: 'check', intervaloKm: 15000, intervaloMeses: 12, categoria: 'motor' },
  { id: 'diagnostico-obd', nombre: 'Diagnostico OBD', icono: 'chip', intervaloKm: undefined, intervaloMeses: 12, categoria: 'motor' },
  { id: 'itv', nombre: 'ITV', icono: 'doc', intervaloKm: undefined, intervaloMeses: 12, categoria: 'legal' },
  { id: 'seguro', nombre: 'Seguro', icono: 'shield', intervaloKm: undefined, intervaloMeses: 12, categoria: 'legal' },
  { id: 'impuesto-circulacion', nombre: 'Impuesto de circulacion', icono: 'doc', intervaloKm: undefined, intervaloMeses: 12, categoria: 'legal' }
]

export function getMaintenanceType(id: string): MaintenanceTypeDef | undefined {
  return MAINTENANCE_TYPES.find((t) => t.id === id)
}
