import { StateCreator } from 'zustand';
import OBR, { Item } from '@owlbear-rodeo/sdk';
import { EnemyState } from '@/stores/enemyStore';

const ENEMY_GROUP_METADATA_KEY = 'draw-steel-sheet/enemy-group-id';

export const obrEnemy =
    <T extends EnemyState>(f: StateCreator<T, [], []>): StateCreator<T, [], []> =>
    (set, get, api) => {
        function updateGroupsFromItems(items: Item[]) {
            const newGroups: Record<string, string[]> = {};

            for (const item of items) {
                const groupId = item.metadata[ENEMY_GROUP_METADATA_KEY] as string | undefined;
                if (groupId) {
                    if (!newGroups[groupId]) {
                        newGroups[groupId] = [];
                    }
                    // Avoid duplicates
                    if (!newGroups[groupId].includes(item.id)) {
                        newGroups[groupId].push(item.id);
                    }
                }
            }

            const { enemyGroups } = get();
            if (JSON.stringify(enemyGroups) !== JSON.stringify(newGroups)) {
                set({ enemyGroups: newGroups } as Partial<T>);
            }
        }

        OBR.onReady(() => {
            OBR.scene.isReady().then(async (isReady) => {
                if (isReady) {
                    const items = await OBR.scene.items.getItems();
                    updateGroupsFromItems(items);
                }

                OBR.scene.onReadyChange(async (ready) => {
                    if (ready) {
                        const items = await OBR.scene.items.getItems();
                        updateGroupsFromItems(items);
                    }
                });
            });

            OBR.scene.items.onChange(updateGroupsFromItems);
        });

        return f(set, get, api);
    };
