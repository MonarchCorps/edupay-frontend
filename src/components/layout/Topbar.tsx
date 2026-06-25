import { useLocation } from 'react-router-dom'
import { Badge } from '@tremor/react'
import { Bell, Menu } from 'lucide-react'
import { NAV_ITEMS } from '../../utils/constants'

function getPageTitle(pathname: string): string {
  const match = NAV_ITEMS.find((item) =>
    item.path === '/'
      ? pathname === '/'
      : pathname.startsWith(item.path)
  )
  return match?.label ?? 'EduPay'
}

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-4">
      <button
        className="md:hidden text-gray-500 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-accent rounded p-1"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <span className="font-semibold text-brand-dark text-sm flex-1 truncate">{title}</span>

      <div className="flex items-center gap-3">
        <Badge color="yellow" size="sm">Sandbox</Badge>

        <button
          className="text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-accent rounded p-1"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div
          className="w-8 h-8 rounded-full bg-brand-mid flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          aria-label="User avatar"
        >
          DK
        </div>
      </div>
    </header>
  )
}
