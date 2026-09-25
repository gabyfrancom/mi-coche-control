import React, { useState } from 'react'
import { useApp, uid } from '../context/AppContext'
import TopBar from '../components/TopBar'
import { Icon } from '../components/Icon'
import { differenceInCalendarDays, formatDate, parseDate, toDateInput } from '../utils/date'
import type { Insurance } from '../types'

export default function InsurancePage() {
  const { data, dispatch, activeVehicle } = useApp()
  const existing = data.insurances.find((i) => i.vehicleId === activeVehicle?.id)
  const [editing, setEditing] = useState(!existing)
  const [form, setForm] = useState<Insurance>(
    existing ?? {
      vehicleId: activeVehicle?.id ?? '',
      compania: '',
      numPoliza: '',
      fechaInicio: '',
      fechaVencimiento: '',
      coberturas: '',
      franquicia: 0,
      telefono: ''
    }
  )

  if (!activeVehicle) return null

  function guardar() {
    dispatch({ type: 'UPSERT_INSURANCE', insurance: { ...form, vehicleId: activeVehicle!.id } })
    setEditing(false)
  }

  const diasRestantes = form.fechaVencimiento ? differenceInCalendarDays(parseDate(form.fechaVencimiento), new Date()) : null

  return (
    <div className="flex flex-col gap-4 pb-6">
      <TopBar title="Seguro del vehiculo" onBack action={editing ? undefined : { icon: 'edit', label: 'Editar', onClick: () => setEditing(true) }} />

      <div className="px-5 flex flex-col gap-4">
        {!editing && existing ? (
          <>
            <div
              className={`rounded-2xl p-4 flex items-center justify-between ${
                diasRestantes != null && diasRestantes <= 0 ? 'bg-status-red/15' : diasRestantes != null && diasRestantes <= 60 ? 'bg-status-yellow/15' : 'bg-status-green/15'
              }`}
            >
              <div>
                <div className="text-[12px] text-violet-400 dark:text-violet-300/70">Vencimiento</div>
                <div className="font-semibold text-[15px] text-violet-900 dark:text-violet-50">{formatDate(existing.fechaVencimiento)}</div>
              </div>
              <div className="text-[13px] font-semibold">
                {diasRestantes != null ? (diasRestantes <= 0 ? `Vencido hace ${Math.abs(diasRestantes)} d.` : `${diasRestantes} dias`) : '-'}
              </div>
            </div>

            <div className="card p-4 grid grid-cols-2 gap-3.5">
              <Field label="Compania" value={existing.compania} />
              <Field label="N. poliza" value={existing.numPoliza} />
              <Field label="Fecha inicio" value={formatDate(existing.fechaInicio)} />
              <Field label="Franquicia" value={`${existing.franquicia} EUR`} />
              <Field label="Coberturas" value={existing.coberturas} full />
              <Field label="Telefono" value={existing.telefono} />
            </div>

            <a href={`tel:${existing.telefono}`} className="btn-primary flex items-center justify-center gap-2">
              <Icon name="phone" size={16} /> Llamar aseguradora
            </a>
          </>
        ) : (
          <div className="card p-4 flex flex-col gap-3.5">
            <Input label="Compania" value={form.compania} onChange={(v) => setForm({ ...form, compania: v })} />
            <Input label="Numero de poliza" value={form.numPoliza} onChange={(v) => setForm({ ...form, numPoliza: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Inicio" type="date" value={toDateInput(form.fechaInicio)} onChange={(v) => setForm({ ...form, fechaInicio: v })} />
              <Input label="Vencimiento" type="date" value={toDateInput(form.fechaVencimiento)} onChange={(v) => setForm({ ...form, fechaVencimiento: v })} />
            </div>
            <Input label="Coberturas" value={form.coberturas} onChange={(v) => setForm({ ...form, coberturas: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Franquicia (EUR)" type="number" value={String(form.franquicia)} onChange={(v) => setForm({ ...form, franquicia: Number(v) })} />
              <Input label="Telefono" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
            </div>
            <button className="btn-primary mt-1" onClick={guardar}>
              Guardar seguro
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <div className="text-[11px] text-violet-400 dark:text-violet-300/70">{label}</div>
      <div className="text-[13.5px] font-semibold text-violet-900 dark:text-violet-50 mt-0.5">{value || '-'}</div>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <div className="field-label">{label}</div>
      <input type={type} className="field-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
