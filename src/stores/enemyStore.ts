import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { obrEnemy } from '@/middleware/obr-enemy';

export interface EnemyState {
    enemyGroups: Record<string, string[]>;
    groupNames: Record<string, string>;
    setGroupName: (groupId: string, name: string) => void;
    addGroup: (groupId: string, tokenIds: string[]) => void;
    removeGroup: (groupId: string) => void;
    clearGroups: () => void;
    removeTokens: (tokenIds: string[]) => void;
}

export const useEnemyStore = create<EnemyState>()(
    persist(
        obrEnemy((set) => ({
            enemyGroups: {},
            groupNames: {},
            setGroupName: (groupId, name) =>
                set((state) => ({
                    groupNames: { ...state.groupNames, [groupId]: name },
                })),
            addGroup: (groupId, tokenIds) =>
                set((state) => ({
                    enemyGroups: { ...state.enemyGroups, [groupId]: tokenIds },
                })),
            removeGroup: (groupId) =>
                set((state) => {
                    const newGroups = { ...state.enemyGroups };
                    const newNames = { ...state.groupNames };
                    delete newGroups[groupId];
                    delete newNames[groupId];
                    return { enemyGroups: newGroups, groupNames: newNames };
                }),
            clearGroups: () => set({ enemyGroups: {}, groupNames: {} }),
            removeTokens: (tokenIds) =>
                set((state) => {
                    let changed = false;
                    const newGroups = { ...state.enemyGroups };
                    const newNames = { ...state.groupNames };
                    for (const [groupId, tokens] of Object.entries(newGroups)) {
                        const filtered = tokens.filter((id) => !tokenIds.includes(id));
                        if (filtered.length !== tokens.length) {
                            changed = true;
                            if (filtered.length === 0) {
                                delete newGroups[groupId];
                                delete newNames[groupId];
                            } else {
                                newGroups[groupId] = filtered;
                            }
                        }
                    }
                    console.log(changed, newGroups);
                    return changed ? { enemyGroups: newGroups, groupNames: newNames } : state;
                }),
        })),
        { name: 'draw-steel-enemy-groups' }
    )
);
