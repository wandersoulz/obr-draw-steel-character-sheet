import { useMemo } from 'react';

export function useQuery() {
    return useMemo<URLSearchParams>(() => new URLSearchParams(window.location.search), []);
}
