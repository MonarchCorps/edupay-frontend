import { useContext } from 'react';
import { EnvironmentContext } from '../context/EnvironmentContext';

export function useEnvironment() {
    const ctx = useContext(EnvironmentContext);
    if (!ctx)
        throw new Error('useEnvironment must be used within EnvironmentProvider');
    return ctx;
}
