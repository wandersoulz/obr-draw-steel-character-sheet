import { RollAttributes } from '@/models/dice-roller-types';
import { create } from 'zustand/react';

export interface ModalStates {
    featureModalIsOpen: boolean;
    setFeatureModalIsOpen: (isOpen: boolean) => void;
    diceRollerModalIsOpen: boolean;
    diceRollerAttributes: Partial<RollAttributes>;
    rollCost: number;
    setDiceRollerModalIsOpen: (isOpen: boolean) => void;
    setDiceRollerAttributes: (attributes: Partial<RollAttributes>) => void;
    setRollCost: (cost: number) => void;
}

export const useModalStore = create<ModalStates>()((set) => ({
    featureModalIsOpen: false,
    setFeatureModalIsOpen: (isOpen: boolean) => set({ featureModalIsOpen: isOpen }),
    diceRollerModalIsOpen: false,
    diceRollerAttributes: {},
    rollCost: 0,
    setRollCost: (cost: number) => set({ rollCost: cost }),
    setDiceRollerAttributes: (attributes: Partial<RollAttributes>) =>
        set((state) => ({
            diceRollerAttributes: { ...state.diceRollerAttributes, ...attributes },
        })),
    setDiceRollerModalIsOpen: (isOpen: boolean) => set({ diceRollerModalIsOpen: isOpen }),
}));
