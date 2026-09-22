import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'
import { Icon } from '../components/Icon'
import type { RoadsideContacts } from '../types'

export default function RoadsidePage() {
  const { data, dispatch, activeVehicle } = useApp()
  const existing = data.roadsideContacts.find((c) => c.vehicleId === activeVehicle?.id)
  const [editing, setEditing] = useState(!existing)
  const [form, setForm] = useState<RoadsideContacts>(
    existing ?? { vehicleId: activeVehicle?.id ?? '', telefonoGrua: '', telefonoAsistencia: '', telefonoSeguro: '', tallerHabitual: '' }
  )

  if (!activeVehicle) return null

  function guardar() {
    dispatch({ type: 'UPSERT_CONTACTS', contacts: { ...form, vehicleId: activeVehicle!.id } })
    setEditing(false)
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: 'Mi ubicacion', text: 'Necesito asistencia en carretera. Esta es mi ubicacion actual.' }).catch(() => {})
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
        navigator.clipboard?.writeText(url)
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <TopBar title="Asistencia en carretera" onBack action={editing ? undefined : { icon: 'edit', label: 'Editar', onClick: () => setEditing(true) }} />

      <div className="px-5 flex flex-col gap-4">
        <button
          onClick={() => (window.location.href = `tel:${form.telefonoAsistencia || form.telefonoGrua}`)}
          className="rounded-2xl p-5 flex flex-col items-center gap-2 text-white"
          style={{ background: 'linear-gradient(160deg, #FB7185, #DC2626)' }}
        >
          <Icon name="siren" size={30} />
          <span className="font-display font-bold text-[16px]">Emergencia</span>
          <span className="text-[12px] text-white/80">Toca para llamar asistencia</span>
        </button>

        {editing ? (
          <div className="card p-4 flex flex-col gap-3.5">
            <Input label="Telefono de grua" value={form.telefonoGrua} onChange={(v) => setForm({ ...form, telefonoGrua: v })} />
            <Input label="Telefono asistencia" value={form.telefonoAsistencia} onChange={(v) => setForm({ ...form, telefonoAsistencia: v })} />
            <Input label="Telefono seguro" value={form.telefonoSeguro} onChange={(v) => setForm({ ...form, telefonoSeguro: v })} />
            <Input label="Taller habitual" value={form.tallerHabitual} onChange={(v) => setForm({ ...form, tallerHabitual: v })} />
            <button className="btn-primary mt-1" onClick={guardar}>
              Guardar contactos
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <ContactRow icon="car" label="Grua" phone={form.telefonoGrua} />
            <ContactRow icon="siren" label="Asistencia" phone={form.telefonoAsistencia} />
            <ContactRow icon="shield" label="Seguro" phone={form.telefonoSeguro} />
            <div className="flex items-center gap-3 card px-3.5 py-3">
              <Icon name="wrench" size={17} className="text-violet-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[11.5px] text-violet-400 dark:text-violet-300/70">Taller habitual</div>
                <div className="text-[13.5px] font-semibold text-violet-900 dark:text-violet-50">{form.tallerHabitual || '-'}</div>
              </div>
            </div>
          </div>
        )}

        <button onClick={share} className="btn-secondary flex items-center justify-center gap-2">
          <Icon name="location" size={16} /> Compartir mi ubicacion
        </button>
      </div>
    </div>
  )
}

function ContactRow({ icon, label, phone }: { icon: 'car' | 'siren' | 'shield'; label: string; phone: string }) {
  return (
    <a href={phone ? `tel:${phone}` : undefined} className="flex items-center gap-3 card px-3.5 py-3">
      <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-700/50 flex items-center justify-center text-violet-400 flex-shrink-0">
        <Icon name={icon} size={17} />
      </div>
      <div className="flex-1">
        <div className="text-[11.5px] text-violet-400 dark:text-violet-300/70">{label}</div>
        <div className="text-[13.5px] font-semibold text-violet-900 dark:text-violet-50">{phone || 'Sin definir'}</div>
      </div>
      <Icon name="phone" size={16} className="text-violet-300" />
    </a>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="field-label">{label}</div>
      <input className="field-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
