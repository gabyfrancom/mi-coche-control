import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useVehicleMaintenance } from '../utils/useVehicleMaintenance'
import { Icon } from '../components/Icon'
import { statusColor } from '../utils/status'
import Fab from '../components/Fab'
import Sheet from '../components/Sheet'
import { lastMonths, totalThisYear } from '../utils/expenses'
import { todayIso, formatDate } from '../utils/date'
import { uid } from '../utils/id'

export default function Dashboard() {
  const { data, dispatch, activeVehicle } = useApp()
  const { counts, proximos } = useVehicleMaintenance()
  const navigate = useNavigate()
  const [kmOpen, setKmOpen] = useState(false)
  const [kmValue, setKmValue] = useState('')

  if (!activeVehicle) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[70dvh] text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-violet-700 flex items-center justify-center text-violet-100">
          <Icon name="car" size={28} />
        </div>
        <p className="text-violet-500 dark:text-violet-200 text-sm">Todavia no agregaste ningun vehiculo.</p>
        <button className="btn-primary max-w-[220px]" onClick={() => navigate('/vehiculo/nuevo')}>
          Agregar vehiculo
        </button>
      </div>
    )
  }

  const kmUltimoUpdate = [...data.kmUpdates].filter((k) => k.vehicleId === activeVehicle.id).sort((a, b) => b.fecha.localeCompare(a.fecha))[0]
  const kmMesAnterior = (() => {
    const ups = data.kmUpdates.filter((k) => k.vehicleId === activeVehicle.id).sort((a, b) => a.fecha.localeCompare(b.fecha))
    if (ups.length < 2) return 0
    return activeVehicle.kmActuales - ups[ups.length - 2].km
  })()

  const gastosVehiculo = data.expenses.filter((e) => e.vehicleId === activeVehicle.id)
  const chart = lastMonths(gastosVehiculo, 6)
  const chartMax = Math.max(...chart.map((c) => c.total), 1)

  function submitKm() {
    const km = parseInt(kmValue, 10)
    if (!Number.isFinite(km) || km <= 0) return
    dispatch({ type: 'ADD_KM_UPDATE', update: { id: uid(), vehicleId: activeVehicle!.id, fecha: todayIso(), km } })
    setKmValue('')
    setKmOpen(false)
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] text-violet-400 dark:text-violet-300/80">Hola,</div>
          <div className="font-display font-bold text-[21px] text-violet-900 dark:text-violet-50">Gaby</div>
        </div>
        <Link
          to="/perfil"
          aria-label="Notificaciones"
          className="relative w-10 h-10 rounded-xl bg-white dark:bg-violet-800 border border-violet-100 dark:border-violet-800 flex items-center justify-center text-violet-500 dark:text-violet-100"
        >
          <Icon name="bell" size={19} />
          {counts.rojo + counts.amarillo > 0 && (
            <div className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-status-red border-2 border-white dark:border-violet-900" />
          )}
        </Link>
      </div>

      <Link
        to="/vehiculo"
        className="rounded-2xl p-5 flex flex-col gap-3.5 border border-violet-500/40"
        style={{ background: 'linear-gradient(160deg, #3B1E78 0%, #241242 70%)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Icon name="car" size={20} />
            </div>
            <div>
              <div className="font-semibold text-[15px] text-white">
                {activeVehicle.marca} {activeVehicle.modelo}
              </div>
              <div className="text-[12.5px] text-violet-100/80">
                {activeVehicle.version} &middot; {activeVehicle.anio}
              </div>
            </div>
          </div>
          <div className="text-[11.5px] font-semibold text-white bg-white/15 px-2.5 py-1 rounded-lg tracking-wide">
            {activeVehicle.matricula}
          </div>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex items-end justify-between">
          <div>
            <div className="font-display font-bold text-[28px] text-white leading-none">
              {activeVehicle.kmActuales.toLocaleString('es-ES')} <span className="text-[15px] font-medium text-violet-100/80">km</span>
            </div>
            <div className="text-[12px] text-emerald-300 mt-1">
              {kmMesAnterior > 0 ? `+${kmMesAnterior.toLocaleString('es-ES')} km este mes` : kmUltimoUpdate ? `Actualizado ${formatDate(kmUltimoUpdate.fecha)}` : 'Sin actualizaciones'}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              setKmOpen(true)
            }}
            className="text-[13px] font-semibold text-[#2A1550] bg-amber px-3.5 py-2.5 rounded-xl"
          >
            Actualizar km
          </button>
        </div>
      </Link>

      <div className="flex gap-2.5">
        <StatPill color="bg-status-green" value={counts.verde} label="Al dia" />
        <StatPill color="bg-status-yellow" value={counts.amarillo} label="Proximos" />
        <StatPill color="bg-status-red" value={counts.rojo} label="Vencidos" />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-[15.5px] text-violet-900 dark:text-violet-50">Proximos mantenimientos</h2>
          <Link to="/mantenimiento" className="text-[12.5px] font-semibold text-violet-400">
            Ver todo
          </Link>
        </div>

        {proximos.length === 0 ? (
          <div className="card p-4 text-center text-[13px] text-violet-400 dark:text-violet-300/70">
            Todo al dia. Sin mantenimientos pendientes.
          </div>
        ) : (
          proximos.slice(0, 4).map(({ type, computed }) => {
            const c = statusColor(computed.status)
            return (
              <Link
                key={type.id}
                to={`/mantenimiento/${type.id}`}
                className="flex items-center gap-3 card px-3.5 py-3"
              >
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0 ${c.text}`}>
                  <Icon name="wrench" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13.5px] text-violet-900 dark:text-violet-50 truncate">{type.nombre}</div>
                  <div className={`text-[12px] mt-0.5 ${c.text}`}>{computed.mensaje}</div>
                </div>
                <Icon name="chevronRight" size={17} className="text-violet-300 dark:text-violet-500 flex-shrink-0" />
              </Link>
            )
          })
        )}
      </div>

      <div className="card p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="text-[12.5px] text-violet-400 dark:text-violet-300/80">Gastos este ano</div>
          <div className="font-display font-bold text-[16px] text-violet-900 dark:text-violet-50">
            {totalThisYear(gastosVehiculo).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </div>
        </div>
        <div className="flex items-end gap-2 h-11">
          {chart.map((c, i) => (
            <div
              key={i}
              className={`flex-1 rounded ${i === chart.length - 1 ? 'bg-violet-300' : 'bg-violet-100 dark:bg-violet-700'}`}
              style={{ height: `${Math.max((c.total / chartMax) * 100, 6)}%` }}
              title={`${c.label}: ${c.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`}
            />
          ))}
        </div>
      </div>

      <Fab onClick={() => setKmOpen(true)} label="Actualizar km" />

      <Sheet open={kmOpen} onClose={() => setKmOpen(false)} title="Actualizar kilometraje">
        <p className="text-[13px] text-violet-400 dark:text-violet-300/80 mb-3">
          Actual: {activeVehicle.kmActuales.toLocaleString('es-ES')} km. Cada 15 dias te lo recordamos.
        </p>
        <label className="field-label" htmlFor="km-input">
          Kilometros actuales
        </label>
        <input
          id="km-input"
          type="number"
          inputMode="numeric"
          className="field-input mb-4"
          placeholder="Ej. 87950"
          value={kmValue}
          onChange={(e) => setKmValue(e.target.value)}
        />
        <button className="btn-primary" onClick={submitKm}>
          Guardar
        </button>
      </Sheet>
    </div>
  )
}

function StatPill({ color, value, label }: { color: string; value: number; label: string }) {
  return (
    <div className="flex-1 card py-3 px-2 flex flex-col items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <div className="font-bold text-[18px] text-violet-900 dark:text-violet-50">{value}</div>
      <div className="text-[10.5px] text-violet-400 dark:text-violet-300/70">{label}</div>
    </div>
  )
}
