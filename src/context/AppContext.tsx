import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type {
  AppSettings,
  Expense,
  Insurance,
  ItvRecord,
  KmUpdate,
  MaintenanceRecord,
  RoadsideContacts,
  TireSet,
  Vehicle
} from '../types'
import { loadData, saveData, type AppData } from '../store/storage'
import { seedData } from '../store/seed'
import { uid } from '../utils/id'

type Action =
  | { type: 'ADD_VEHICLE'; vehicle: Vehicle }
  | { type: 'UPDATE_VEHICLE'; vehicle: Vehicle }
  | { type: 'DELETE_VEHICLE'; id: string }
  | { type: 'SET_ACTIVE_VEHICLE'; id: string }
  | { type: 'ADD_KM_UPDATE'; update: KmUpdate }
  | { type: 'UPSERT_MAINTENANCE'; record: MaintenanceRecord }
  | { type: 'ADD_EXPENSE'; expense: Expense }
  | { type: 'DELETE_EXPENSE'; id: string }
  | { type: 'UPSERT_INSURANCE'; insurance: Insurance }
  | { type: 'ADD_ITV'; record: ItvRecord }
  | { type: 'UPSERT_TIRES'; tires: TireSet }
  | { type: 'UPSERT_CONTACTS'; contacts: RoadsideContacts }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.vehicle], activeVehicleId: action.vehicle.id }
    case 'UPDATE_VEHICLE':
      return { ...state, vehicles: state.vehicles.map((v) => (v.id === action.vehicle.id ? action.vehicle : v)) }
    case 'DELETE_VEHICLE': {
      const vehicles = state.vehicles.filter((v) => v.id !== action.id)
      return { ...state, vehicles, activeVehicleId: vehicles[0]?.id ?? null }
    }
    case 'SET_ACTIVE_VEHICLE':
      return { ...state, activeVehicleId: action.id }
    case 'ADD_KM_UPDATE': {
      const vehicles = state.vehicles.map((v) =>
        v.id === action.update.vehicleId && action.update.km > v.kmActuales ? { ...v, kmActuales: action.update.km } : v
      )
      return { ...state, kmUpdates: [...state.kmUpdates, action.update], vehicles }
    }
    case 'UPSERT_MAINTENANCE': {
      const exists = state.maintenanceRecords.some((r) => r.id === action.record.id)
      return {
        ...state,
        maintenanceRecords: exists
          ? state.maintenanceRecords.map((r) => (r.id === action.record.id ? action.record : r))
          : [...state.maintenanceRecords, action.record]
      }
    }
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.expense] }
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.id) }
    case 'UPSERT_INSURANCE': {
      const others = state.insurances.filter((i) => i.vehicleId !== action.insurance.vehicleId)
      return { ...state, insurances: [...others, action.insurance] }
    }
    case 'ADD_ITV':
      return { ...state, itvRecords: [...state.itvRecords, action.record] }
    case 'UPSERT_TIRES': {
      const others = state.tireSets.filter((t) => t.vehicleId !== action.tires.vehicleId)
      return { ...state, tireSets: [...others, action.tires] }
    }
    case 'UPSERT_CONTACTS': {
      const others = state.roadsideContacts.filter((c) => c.vehicleId !== action.contacts.vehicleId)
      return { ...state, roadsideContacts: [...others, action.contacts] }
    }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } }
    default:
      return state
  }
}

interface Ctx {
  data: AppData
  dispatch: React.Dispatch<Action>
  activeVehicle: Vehicle | null
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, dispatch] = useReducer(reducer, undefined, () => loadData() ?? seedData())

  useEffect(() => {
    saveData(data)
  }, [data])

  useEffect(() => {
    const root = document.documentElement
    const isDark =
      data.settings.theme === 'dark' ||
      (data.settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
  }, [data.settings.theme])

  const activeVehicle = useMemo(
    () => data.vehicles.find((v) => v.id === data.activeVehicleId) ?? data.vehicles[0] ?? null,
    [data.vehicles, data.activeVehicleId]
  )

  return <AppCtx.Provider value={{ data, dispatch, activeVehicle }}>{children}</AppCtx.Provider>
}

export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}

export { uid }
