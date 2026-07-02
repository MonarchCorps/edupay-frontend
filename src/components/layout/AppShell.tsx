import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { getStoredApiKey, getActiveMode } from '../../api/auth';
import { USE_MOCK } from '../../utils/constants';

export function AppShell() {
    const [mobileOpen, setMobileOpen] = useState(false);

    // In live mode, require an API key for the active mode — send
    // unauthenticated visitors to onboarding
    if (!USE_MOCK && !getStoredApiKey(getActiveMode())) {
        return <Navigate to="/onboarding" replace />;
    }

    return (
        <div className="min-h-screen bg-paper">
            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <div className="md:ml-60 flex flex-col min-h-screen">
                <Topbar onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
