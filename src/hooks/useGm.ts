import { useMemo } from 'react';
import { useGmStore } from '@/stores/gmStore';

export function useGm() {
    const storeMalice = useGmStore((state) => state.malice);
    const malice = useMemo(() => storeMalice, [storeMalice]);
    const storePlayerCharacters = useGmStore((state) => state.playerCharacters);
    const playerCharacters = useMemo(() => storePlayerCharacters, [storePlayerCharacters]);
    const incrementMalice = useGmStore((state) => state.incrementMalice);
    const decrementMalice = useGmStore((state) => state.decrementMalice);
    const setMalice = useGmStore((state) => state.setMalice);
    const getPlayerCharacters = useGmStore((state) => state.getPlayerCharacters);
    const setPlayerCharacters = useGmStore((state) => state.setPlayerCharacters);

    return {
        malice,
        playerCharacters,
        incrementMalice,
        decrementMalice,
        setMalice,
        getPlayerCharacters,
        setPlayerCharacters,
    };
}
