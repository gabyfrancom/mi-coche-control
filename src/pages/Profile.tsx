import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'
import Sheet from '../components/Sheet'
import { Icon } from '../components/Icon'
import type { AppSettings } from '../types'
import { createPinHash } from '../utils/crypto'
import { exportBackup, readBackup } from '../store/storage'
import { isBiometricAvailable, registerBiometric } from '../utils/webauthn'

export default function ProfilePage() {
  const { data, dispatch } = useApp()
  const navigate = useNavigate()
  const [pinSheetOpen, setPinSheetOpen] = useState(false)

  function setTheme(theme: AppSettings['theme']) {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { theme } })
  }

  function toggle(key: 'notifPush' | 'notifEmail' | 'notifSms') {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { [key]: !data.settings[key] } })
  }

  function removeAppLock() {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: {
        appLockEnabled: false,
        appLockPinHash: undefined,
        appLockPinSalt: undefined,
        biometricEnabled: false,
        biometricCredentialId: undefined
      }
    })
  }

  async function toggleBiometric() {
    if (data.settings.biometricEnabled) {
      dispatch({ type: 'UPDATE_SETTINGS', settings: { biometricEnabled: false, biometricCredentialId: undefined } })
      return
    }
    const available = await isBiometricAvailable()
    if (!available) {
      alert('Este dispositivo o navegador no tiene huella / Face ID / Windows Hello disponible.')
      return
    }
    const credentialId = await registerBiometric(data.activeVehicleId ?? 'usuario')
    if (!credentialId) {
      alert('No se pudo registrar la huella / Face ID. Intenta de nuevo.')
      return
    }
    dispatch({ type: 'UPDATE_SETTINGS', settings: { biometricEnabled: true, biometricCredentialId: credentialId } })
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

        <Section title="Seguridad">
          <div className="card divide-y divide-violet-100 dark:divide-violet-800">
            <ToggleRow
              label={data.settings.appLockEnabled ? 'Bloqueo con PIN activado' : 'Bloquear la app con PIN'}
              checked={data.settings.appLockEnabled}
              onChange={() => (data.settings.appLockEnabled ? removeAppLock() : setPinSheetOpen(true))}
            />
            <ToggleRow
              label="Desbloqueo con huella / Face ID"
              checked={data.settings.biometricEnabled}
              onChange={toggleBiometric}
            />
          </div>
          <p className="text-[11.5px] text-violet-400 dark:text-violet-300/70 px-1">
            El PIN y la huella se guardan solo en este dispositivo, no se envian a ningun servidor.
          </p>
        </Section>

        <Section title="Exportar datos">
          <div className="card p-1.5 flex flex-col gap-1.5">
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl active:bg-violet-50 dark:active:bg-violet-800"
              onClick={() => exportBackup(data)}
            >
              <Icon name="download" size={17} className="text-violet-400" />
              <span className="text-[13px] font-medium text-violet-800 dark:text-violet-100">Copia de seguridad completa (JSON)</span>
            </button>
            <label className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer active:bg-violet-50 dark:active:bg-violet-800">
              <Icon name="file" size={17} className="text-violet-400" />
              <span className="text-[13px] font-medium text-violet-800 dark:text-violet-100">Restaurar copia de seguridad</span>
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (!file) return
                  try {
                    const restored = await readBackup(file)
                    if (confirm(`Se reemplazarán los datos actuales por la copia con ${restored.vehicles.length} vehículo(s). ¿Continuar?`)) {
                      dispatch({ type: 'REPLACE_ALL', data: { ...restored, settings: { ...restored.settings, ...pickLock(data.settings) } } })
                    }
                  } catch (err) {
                    alert(String(err instanceof Error ? err.message : err))
                  }
                }}
              />
            </label>
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl active:bg-violet-50 dark:active:bg-violet-800"
              onClick={async () => (await import('../utils/exportExcel')).exportToExcel(data, data.activeVehicleId)}
            >
              <Icon name="download" size={17} className="text-violet-400" />
              <span className="text-[13px] font-medium text-violet-800 dark:text-violet-100">Exportar todo a Excel</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl active:bg-violet-50 dark:active:bg-violet-800"
              onClick={async () => (await import('../utils/exportPdf')).exportVehiclePdf(data, data.activeVehicleId)}
            >
              <Icon name="file" size={17} className="text-violet-400" />
              <span className="text-[13px] font-medium text-violet-800 dark:text-violet-100">Ficha tecnica en PDF</span>
            </button>
          </div>
          <p className="text-[11.5px] text-violet-400 dark:text-violet-300/70 px-1">
            Sincronizacion en la nube: proximamente. Por ahora, esta exportacion es la forma de tener una copia fuera del dispositivo.
          </p>
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

      <PinSetupSheet
        open={pinSheetOpen}
        onClose={() => setPinSheetOpen(false)}
        onSave={(hash, salt, length) => {
          dispatch({ type: 'UPDATE_SETTINGS', settings: { appLockEnabled: true, appLockPinHash: hash, appLockPinSalt: salt, appLockPinLength: length } })
          setPinSheetOpen(false)
        }}
      />
    </div>
  )
}

function PinSetupSheet({
  open,
  onClose,
  onSave
}: {
  open: boolean
  onClose: () => void
  onSave: (hash: string, salt: string, length: number) => void
}) {
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function save() {
    if (!/^\d{4,6}$/.test(pin)) {
      setError('El PIN debe tener entre 4 y 6 numeros.')
      return
    }
    if (pin !== confirm) {
      setError('Los PIN no coinciden.')
      return
    }
    const { hash, salt } = await createPinHash(pin)
    setPin('')
    setConfirm('')
    setError(null)
    onSave(hash, salt, pin.length)
  }

  return (
    <Sheet open={open} onClose={onClose} title="Crear PIN de acceso">
      <div className="flex flex-col gap-3.5">
        <div>
          <div className="field-label">Nuevo PIN (4 a 6 numeros)</div>
          <input
            type="password"
            inputMode="numeric"
            className="field-input"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="••••"
          />
        </div>
        <div>
          <div className="field-label">Confirmar PIN</div>
          <input
            type="password"
            inputMode="numeric"
            className="field-input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="••••"
          />
        </div>
        {error && <p className="text-[12px] text-status-red">{error}</p>}
        <button className="btn-primary" onClick={save}>
          Guardar PIN y activar bloqueo
        </button>
      </div>
    </Sheet>
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

/** Al restaurar se conserva el bloqueo configurado en ESTE dispositivo. */
function pickLock(s: AppSettings): Partial<AppSettings> {
  const { appLockEnabled, appLockPinHash, appLockPinSalt, appLockPinLength, biometricEnabled, biometricCredentialId } = s
  return { appLockEnabled, appLockPinHash, appLockPinSalt, appLockPinLength, biometricEnabled, biometricCredentialId }
}
