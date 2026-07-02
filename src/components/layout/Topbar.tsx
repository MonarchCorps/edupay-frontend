import { useLocation } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { NAV_ITEMS } from '../../utils/constants';
import { useEnvironment } from '../../hooks/useEnvironment';
import { useMe } from '../../hooks/useAuth';

function getPageTitle(pathname: string): string {
    const match = NAV_ITEMS.find((item) =>
        item.path === '/' ? pathname === '/' : pathname.startsWith(item.path),
    );
    return match?.label ?? 'EduPay';
}

function getInitials(name: string | undefined): string {
    if (!name) return 'EP';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'EP';
    return parts
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

interface TopbarProps {
    onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
    const { pathname } = useLocation();
    const title = getPageTitle(pathname);
    const { mode, toggleMode } = useEnvironment();
    const { data: merchant } = useMe();

    return (
        <header className="sticky top-0 z-40 bg-[#FAF7F0] border-b border-teal-mid/10 h-14 flex items-center px-4 md:px-6 gap-4">
            <button
                className="md:hidden text-teal-mid/60 hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-accent-gold rounded p-1 transition-colors"
                onClick={onMenuClick}
                aria-label="Open navigation menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            <span className="font-semibold text-brand-dark text-sm flex-1 truncate">
                {title}
            </span>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={toggleMode}
                    title="Switch between sandbox and live mode"
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-accent-gold ${
                        mode === 'live'
                            ? 'bg-success/15 text-success border-success/30 hover:bg-success/25'
                            : 'bg-accent-gold/20 text-[#8A6423] border-accent-gold/30 hover:bg-accent-gold/30'
                    }`}
                >
                    {mode === 'live' ? 'Live' : 'Sandbox'}
                </button>

                <button
                    className="text-teal-mid/40 hover:text-teal-mid focus-visible:ring-2 focus-visible:ring-accent-gold rounded p-1 transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" />
                </button>

                <div
                    className="w-8 h-8 rounded-full bg-brand-mid flex items-center justify-center text-paper text-xs font-bold flex-shrink-0"
                    aria-label="User avatar"
                    title={merchant?.name}
                >
                    {getInitials(merchant?.name)}
                </div>
            </div>
        </header>
    );
}
