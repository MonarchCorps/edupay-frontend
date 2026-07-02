import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api/auth';
import { USE_MOCK } from '../utils/constants';

export function useMe() {
    return useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        staleTime: 60_000,
        // Mock mode never signs in for real — there's no session to ask about.
        enabled: !USE_MOCK,
    });
}
