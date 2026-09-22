import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, uid } from '../context/AppContext'
import TopBar from '../components/TopBar'
import type { FuelType, Vehicle } from '../types'
import { todayIso } from '../utils/date'

export default function OnboardingPage() {
  const { dispatch } = useApp()
  const navigate = useNavigate()
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [matricula, setMatricula] = useState('')
  const [km, setKm] = useState(0)
  const [combustible, setCombustible] = useState<FuelType>('gasolina')

  function crear() {
    if (!marca || !modelo) return
    const vehicle: Vehicle = {
      id: uid(),
      marca,
      modelo,
      version: '',
      anio,
      matricula,
      vin: '',
      combustible,
      potenciaCV: 0,
      kmActuales: km,
      fechaCompra: todayIso(),
      kmCompra: km
    }
    dispatch({ type: 'ADD_VEHICLE', vehicle })
    navigate('/vehiculo')
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <TopBar title="Nuevo vehiculo" onBack />
      <div className="px-5 flex flex-col gap-3.5">
        <div>
          <div className="field-label">Marca</div>
          <input className="field-input" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ej. Volkswagen" />
        </div>
        <div>
          <div className="field-label">Modelo</div>
          <input className="field-input" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Ej. Golf" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="field-label">Ano</div>
            <input className="field-input" type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} />
          </div>
          <div>
            <div className="field-label">Matricula</div>
            <input className="field-input" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="0000 ABC" />
          </div>
        </div>
        <div>
          <div className="field-label">Combustible</div>
          <select className="field-input" value={combustible} onChange={(e) => setCombustible(e.target.value as FuelType)}>
            <option value="gasolina">Gasolina</option>
            <option value="diesel">Diesel</option>
            <option value="hibrido">Hibrido</option>
            <option value="electrico">Electrico</option>
            <option value="glp">GLP</option>
          </select>
        </div>
        <div>
          <div className="field-label">Kilometros actuales</div>
          <input className="field-input" type="number" value={km} onChange={(e) => setKm(Number(e.target.value))} />
        </div>
        <button className="btn-primary mt-2" onClick={crear}>
          Crear vehiculo
        </button>
      </div>
    </div>
  )
}
