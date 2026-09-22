import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp, uid } from '../context/AppContext'
import { getMaintenanceType } from '../utils/maintenanceTypes'
import { computeMaintenance, statusColor } from '../utils/status'
import TopBar from '../components/TopBar'
import { Icon } from '../components/Icon'
import { todayIso } from '../utils/date'

export default function MaintenanceDetail() {
  const { typeId } = useParams<{ typeId: string }>()
  const { data, dispatch, activeVehicle } = useApp()
  const navigate = useNavigate()
  const type = getMaintenanceType(typeId ?? '')

  const existing = data.maintenanceRecords.find((r) => r.vehicleId === activeVehicle?.id && r.typeId === typeId)

  const [fechaUltimo, setFechaUltimo] = useState(existing?.fechaUltimo?.slice(0, 10) ?? '')
  const [kmUltimo, setKmUltimo] = useState(existing?.kmUltimo?.toString() ?? '')
  const [coste, setCoste] = useState(existing?.coste?.toString() ?? '')
  const [taller, setTaller] = useState(existing?.taller ?? '')
  const [notas, setNotas] = useState(existing?.notas ?? '')

  if (!type || !activeVehicle) {
    return (
      <div className="p-5">
        <TopBar title="Mantenimiento" onBack />
        <p className="text-violet-400 text-sm px-1">No se encontro este tipo de mantenimiento.</p>
      </div>
    )
  }

  const computed = computeMaintenance(type, existing, activeVehicle.kmActuales)
  const c = statusColor(computed.status)

  function guardar() {
    dispatch({
      type: 'UPSERT_MAINTENANCE',
      record: {
        id: existing?.id ?? uid(),
        vehicleId: activeVehicle!.id,
        typeId: type!.id,
        fechaUltimo: fechaUltimo ? new Date(fechaUltimo).toISOString() : undefined,
        kmUltimo: kmUltimo ? Number(kmUltimo) : undefined,
        coste: coste ? Number(coste) : undefined,
        taller: taller || undefined,
        notas: notas || undefined
      }
    })
    if (coste) {
      dispatch({
        type: 'ADD_EXPENSE',
        expense: {
          id: uid(),
          vehicleId: activeVehicle!.id,
          categoria: 'revision',
          concepto: type!.nombre,
          importe: Number(coste),
          fecha: fechaUltimo ? new Date(fechaUltimo).toISOString() : todayIso()
        }
      })
    }
    navigate(-1)
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <TopBar title={type.nombre} onBack />

      <div className="px-5 flex flex-col gap-4">
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${c.bg}`}>
          <div className={`w-3 h-3 rounded-full ${c.dot} flex-shrink-0`} />
          <div className={`text-[13.5px] font-semibold ${c.text}`}>{computed.mensaje}</div>
        </div>

        {(type.intervaloKm || type.intervaloMeses) && (
          <div className="text-[12px] text-violet-400 dark:text-violet-300/70 px-1">
            Intervalo recomendado:{' '}
            {[type.intervaloKm ? `${type.intervaloKm.toLocaleString('es-ES')} km` : null, type.intervaloMeses ? `${type.intervaloMeses} meses` : null]
              .filter(Boolean)
              .join(' · ')}
          </div>
        )}

        <div className="card p-4 flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="field-label">Fecha del ultimo cambio</div>
              <input type="date" className="field-input" value={fechaUltimo} onChange={(e) => setFechaUltimo(e.target.value)} />
            </div>
            <div>
              <div className="field-label">Km del ultimo cambio</div>
              <input type="number" className="field-input" value={kmUltimo} onChange={(e) => setKmUltimo(e.target.value)} placeholder="Ej. 82100" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="field-label">Coste (EUR)</div>
              <input type="number" className="field-input" value={coste} onChange={(e) => setCoste(e.target.value)} placeholder="0" />
            </div>
            <div>
              <div className="field-label">Taller</div>
              <input className="field-input" value={taller} onChange={(e) => setTaller(e.target.value)} placeholder="Nombre del taller" />
            </div>
          </div>
          <div>
            <div className="field-label">Notas</div>
            <textarea className="field-input min-h-[72px] resize-none" value={notas} onChange={(e) => setNotas(e.target.value)} />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-violet-200 dark:border-violet-700 text-violet-400 dark:text-violet-300 text-[13px] py-3">
            <Icon name="camera" size={16} /> Adjuntar factura o foto
          </button>
        </div>

        <button className="btn-primary" onClick={guardar}>
          Guardar registro
        </button>
      </div>
    </div>
  )
}
