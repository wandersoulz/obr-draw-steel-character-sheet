import { create } from 'zustand';
import { obrRoom } from '@/middleware/obr-room';

export interface RoomState {
    heroTokens: number;
    incrementHeroTokens: () => void;
    decrementHeroTokens: () => void;
    updateHeroTokens: (tokens: number) => void;
}

export const useRoomStore = create<RoomState>()(
    obrRoom((set, get) => ({
        heroTokens: 0,
        incrementHeroTokens: () => {
            set({ heroTokens: get().heroTokens + 1 });
        },
        decrementHeroTokens: () => {
            if (get().heroTokens == 0) return;
            set({ heroTokens: get().heroTokens - 1 });
        },
        updateHeroTokens: (tokens: number) => {
            if (tokens < 0) return;
            set({ heroTokens: tokens });
        },
    }))
);
