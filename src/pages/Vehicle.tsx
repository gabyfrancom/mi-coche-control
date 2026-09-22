import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'
import { Icon } from '../components/Icon'
import { formatDate } from '../utils/date'
import type { FuelType, Vehicle } from '../types'

const FUELS: { value: FuelType; label: string }[] = [
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hibrido', label: 'Hibrido' },
  { value: 'electrico', label: 'Electrico' },
  { value: 'glp', label: 'GLP' }
]

export default function VehiclePage() {
  const { activeVehicle, dispatch } = useApp()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Vehicle | null>(activeVehicle)

  if (!activeVehicle) {
    navigate('/vehiculo/nuevo')
    return null
  }

  const v = editing ? form! : activeVehicle

  function set<K extends keyof Vehicle>(key: K, value: Vehicle[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f))
  }

  function save() {
    if (!form) return
    dispatch({ type: 'UPDATE_VEHICLE', vehicle: form })
    setEditing(false)
  }

  function startEdit() {
    setForm(activeVehicle)
    setEditing(true)
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <TopBar
        title="Mi vehiculo"
        action={editing ? { icon: 'check', label: 'Guardar', onClick: save } : { icon: 'edit', label: 'Editar', onClick: startEdit }}
      />

      <div className="px-5 flex flex-col gap-4">
        <div className="relative rounded-[22px] h-[148px] bg-gradient-to-br from-violet-700 to-violet-950 border border-violet-800 flex items-center justify-center">
          <Icon name="car" size={72} className="text-violet-500 opacity-70" strokeWidth={1.2} />
          <button
            aria-label="Cambiar foto"
            className="absolute right-3 bottom-3 w-9 h-9 rounded-[11px] bg-violet-300 flex items-center justify-center text-white"
          >
            <Icon name="camera" size={17} />
          </button>
        </div>

        <div className="card p-4 grid grid-cols-2 gap-y-3.5 gap-x-3">
          <FieldView label="Marca" value={v.marca} editing={editing} onChange={(val) => set('marca', val)} />
          <FieldView label="Modelo" value={v.modelo} editing={editing} onChange={(val) => set('modelo', val)} />
          <FieldView label="Version" value={v.version} editing={editing} onChange={(val) => set('version', val)} full />
          <FieldView label="Ano" value={String(v.anio)} editing={editing} type="number" onChange={(val) => set('anio', Number(val))} />
          <FieldView label="Matricula" value={v.matricula} editing={editing} onChange={(val) => set('matricula', val)} />
          {editing ? (
            <div>
              <div className="field-label">Combustible</div>
              <select className="field-input" value={form!.combustible} onChange={(e) => set('combustible', e.target.value as FuelType)}>
                {FUELS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <FieldStatic label="Combustible" value={FUELS.find((f) => f.value === v.combustible)?.label ?? v.combustible} />
          )}
          <FieldView label="Potencia (CV)" value={String(v.potenciaCV)} editing={editing} type="number" onChange={(val) => set('potenciaCV', Number(val))} />
          <FieldView label="VIN / Bastidor" value={v.vin} editing={editing} onChange={(val) => set('vin', val)} full mono />
        </div>

        <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: 'linear-gradient(160deg, #3B1E78, #241242)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11.5px] text-violet-100/80">Kilometros actuales</div>
              <div className="font-display font-bold text-[24px] text-white mt-0.5">{v.kmActuales.toLocaleString('es-ES')} km</div>
            </div>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between text-white">
            <div>
              <div className="text-[11px] text-violet-100/80">Fecha de compra</div>
              {editing ? (
                <input
                  type="date"
                  className="bg-transparent text-[13px] font-semibold text-white border-b border-white/30 mt-0.5"
                  value={form!.fechaCompra.slice(0, 10)}
                  onChange={(e) => set('fechaCompra', e.target.value)}
                />
              ) : (
                <div className="text-[13px] font-semibold mt-0.5">{formatDate(v.fechaCompra)}</div>
              )}
            </div>
            <div>
              <div className="text-[11px] text-violet-100/80">Km al comprarlo</div>
              {editing ? (
                <input
                  type="number"
                  className="bg-transparent text-[13px] font-semibold text-white border-b border-white/30 mt-0.5 w-24"
                  value={form!.kmCompra}
                  onChange={(e) => set('kmCompra', Number(e.target.value))}
                />
              ) : (
                <div className="text-[13px] font-semibold mt-0.5">{v.kmCompra.toLocaleString('es-ES')} km</div>
              )}
            </div>
          </div>
        </div>

        {!editing && (
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display font-bold text-[15px] text-violet-900 dark:text-violet-50">Documentacion</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <DocButton icon="doc" label="Permiso circulacion" />
              <DocButton icon="doc" label="Ficha tecnica" />
              <DocButton icon="shield" label="Seguro" onClick={() => navigate('/seguro')} />
              <DocButton icon="check" label="ITV" onClick={() => navigate('/mantenimiento/itv')} />
            </div>
            <button className="btn-secondary mt-1 flex items-center justify-center gap-2" onClick={() => navigate('/asistencia')}>
              <Icon name="siren" size={16} /> Asistencia en carretera
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FieldView({
  label,
  value,
  editing,
  onChange,
  full,
  mono,
  type = 'text'
}: {
  label: string
  value: string
  editing: boolean
  onChange: (v: string) => void
  full?: boolean
  mono?: boolean
  type?: string
}) {
  if (!editing) return <FieldStatic label={label} value={value} full={full} mono={mono} />
  return (
    <div className={full ? 'col-span-2' : ''}>
      <div className="field-label">{label}</div>
      <input className="field-input" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function FieldStatic({ label, value, full, mono }: { label: string; value: string; full?: boolean; mono?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <div className="text-[11px] text-violet-400 dark:text-violet-300/70">{label}</div>
      <div className={`text-[13.5px] font-semibold text-violet-900 dark:text-violet-50 mt-0.5 ${mono ? 'font-mono text-[12.5px]' : ''}`}>{value}</div>
    </div>
  )
}

function DocButton({ icon, label, onClick }: { icon: 'doc' | 'shield' | 'check'; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 card p-3 text-left">
      <Icon name={icon} size={18} className="text-violet-300 flex-shrink-0" />
      <span className="text-[12.5px] font-medium text-violet-800 dark:text-violet-100">{label}</span>
    </button>
  )
}
