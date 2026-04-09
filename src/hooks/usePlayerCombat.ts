import { useEffect, useRef } from 'react';
import { useCombatStore } from '@/stores/combatStore';
import { useTurnStore, ActionType } from '@/stores/turnStore';

export interface PlayerCombatState {
    isMyTurn: boolean;
    hasActed: boolean;
    canStartTurn: boolean;
    turnActions: Record<ActionType, boolean> | Record<string, boolean>;
    takeTurn: (id: string) => void;
    endTurn: (id: string) => void;
    toggleAction: (id: string, action: ActionType) => void;
}

export function usePlayerCombat(tokenId: string | undefined): PlayerCombatState {
    const { initiative, currentActor, playersActed, takeTurn, endTurn, round } = useCombatStore();
    const { toggleAction, resetActions, resetTriggered, actions } = useTurnStore();

    const hasActed = tokenId ? playersActed.includes(tokenId) : false;
    const isMyTurn = tokenId ? currentActor === tokenId : false;
    const turnActions =
        tokenId && actions[tokenId]
            ? actions[tokenId]
            : { main: false, maneuver: false, move: false, triggered: false };

    const canStartTurn = tokenId
        ? initiative === 'heroes' && !hasActed && currentActor === ''
        : false;

    // Use refs initialized to the current state to prevent effects from running
    // redundantly when the component using this hook mounts/remounts.
    const prevRound = useRef(round);
    const prevIsMyTurn = useRef(isMyTurn);

    useEffect(() => {
        if (!tokenId) return;

        // Only trigger a reset if it just became this player's turn
        if (isMyTurn && !prevIsMyTurn.current) {
            resetActions(tokenId);
        }
        prevIsMyTurn.current = isMyTurn;
    }, [isMyTurn, tokenId, resetActions]);

    useEffect(() => {
        if (!tokenId) return;

        // Only trigger a reset if the round actually changed
        if (round !== prevRound.current) {
            resetTriggered(tokenId);
        }
        prevRound.current = round;
    }, [round, tokenId, resetTriggered]);

    return {
        hasActed,
        isMyTurn,
        canStartTurn,
        turnActions,
        takeTurn,
        endTurn,
        toggleAction,
    };
}