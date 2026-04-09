import { METADATA_KEYS } from '@/constants';
import { RoomState } from '@/stores/roomStore';
import OBR from '@owlbear-rodeo/sdk';
import { StateCreator } from 'zustand';

export const obrRoom =
    <T extends RoomState>(f: StateCreator<T, [], []>): StateCreator<T, [], []> =>
    (set, get, api) => {
        function handleRoomUpdates() {
            // @ts-ignore
            if (api.__ZUSTAND_OBR_ROOM_UNSUB__) {
                // @ts-ignore
                api.__ZUSTAND_OBR_ROOM_UNSUB__();
            }
            // @ts-ignore
            api.__ZUSTAND_OBR_ROOM_UNSUB__ = OBR.room.onMetadataChange((metadata) => {
                const { heroTokens } = (metadata[METADATA_KEYS.HERO_TOKEN_DATA] as {
                    heroTokens: number;
                }) || { heroTokens: 0 };
                set({ heroTokens } as Partial<T>);
            });
        }

        OBR.onReady(async () => {
            const metadata = await OBR.room.getMetadata();
            const { heroTokens } = (metadata[METADATA_KEYS.HERO_TOKEN_DATA] as {
                heroTokens: number;
            }) || { heroTokens: 0 };
            set({ heroTokens } as Partial<T>);

            handleRoomUpdates();
        });

        return f(
            async (args) => {
                set(args);
                const { heroTokens } = get();
                // @ts-ignore
                if (api.__ZUSTAND_OBR_ROOM_STORAGE_DEBOUNCE__) {
                    // @ts-ignore
                    clearTimeout(api.__ZUSTAND_OBR_ROOM_STORAGE_DEBOUNCE__);
                }

                // @ts-ignore
                api.__ZUSTAND_OBR_ROOM_STORAGE_DEBOUNCE__ = setTimeout(async () => {
                    await OBR.room.setMetadata({
                        [METADATA_KEYS.HERO_TOKEN_DATA]: {
                            heroTokens: heroTokens,
                        },
                    });
                }, 150);
            },
            get,
            api
        );
    };
