import { useEffect } from 'react';
import OBR from '@owlbear-rodeo/sdk';
import { usePartyStore } from '@/stores/partyStore';
import { CHARACTER_UPDATE_CHANNEL } from '@/constants';
import { HeroLite } from '@/models/hero-lite';

export function useParty() {
    const { setPlayers, setPlayerCharacters } = usePartyStore();

    useEffect(() => {
        OBR.party.getPlayers().then(setPlayers);
        const unsubscribeParty = OBR.party.onChange(setPlayers);

        const unsubscribeBroadcast = OBR.broadcast.onMessage(CHARACTER_UPDATE_CHANNEL, (message) => {
            const { playerId, characters } = message.data as { playerId: string, characters: HeroLite[], request?: boolean };
            if (playerId && characters) {
                setPlayerCharacters(playerId, characters);
            }
        });

        return () => {
            unsubscribeParty();
            unsubscribeBroadcast();
        };
    }, []);
}
