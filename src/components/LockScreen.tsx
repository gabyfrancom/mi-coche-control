import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { verifyPin } from '../utils/crypto'
import { verifyBiometric } from '../utils/webauthn'
import { Icon } from './Icon'

const DOTS = 4

export default function LockScreen() {
  const { data, unlock } = useApp()
  const { settings } = data
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  async function tryBiometric() {
    if (!settings.biometricEnabled || !settings.biometricCredentialId) return
    setChecking(true)
    setError(null)
    const ok = await verifyBiometric(settings.biometricCredentialId)
    setChecking(false)
    if (ok) unlock()
    else setError('No se pudo verificar la huella / Face ID. Proba con el PIN.')
  }

  useEffect(() => {
    if (settings.biometricEnabled && settings.biometricCredentialId) {
      tryBiometric()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onDigit(d: string) {
    if (pin.length >= DOTS || checking) return
    const next = pin + d
    setPin(next)
    setError(null)
    if (next.length === DOTS) {
      setChecking(true)
      const ok =
        settings.appLockPinHash && settings.appLockPinSalt
          ? await verifyPin(next, settings.appLockPinHash, settings.appLockPinSalt)
          : false
      setChecking(false)
      if (ok) {
        unlock()
      } else {
        setError('PIN incorrecto')
        setPin('')
      }
    }
  }

  function onDelete() {
    setPin((p) => p.slice(0, -1))
    setError(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-violet-950 px-6 text-white">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-800/60">
          <Icon name="lock" size={28} className="text-violet-200" />
        </div>
        <h1 className="font-display text-xl font-semibold">Mi Coche Control</h1>
        <p className="text-sm text-violet-300">Ingresa tu PIN para continuar</p>
      </div>

      <div className="mb-6 flex gap-4">
        {Array.from({ length: DOTS }).map((_, i) => (
          <span
            key={i}
            className={`h-3.5 w-3.5 rounded-full border border-violet-400 ${
              i < pin.length ? 'bg-violet-300' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-status-red">{error}</p>}

      <div className="grid grid-cols-3 gap-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => onDigit(d)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-900/60 text-xl font-medium active:bg-violet-800"
          >
            {d}
          </button>
        ))}
        <button
          onClick={tryBiometric}
          disabled={!settings.biometricEnabled || !settings.biometricCredentialId}
          className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-medium disabled:opacity-20"
        >
          <Icon name="fingerprint" size={24} />
        </button>
        <button
          onClick={() => onDigit('0')}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-900/60 text-xl font-medium active:bg-violet-800"
        >
          0
        </button>
        <button
          onClick={onDelete}
          className="flex h-16 w-16 items-center justify-center rounded-full text-sm font-medium text-violet-300"
        >
          Borrar
        </button>
      </div>
    </div>
  )
}
