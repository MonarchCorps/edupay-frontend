import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { NAV_ITEMS } from '../../utils/constants';
import { Logo } from '../ui/Logo';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavIconProps {
    name: string;
}

function NavIcon({ name }: NavIconProps) {
    const Icon = (Icons as unknown as Record<string, LucideIcon | undefined>)[
        name
    ];
    return Icon ? <Icon className="w-5 h-5 flex-shrink-0" /> : null;
}

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const mainItems = NAV_ITEMS.filter((i) => !i.bottom);
    const bottomItems = NAV_ITEMS.filter((i) => i.bottom);

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={clsx(
                    'fixed top-0 left-0 h-full w-60 bg-brand-dark flex flex-col z-40 transition-transform duration-300',
                    mobileOpen
                        ? 'translate-x-0'
                        : '-translate-x-full md:translate-x-0',
                )}
            >
                <div className="px-5 py-6 flex items-center flex-shrink-0">
                    <Logo size={28} className="text-white" />
                </div>

                <nav className="flex-1 px-3 pb-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {mainItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/'}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        clsx(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-tremor-small text-sm font-medium transition-colors',
                                            isActive
                                                ? 'text-accent bg-brand-mid border-l-[3px] border-accent pl-[9px]'
                                                : 'text-white/60 hover:text-white hover:bg-brand-mid',
                                        )
                                    }
                                >
                                    <NavIcon name={item.icon} />
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="px-3 pb-6 border-t border-white/10 pt-4">
                    {bottomItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-tremor-small text-sm font-medium transition-colors',
                                    isActive
                                        ? 'text-accent bg-brand-mid border-l-[3px] border-accent pl-[9px]'
                                        : 'text-white/60 hover:text-white hover:bg-brand-mid',
                                )
                            }
                        >
                            <NavIcon name={item.icon} />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </aside>
        </>
    );
}
