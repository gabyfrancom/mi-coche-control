import React, { useMemo, useState } from 'react'
import { useApp, uid } from '../context/AppContext'
import TopBar from '../components/TopBar'
import { Icon } from '../components/Icon'
import Sheet from '../components/Sheet'
import Fab from '../components/Fab'
import { CATEGORY_LABELS, lastMonths, totalThisYear } from '../utils/expenses'
import { formatDate, todayIso } from '../utils/date'
import type { Expense } from '../types'

const CATS = Object.keys(CATEGORY_LABELS) as Expense['categoria'][]

export default function ExpensesPage() {
  const { data, dispatch, activeVehicle } = useApp()
  const [open, setOpen] = useState(false)
  const [categoria, setCategoria] = useState<Expense['categoria']>('combustible')
  const [concepto, setConcepto] = useState('')
  const [importe, setImporte] = useState('')
  const [fecha, setFecha] = useState(todayIso().slice(0, 10))

  const gastos = useMemo(
    () => (activeVehicle ? data.expenses.filter((e) => e.vehicleId === activeVehicle.id).sort((a, b) => b.fecha.localeCompare(a.fecha)) : []),
    [data.expenses, activeVehicle]
  )

  const chart = lastMonths(gastos, 6)
  const chartMax = Math.max(...chart.map((c) => c.total), 1)
  const totalAnio = totalThisYear(gastos)
  const totalMes = gastos
    .filter((g) => {
      const d = new Date(g.fecha)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((s, g) => s + g.importe, 0)

  function guardar() {
    if (!activeVehicle || !concepto || !importe) return
    dispatch({
      type: 'ADD_EXPENSE',
      expense: { id: uid(), vehicleId: activeVehicle.id, categoria, concepto, importe: Number(importe), fecha: new Date(fecha).toISOString() }
    })
    setConcepto('')
    setImporte('')
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <TopBar title="Gastos" />

      <div className="px-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <div className="text-[11.5px] text-violet-400 dark:text-violet-300/70">Este mes</div>
            <div className="font-display font-bold text-[20px] text-violet-900 dark:text-violet-50 mt-1">
              {totalMes.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-[11.5px] text-violet-400 dark:text-violet-300/70">Este ano</div>
            <div className="font-display font-bold text-[20px] text-violet-900 dark:text-violet-50 mt-1">
              {totalAnio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
          </div>
        </div>

        <div className="card p-4 flex flex-col gap-3">
          <div className="text-[12.5px] text-violet-400 dark:text-violet-300/80">Ultimos 6 meses</div>
          <div className="flex items-end gap-2.5 h-16">
            {chart.map((c, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded ${i === chart.length - 1 ? 'bg-violet-300' : 'bg-violet-100 dark:bg-violet-700'}`}
                  style={{ height: `${Math.max((c.total / chartMax) * 100, 6)}%` }}
                />
                <div className="text-[9.5px] text-violet-400 dark:text-violet-300/60 capitalize">{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="font-display font-bold text-[15px] text-violet-900 dark:text-violet-50">Historial</h2>
          {gastos.length === 0 && <p className="text-[13px] text-violet-400 dark:text-violet-300/70">Todavia no registraste gastos.</p>}
          {gastos.map((g) => (
            <div key={g.id} className="flex items-center gap-3 card px-3.5 py-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-700/50 flex items-center justify-center text-violet-400 dark:text-violet-100 flex-shrink-0">
                <Icon name="chart" size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13.5px] text-violet-900 dark:text-violet-50 truncate">{g.concepto}</div>
                <div className="text-[11.5px] text-violet-400 dark:text-violet-300/70 mt-0.5">
                  {CATEGORY_LABELS[g.categoria]} &middot; {formatDate(g.fecha)}
                </div>
              </div>
              <div className="font-semibold text-[13.5px] text-violet-900 dark:text-violet-50">
                {g.importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Fab onClick={() => setOpen(true)} label="Agregar gasto" />

      <Sheet open={open} onClose={() => setOpen(false)} title="Nuevo gasto">
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="field-label">Categoria</div>
            <select className="field-input" value={categoria} onChange={(e) => setCategoria(e.target.value as Expense['categoria'])}>
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="field-label">Concepto</div>
            <input className="field-input" value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Ej. Repostaje" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="field-label">Importe (EUR)</div>
              <input type="number" className="field-input" value={importe} onChange={(e) => setImporte(e.target.value)} placeholder="0" />
            </div>
            <div>
              <div className="field-label">Fecha</div>
              <input type="date" className="field-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
          </div>
          <button className="btn-primary mt-1" onClick={guardar}>
            Guardar gasto
          </button>
        </div>
      </Sheet>
    </div>
  )
}
