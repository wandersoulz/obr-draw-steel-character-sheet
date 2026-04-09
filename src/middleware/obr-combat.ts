import { METADATA_KEYS } from '@/constants';
import { CombatState } from '@/stores/combatStore';
import OBR from '@owlbear-rodeo/sdk';
import { StateCreator } from 'zustand';

export const obrCombat =
    <T extends CombatState>(f: StateCreator<T, [], []>): StateCreator<T, [], []> =>
    (set, get, api) => {
        function handleRoomUpdates() {
            // @ts-ignore
            if (api.__ZUSTAND_OBR_COMBAT_UNSUB__) {
                // @ts-ignore
                api.__ZUSTAND_OBR_COMBAT_UNSUB__();
            }
            // @ts-ignore
            api.__ZUSTAND_OBR_COMBAT_UNSUB__ = OBR.room.onMetadataChange((metadata) => {
                const combatData = (metadata[METADATA_KEYS.COMBAT_DATA] as Partial<T>) || {};
                set(combatData);
            });
        }

        OBR.onReady(async () => {
            const metadata = await OBR.room.getMetadata();
            const combatData = (metadata[METADATA_KEYS.COMBAT_DATA] as Partial<T>) || {};
            set(combatData);

            handleRoomUpdates();
        });

        return f(
            async (args) => {
                set(args);
                const {
                    inCombat,
                    initiative,
                    playersActed,
                    enemiesActed,
                    round,
                    numPlayers,
                    numEnemyGroups,
                } = get();
                // @ts-ignore
                if (api.__ZUSTAND_OBR_ROOM_STORAGE_DEBOUNCE__) {
                    // @ts-ignore
                    clearTimeout(api.__ZUSTAND_OBR_ROOM_STORAGE_DEBOUNCE__);
                }

                // @ts-ignore
                api.__ZUSTAND_OBR_ROOM_STORAGE_DEBOUNCE__ = setTimeout(async () => {
                    await OBR.room.setMetadata({
                        [METADATA_KEYS.COMBAT_DATA]: {
                            inCombat,
                            initiative,
                            playersActed,
                            enemiesActed,
                            round,
                            numPlayers,
                            numEnemyGroups,
                        },
                    });
                }, 150);
            },
            get,
            api
        );
    };
