import { HeroLite } from '@/models/hero-lite';
import { createContext } from 'react';

export interface OBRContextState {
    isOBRReady: boolean;
    isSceneReady: boolean;
    roomCharacters: HeroLite[];
    playerName: string;
    addCharacterToRoom: (character: HeroLite) => void;
    removeCharacterFromRoom: (character: HeroLite) => void;
}

export const OBRContext = createContext<OBRContextState>({
    isOBRReady: false,
    isSceneReady: false,
    roomCharacters: [],
    playerName: '',
    addCharacterToRoom: () => {},
    removeCharacterFromRoom: () => {},
});
