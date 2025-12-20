import { OverlayState } from '@/models/overlay-state';
import { createContext } from 'react';

export interface OBRContextState {
    isOBRReady: boolean;
    isSceneReady: boolean;
}

export const OBRContext = createContext<OBRContextState>({
    isOBRReady: false,
    isSceneReady: false,
});