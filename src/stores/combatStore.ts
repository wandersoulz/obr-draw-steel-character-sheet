import { obrCombat } from '@/middleware/obr-combat';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Initiative = 'no-combat' | 'heroes' | 'enemies';

export interface CombatState {
    inCombat: boolean;
    initiative: Initiative;
    initialInitiative: Initiative;
    currentActor: string;
    numPlayers: number;
    numEnemyGroups: number;
    playersActed: string[]; // List of player ids that have acted
    enemiesActed: string[]; // List of enemy token/group id that have acted
    round: number;
    startCombat: (initiative: Initiative, numPlayers: number, numEnemyGroups: number) => void;
    endCombat: () => void;
    takeTurn: (actorId: string) => void;
    endTurn: (actorId: string) => void;
}

const storeInit = persist<CombatState>(
    obrCombat((set) => ({
        inCombat: false,
        initiative: 'no-combat',
        initialInitiative: 'heroes',
        currentActor: '',
        playersActed: [],
        enemiesActed: [],
        round: 0,
        numPlayers: 0,
        numEnemyGroups: 0,
        startCombat: (initiative: Initiative, numPlayers: number, numEnemyGroups: number) => {
            set({
                inCombat: true,
                initiative,
                currentActor: '',
                numPlayers,
                numEnemyGroups,
                initialInitiative: initiative,
                playersActed: [],
                enemiesActed: [],
                round: 0,
            });
        },
        endCombat: () => {
            set({
                initiative: 'no-combat',
            });
        },
        takeTurn: (actorId: string) => set({ currentActor: actorId }),
        endTurn: (actorId: string) =>
            set((state) => {
                const {
                    round,
                    initiative,
                    initialInitiative,
                    numPlayers,
                    numEnemyGroups,
                    playersActed,
                    enemiesActed,
                } = state;

                const newPlayersActed = [...playersActed];
                const newEnemiesActed = [...enemiesActed];
                // One line to add the actor to the players or enemies array
                initiative == 'heroes'
                    ? newPlayersActed.push(actorId)
                    : newEnemiesActed.push(actorId);

                const totalTurns = numPlayers + numEnemyGroups;
                const takenTurns = newPlayersActed.length + newEnemiesActed.length;
                if (totalTurns == takenTurns) {
                    return {
                        currentActor: '',
                        round: round + 1,
                        initiative: initialInitiative,
                        playersActed: [],
                        enemiesActed: [],
                    };
                }

                let nextInitiative: Initiative =
                    (initiative == 'heroes' && newEnemiesActed.length != numEnemyGroups) ||
                    newPlayersActed.length == numPlayers
                        ? 'enemies'
                        : 'heroes';
                return {
                    currentActor: '',
                    initiative: nextInitiative,
                    playersActed: newPlayersActed,
                    enemiesActed: newEnemiesActed,
                };
            }),
    })),
    {
        name: 'draw-steel-combat-storage',
    }
);

export const useCombatStore = create<CombatState>()(storeInit);
