import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { getStoredApiKey } from '../../api/auth'
import { USE_MOCK } from '../../utils/constants'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // In live mode, require an API key — send unauthenticated visitors to onboarding
  if (!USE_MOCK && !getStoredApiKey()) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="md:ml-60 flex flex-col min-h-screen">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
