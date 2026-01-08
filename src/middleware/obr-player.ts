import { StateCreator } from 'zustand';
import OBR, { Item } from '@owlbear-rodeo/sdk';
import { METADATA_KEYS } from '@/constants';
import { PlayerState } from '@/stores/playerStore';
import { HeroLite } from '@/models/hero-lite';

export const obrPlayer =
    <T extends PlayerState>(f: StateCreator<T, [], []>): StateCreator<T, [], []> =>
    (set, get, api) => {
        function handleItemUpdates() {
            let previousItems: Item[] = [];
            OBR.scene.items.onChange(async (items) => {
                const { characters } = get();
                // Removing character(s) from token
                const prevItemsWithCharacter = previousItems.filter(
                    (i) => !!i.metadata[METADATA_KEYS.CHARACTER_DATA]
                );
                const currentItemsWithCharacter = items.filter(
                    (i) => !!i.metadata[METADATA_KEYS.CHARACTER_DATA]
                );
                if (prevItemsWithCharacter.length != currentItemsWithCharacter.length) {
                    const uniqueCurrentItems = new Set(currentItemsWithCharacter.map((i) => i.id));
                    const removedCharacters = new Set(
                        prevItemsWithCharacter
                            .filter((item) => !uniqueCurrentItems.has(item.id))
                            .map((item) => item.id)
                    );
                    const removedCharactersToUpdate = characters.filter((c) =>
                        removedCharacters.has(c.tokenId)
                    );
                    removedCharactersToUpdate.forEach((c) => {
                        c.tokenId = '';
                    });
                }

                // Deleted token(s) from scene
                if (previousItems.length != items.length) {
                    const uniqueItemIds = new Set(items.map((i) => i.id));
                    const deletedItems = new Set(
                        previousItems
                            .filter((item) => !uniqueItemIds.has(item.id))
                            .map((item) => item.id)
                    );
                    const deletedCharacterTokens = characters.filter((c) =>
                        deletedItems.has(c.tokenId)
                    );
                    deletedCharacterTokens.forEach((c) => {
                        c.tokenId = '';
                    });
                }

                // Handle updating the underlying store and player metadata
                const itemsWithCharacter = items
                    .filter((i) => !!i.metadata[METADATA_KEYS.CHARACTER_DATA])
                    .map((i) => i.metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite);
                const updatedCharacters = characters.map((c) => {
                    const tokenCharacter = itemsWithCharacter.find((u) => u.id == c.id);
                    return tokenCharacter || c;
                });
                OBR.player.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: updatedCharacters });
                set({ characters: updatedCharacters } as Partial<T>);

                previousItems = Array.from(items);
            });
        }

        OBR.onReady(async () => {
            setTimeout(() => {
                OBR.player.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: get().characters });
                handleItemUpdates();
            }, 100);
        });

        return f(
            (args) => {
                set(args);

                const { characters } = get();
                OBR.player.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: characters });
                const updates = characters
                    .filter((c) => c.tokenId != '')
                    .map((c) => ({ [c.tokenId]: c }))
                    .reduce(
                        (prevVal: Record<string, HeroLite>, newVal: Record<string, HeroLite>) =>
                            Object.assign(prevVal, newVal),
                        {} as Record<string, HeroLite>
                    );

                // @ts-ignore
                if (api.__ZUSTAND_OBR_PLAYER_STORAGE_DEBOUNCE__)
                    // @ts-ignore
                    clearTimeout(api.__ZUSTAND_OBR_PLAYER_STORAGE_DEBOUNCE__);

                // @ts-ignore
                api.__ZUSTAND_OBR_PLAYER_STORAGE_DEBOUNCE__ = setTimeout(() => {
                    OBR.scene.items.updateItems(Object.keys(updates), (items) => {
                        items.forEach((item) => {
                            item.metadata[METADATA_KEYS.CHARACTER_DATA] = updates[item.id];
                        });
                    });
                }, 500);
            },
            get,
            api
        );
    };
