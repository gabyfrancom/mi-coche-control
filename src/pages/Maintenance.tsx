import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVehicleMaintenance } from '../utils/useVehicleMaintenance'
import TopBar from '../components/TopBar'
import { Icon } from '../components/Icon'
import { statusColor } from '../utils/status'
import type { MaintenanceStatus } from '../types'

type Filter = 'todos' | MaintenanceStatus

export default function MaintenancePage() {
  const { rows, counts } = useVehicleMaintenance()
  const [filter, setFilter] = useState<Filter>('todos')

  const filtered = filter === 'todos' ? rows : rows.filter((r) => r.computed.status === filter)

  return (
    <div className="flex flex-col gap-3.5 pb-4">
      <TopBar title="Mantenimiento" />

      <div className="px-5 flex gap-2 overflow-x-auto no-scrollbar">
        <FilterChip active={filter === 'todos'} onClick={() => setFilter('todos')} label={`Todos · ${rows.length}`} />
        <FilterChip active={filter === 'verde'} onClick={() => setFilter('verde')} label={`Al dia · ${counts.verde}`} colorClass="text-status-green" />
        <FilterChip active={filter === 'amarillo'} onClick={() => setFilter('amarillo')} label={`Proximos · ${counts.amarillo}`} colorClass="text-status-yellow" />
        <FilterChip active={filter === 'rojo'} onClick={() => setFilter('rojo')} label={`Vencido · ${counts.rojo}`} colorClass="text-status-red" />
      </div>

      <div className="px-5 flex flex-col gap-2.5">
        {filtered.map(({ type, computed }) => {
          const c = statusColor(computed.status)
          return (
            <Link key={type.id} to={`/mantenimiento/${type.id}`} className="flex items-center gap-3 card px-3.5 py-3">
              <div className={`w-[42px] h-[42px] rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0 ${c.text}`}>
                <Icon name="wrench" size={19} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13.5px] text-violet-900 dark:text-violet-50 truncate">{type.nombre}</div>
                <div className="text-[11.5px] text-violet-400 dark:text-violet-300/70 mt-0.5 truncate">{computed.mensaje}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                <Icon name="chevronRight" size={15} className="text-violet-300 dark:text-violet-500" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, label, colorClass }: { active: boolean; onClick: () => void; label: string; colorClass?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-[11px] text-[12.5px] font-medium whitespace-nowrap ${
        active ? 'bg-violet-300 text-white font-semibold' : `card ${colorClass ?? 'text-violet-400 dark:text-violet-300/80'}`
      }`}
    >
      {label}
    </button>
  )
}
