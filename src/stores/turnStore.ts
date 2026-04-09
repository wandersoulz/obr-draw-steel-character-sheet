import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActionType = 'main' | 'maneuver' | 'move' | 'triggered';

interface TurnState {
    actions: Record<string, Record<ActionType, boolean>>;
    toggleAction: (tokenId: string, actionType: ActionType) => void;
    resetActions: (tokenId: string) => void;
    resetTriggered: (tokenId: string) => void;
}

export const useTurnStore = create<TurnState>()(
    persist(
        (set) => ({
            actions: {},
            toggleAction: (tokenId, actionType) =>
                set((state) => {
                    const current = state.actions[tokenId] || {
                        main: false,
                        maneuver: false,
                        move: false,
                        triggered: false,
                    };
                    return {
                        actions: {
                            ...state.actions,
                            [tokenId]: {
                                ...current,
                                [actionType]: !current[actionType],
                            },
                        },
                    };
                }),
            resetActions: (tokenId) =>
                set((state) => ({
                    actions: {
                        ...state.actions,
                        [tokenId]: {
                            main: false,
                            maneuver: false,
                            move: false,
                            triggered: false,
                        },
                    },
                })),
            resetTriggered: (tokenId) =>
                set((state) => {
                    const current = state.actions[tokenId];
                    if (!current || !current.triggered) return state;
                    return {
                        actions: {
                            ...state.actions,
                            [tokenId]: {
                                ...current,
                                triggered: false,
                            },
                        },
                    };
                }),
        }),
        { name: 'draw-steel-turn-actions' }
    )
);
