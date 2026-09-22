import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AppProvider } from './context/AppContext'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import VehiclePage from './pages/Vehicle'
import MaintenancePage from './pages/Maintenance'
import MaintenanceDetail from './pages/MaintenanceDetail'
import ExpensesPage from './pages/Expenses'
import ProfilePage from './pages/Profile'
import InsurancePage from './pages/Insurance'
import RoadsidePage from './pages/Roadside'
import OnboardingPage from './pages/Onboarding'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehiculo" element={<VehiclePage />} />
            <Route path="/vehiculo/nuevo" element={<OnboardingPage />} />
            <Route path="/mantenimiento" element={<MaintenancePage />} />
            <Route path="/mantenimiento/:typeId" element={<MaintenanceDetail />} />
            <Route path="/gastos" element={<ExpensesPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/seguro" element={<InsurancePage />} />
            <Route path="/asistencia" element={<RoadsidePage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  </React.StrictMode>
)
