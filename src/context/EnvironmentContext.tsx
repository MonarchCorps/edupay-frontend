import { createContext, useCallback, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getActiveMode, setActiveMode } from '../utils/environment';
import type { Environment } from '../types';

interface EnvironmentContextValue {
    mode: Environment;
    setMode: (mode: Environment) => void;
    toggleMode: () => void;
}

export const EnvironmentContext = createContext<EnvironmentContextValue | null>(
    null,
);

interface EnvironmentProviderProps {
    children: ReactNode;
}

export function EnvironmentProvider({ children }: EnvironmentProviderProps) {
    const [mode, setModeState] = useState<Environment>(getActiveMode);
    const queryClient = useQueryClient();

    const setMode = useCallback(
        (next: Environment) => {
            setActiveMode(next);
            setModeState(next);
            // Every account/transaction/dashboard query is scoped to whichever
            // key is active — refetch everything under the newly active key.
            queryClient.invalidateQueries();
        },
        [queryClient],
    );

    const toggleMode = useCallback(() => {
        setMode(mode === 'sandbox' ? 'live' : 'sandbox');
    }, [mode, setMode]);

    return (
        <EnvironmentContext.Provider value={{ mode, setMode, toggleMode }}>
            {children}
        </EnvironmentContext.Provider>
    );
}
