import { StateCreator } from 'zustand';
import OBR from '@owlbear-rodeo/sdk';
import { METADATA_KEYS } from '@/constants';
import { PlayerState } from '@/stores/playerStore';
import { HeroLite } from '@/models/hero-lite';
import { TokenData } from '@/models/token-data';

export const obrPlayer =
    <T extends PlayerState>(f: StateCreator<T, [], []>): StateCreator<T, [], []> =>
    (set, get, api) => {
        function handleItemUpdates() {
            OBR.scene.items.onChange(async (items) => {
                // @ts-ignore - Skip incoming sync if we have pending local changes to prevent rubberbanding
                if (api.__ZUSTAND_OBR_PLAYER_IS_UPDATING__) return;

                const { characters } = get();

                // 1. Find all scene items that currently contain character data
                const itemsWithCharacter = items.filter(
                    (i) => !!i.metadata[METADATA_KEYS.CHARACTER_DATA]
                );

                // 2. Extract valid token IDs and the latest character data from those items
                const validTokenIds = new Set(itemsWithCharacter.map((i) => i.id));
                const activeTokenCharacters = itemsWithCharacter.map((i) => ({
                    ...(i.metadata[METADATA_KEYS.CHARACTER_DATA] as TokenData),
                    tokenId: i.id,
                }));

                // 3. Sync local characters with the latest token state
                const updatedCharacters = characters.map((c) => {
                    let nextChar: Partial<HeroLite> = c;
                    // Unlink the character if its token was deleted or no longer has metadata
                    if (nextChar.tokenId && !validTokenIds.has(nextChar.tokenId)) {
                        // Avoid mutating state directly (Zustand anti-pattern)
                        nextChar = { ...nextChar, tokenId: '' };
                    }
                    // Prefer the token's character data if it exists, otherwise keep our local copy
                    const tokenCharacter = activeTokenCharacters.find((tc) => tc.id == nextChar.id);
                    if (tokenCharacter) {
                        nextChar = {
                            ...nextChar,
                            tokenId: tokenCharacter.tokenId,
                            name: tokenCharacter.name,
                            maxStamina: tokenCharacter.maxStamina,
                            state: {
                                ...nextChar.state!,
                                staminaDamage: tokenCharacter.maxStamina - tokenCharacter.stamina,
                            },
                        };
                    }
                    return nextChar;
                });

                // 4. Handle updating the underlying store and player metadata
                // Only process updates if characters actually changed to avoid network spam and infinite loops
                if (JSON.stringify(characters) !== JSON.stringify(updatedCharacters)) {
                    OBR.player.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: updatedCharacters });
                    set({ characters: updatedCharacters } as Partial<T>);
                }
            });
        }

        OBR.onReady(async () => {
            setTimeout(async () => {
                const playerId = await OBR.player.getId();
                OBR.player.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: get().characters });
                set({ playerId } as Partial<T>);
                handleItemUpdates();
            }, 100);
        });

        return f(
            async (args) => {
                set(args);

                const { characters } = get();
                await OBR.player.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: characters });
                const updates = characters
                    .filter((c) => c.tokenId != '')
                    .map((c) => ({
                        [c.tokenId]: {
                            id: c.id,
                            name: c.name,
                            stamina: c.maxStamina - c.state.staminaDamage,
                            maxStamina: c.maxStamina,
                        } as TokenData,
                    }))
                    .reduce(
                        (prevVal: Record<string, TokenData>, newVal: Record<string, TokenData>) =>
                            Object.assign(prevVal, newVal),
                        {} as Record<string, TokenData>
                    );

                // @ts-ignore
                if (api.__ZUSTAND_OBR_PLAYER_STORAGE_DEBOUNCE__)
                    // @ts-ignore
                    clearTimeout(api.__ZUSTAND_OBR_PLAYER_STORAGE_DEBOUNCE__);

                // @ts-ignore
                api.__ZUSTAND_OBR_PLAYER_IS_UPDATING__ = true;

                // @ts-ignore
                api.__ZUSTAND_OBR_PLAYER_STORAGE_DEBOUNCE__ = setTimeout(async () => {
                    await OBR.scene.items.updateItems(Object.keys(updates), (items) => {
                        items.forEach((item) => {
                            if (updates[item.id]) {
                                item.metadata[METADATA_KEYS.CHARACTER_DATA] = updates[item.id];
                            }
                        });
                    });
                    // @ts-ignore
                    api.__ZUSTAND_OBR_PLAYER_IS_UPDATING__ = false;
                }, 150);
            },
            get,
            api
        );
    };
