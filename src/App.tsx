import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './context/ToastContext';
import { EnvironmentProvider } from './context/EnvironmentContext';
import { AppShell } from './components/layout/AppShell';
import type { ApiError } from './types';

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: ApiError;
    }
}

const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Accounts = lazy(() => import('./pages/Accounts'));
const AccountDetail = lazy(() => import('./pages/AccountDetail'));
const Transactions = lazy(() => import('./pages/Transactions'));
const WebhookEvents = lazy(() => import('./pages/WebhookEvents'));
const ApiDocs = lazy(() => import('./pages/ApiDocs'));
const Settings = lazy(() => import('./pages/Settings'));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function PageFallback() {
    return (
        <div className="space-y-4">
            <div className="h-8 bg-teal-mid/10 rounded w-48 animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-24 bg-teal-mid/5 rounded-tremor-default animate-pulse"
                    />
                ))}
            </div>
            <div className="h-64 bg-teal-mid/5 rounded-tremor-default animate-pulse" />
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <EnvironmentProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/onboarding"
                                element={
                                    <Suspense
                                        fallback={
                                            <div className="min-h-screen bg-paper" />
                                        }
                                    >
                                        <Onboarding />
                                    </Suspense>
                                }
                            />
                            <Route path="/" element={<AppShell />}>
                                <Route
                                    index
                                    element={
                                        <Suspense fallback={<PageFallback />}>
                                            <Dashboard />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="accounts"
                                    element={
                                        <Suspense fallback={<PageFallback />}>
                                            <Accounts />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="accounts/:id"
                                    element={
                                        <Suspense fallback={<PageFallback />}>
                                            <AccountDetail />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="transactions"
                                    element={
                                        <Suspense fallback={<PageFallback />}>
                                            <Transactions />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="webhooks"
                                    element={
                                        <Suspense fallback={<PageFallback />}>
                                            <WebhookEvents />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="docs"
                                    element={
                                        <Suspense fallback={<PageFallback />}>
                                            <ApiDocs />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="settings"
                                    element={
                                        <Suspense fallback={<PageFallback />}>
                                            <Settings />
                                        </Suspense>
                                    }
                                />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ToastProvider>
            </EnvironmentProvider>
        </QueryClientProvider>
    );
}
