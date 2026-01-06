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
                const { heroTokens, userId } = metadata[METADATA_KEYS.TOKEN_DATA] as {
                    heroTokens: number;
                    userId: string;
                };
                if (userId == OBR.player.id) return;
                set({ heroTokens } as Partial<T>);
            });
        }

        OBR.onReady(async () => {
            const metadata = await OBR.room.getMetadata();
            const { heroTokens } = metadata[METADATA_KEYS.TOKEN_DATA] as {
                heroTokens: number;
                userId: string;
            };
            set({ heroTokens } as Partial<T>);

            handleRoomUpdates();
        });

        return f(
            (args) => {
                set(args);
                const { heroTokens } = get();
                // @ts-ignore
                if (api.__ZUSTAND_OBR_ROOM_STORAGE_DEBOUNCE__) {
                    // @ts-ignore
                    clearTimeout(api.__ZUSTAND_OBR_ROOM_STORAGE_DEBOUNCE__);
                }

                // @ts-ignore
                api.__ZUSTAND_OBR_ROOM_STORAGE_DEBOUNCE__ = setTimeout(() => {
                    console.log('setting metadata');
                    OBR.room.setMetadata({
                        [METADATA_KEYS.TOKEN_DATA]: {
                            heroTokens: heroTokens,
                            userId: OBR.player.id,
                        },
                    });
                }, 400);
            },
            get,
            api
        );
    };
