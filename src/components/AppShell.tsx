import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Icon, type IconName } from './Icon'

const tabs: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/vehiculo', label: 'Vehiculo', icon: 'car' },
  { to: '/mantenimiento', label: 'Mantenim.', icon: 'wrench' },
  { to: '/gastos', label: 'Gastos', icon: 'chart' },
  { to: '/perfil', label: 'Perfil', icon: 'user' }
]

export default function AppShell() {
  return (
    <div className="min-h-dvh flex flex-col items-center bg-violet-50 dark:bg-violet-950">
      <div className="relative flex flex-col w-full max-w-md min-h-dvh bg-violet-50 dark:bg-violet-950 font-body">
        <main className="flex-1 overflow-y-auto pb-24">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex items-center justify-around px-3 pt-2 pb-6 bg-white dark:bg-violet-900 border-t border-violet-100 dark:border-violet-800/60 z-30">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 ${isActive ? 'text-violet-500 dark:text-violet-100' : 'text-violet-300/70 dark:text-violet-400/70'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={tab.icon} size={21} strokeWidth={isActive ? 1.9 : 1.6} />
                  <span className={`text-[10px] ${isActive ? 'font-semibold' : ''}`}>{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
