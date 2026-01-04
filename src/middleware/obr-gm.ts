import { StateCreator } from 'zustand';
import OBR from '@owlbear-rodeo/sdk';
import { METADATA_KEYS } from '@/constants';
import { GmState } from '@/stores/gmStore';
import { HeroLite } from '@/models/hero-lite';

export const obrGm = <T extends GmState>(
    f: StateCreator<T, [], []>,
): StateCreator<T, [], []> => (set, get, api) => {
        function handlePlayerUpdates() {
            OBR.party.onChange((players) => {
                const allPlayerCharacters = Object.fromEntries(players.map((player) => {
                    return [player.id, (player.metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite[] || []).map(HeroLite.fromHeroLiteInterface)];
                }).filter(metadata => metadata[1].length != 0));
                set({ players, playerCharacters: allPlayerCharacters } as Partial<T>);
            });
        }
        const predicate = () => isHydrated;
        let isHydrated = false;

        OBR.onReady(async () => {
            OBR.scene.isReady().then((isReady) => {
                if (!isReady) {
                    OBR.scene.onReadyChange((sceneReady) => {
                        if (!sceneReady) return;
                        handlePlayerUpdates();
                    });
                } else {
                    handlePlayerUpdates();
                }
            });

            const players = await OBR.party.getPlayers();
            const allPlayerCharacters = Object.fromEntries(players.map((player) => {
                return [player.id, (player.metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite[] || []).map(HeroLite.fromHeroLiteInterface)];
            }).filter(metadata => metadata[1].length != 0));
            set({ players, playerCharacters: allPlayerCharacters } as Partial<T>);
            isHydrated = true;
        });

        return f(
            (args) => {
                set(args);
                new Promise<void>((resolve) => {
                    if (predicate()) return resolve();

                    const timer = setInterval(() => {
                        if (predicate()) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                }).then(() => {
                    const { playerCharacters } = get();
                    const updates = Object.values(playerCharacters).flat()
                        .filter((c) => c.tokenId != '')
                        .map((c) => ({ [c.tokenId]: c }))
                        .reduce((prevVal: Record<string, HeroLite>, newVal: Record<string, HeroLite>) => Object.assign(prevVal, newVal), {} as Record<string, HeroLite>);

                    OBR.scene.items.updateItems(Object.keys(updates), (items) => {
                        items.forEach((item) => {
                            item.metadata[METADATA_KEYS.CHARACTER_DATA] = updates[item.id];
                        });
                    });
                });
            },
            get,
            api
        );
    };

