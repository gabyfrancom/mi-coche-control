import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'
import { Icon } from '../components/Icon'
import type { AppSettings } from '../types'

export default function ProfilePage() {
  const { data, dispatch } = useApp()
  const navigate = useNavigate()

  function setTheme(theme: AppSettings['theme']) {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { theme } })
  }

  function toggle(key: 'notifPush' | 'notifEmail' | 'notifSms') {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { [key]: !data.settings[key] } })
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <TopBar title="Perfil" />

      <div className="px-5 flex flex-col gap-5">
        <div className="flex items-center gap-3.5 card p-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-300 to-violet-600 flex items-center justify-center text-white font-display font-bold text-[20px]">
            G
          </div>
          <div>
            <div className="font-display font-bold text-[16px] text-violet-900 dark:text-violet-50">Gaby Franco</div>
            <div className="text-[12.5px] text-violet-400 dark:text-violet-300/70">{data.vehicles.length} vehiculo(s) registrado(s)</div>
          </div>
        </div>

        <Section title="Apariencia">
          <div className="card p-1.5 flex gap-1.5">
            <ThemeOption active={data.settings.theme === 'light'} onClick={() => setTheme('light')} icon="sun" label="Claro" />
            <ThemeOption active={data.settings.theme === 'dark'} onClick={() => setTheme('dark')} icon="moon" label="Oscuro" />
            <ThemeOption active={data.settings.theme === 'system'} onClick={() => setTheme('system')} icon="user" label="Sistema" />
          </div>
        </Section>

        <Section title="Vehiculos">
          {data.vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_VEHICLE', id: v.id })}
              className={`w-full flex items-center gap-3 card px-3.5 py-3 mb-2 last:mb-0 ${v.id === data.activeVehicleId ? 'border-violet-300' : ''}`}
            >
              <Icon name="car" size={18} className="text-violet-400" />
              <div className="flex-1 text-left">
                <div className="text-[13.5px] font-semibold text-violet-900 dark:text-violet-50">
                  {v.marca} {v.modelo}
                </div>
                <div className="text-[11.5px] text-violet-400 dark:text-violet-300/70">{v.matricula}</div>
              </div>
              {v.id === data.activeVehicleId && <Icon name="check" size={16} className="text-violet-300" />}
            </button>
          ))}
          <button className="btn-secondary mt-1 flex items-center justify-center gap-2" onClick={() => navigate('/vehiculo/nuevo')}>
            <Icon name="plus" size={15} /> Agregar otro vehiculo
          </button>
        </Section>

        <Section title="Notificaciones">
          <div className="card divide-y divide-violet-100 dark:divide-violet-800">
            <ToggleRow label="Notificaciones push" checked={data.settings.notifPush} onChange={() => toggle('notifPush')} />
            <ToggleRow label="Correo electronico" checked={data.settings.notifEmail} onChange={() => toggle('notifEmail')} />
            <ToggleRow label="SMS" checked={data.settings.notifSms} onChange={() => toggle('notifSms')} />
          </div>
        </Section>

        <Section title="Acceso rapido">
          <button className="w-full flex items-center gap-2.5 card px-3.5 py-3 mb-2" onClick={() => navigate('/seguro')}>
            <Icon name="shield" size={17} className="text-violet-400" />
            <span className="text-[13px] font-medium text-violet-800 dark:text-violet-100">Seguro del vehiculo</span>
          </button>
          <button className="w-full flex items-center gap-2.5 card px-3.5 py-3" onClick={() => navigate('/asistencia')}>
            <Icon name="siren" size={17} className="text-violet-400" />
            <span className="text-[13px] font-medium text-violet-800 dark:text-violet-100">Asistencia en carretera</span>
          </button>
        </Section>

        <p className="text-center text-[11.5px] text-violet-300 dark:text-violet-600 mt-2">Mi Coche Control &middot; v1.0 &middot; datos guardados en este dispositivo</p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="font-display font-bold text-[14px] text-violet-900 dark:text-violet-50">{title}</h2>
      {children}
    </div>
  )
}

function ThemeOption({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: 'sun' | 'moon' | 'user'; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-[11.5px] font-medium ${
        active ? 'bg-violet-300 text-white' : 'text-violet-400 dark:text-violet-300/70'
      }`}
    >
      <Icon name={icon} size={17} />
      {label}
    </button>
  )
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between px-3.5 py-3 cursor-pointer">
      <span className="text-[13px] text-violet-800 dark:text-violet-100">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-violet-300' : 'bg-violet-100 dark:bg-violet-700'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </button>
    </label>
  )
}
