import { METADATA_KEYS } from "@/constants";
import { OBRContextState } from "@/context/obr-context";
import { HeroLite } from "@/models/hero-lite";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

export function useObr(): OBRContextState {
    const [isOBRReady, setIsObrReady] = useState<boolean>(false);
    const [isSceneReady, setIsSceneReady] = useState<boolean>(false);
    const [roomCharacters, setRoomCharacters] = useState<HeroLite[]>([]);

    useEffect(() => {
        let isOBRReady = OBR.isReady;
        if (!isOBRReady) {
            OBR.onReady(() => {
                setIsObrReady(true);
            });
        } else {
            setIsObrReady(true);
        }
    }, []);

    useEffect(() => {
        if (!isOBRReady) return;
        
        let unsubscribeScene: () => void;
        OBR.scene.isReady().then((isSceneReady) => {
            if (!isSceneReady) {
                unsubscribeScene = OBR.scene.onReadyChange((isReady) => {
                    if (!isReady) return;
                    setIsSceneReady(true);
                });
            } else {
                setIsSceneReady(true);
            }
        });
        OBR.room.getMetadata().then((metadata) => {
            if (metadata[METADATA_KEYS.CHARACTER_DATA]) {
                setRoomCharacters((metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite[]).map(HeroLite.fromHeroLiteInterface));
            }
        });

        const unsubscribeRoomMetadata = OBR.room.onMetadataChange((metadata) => {
            if (metadata[METADATA_KEYS.CHARACTER_DATA]) {
                setRoomCharacters((metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite[]).map(HeroLite.fromHeroLiteInterface));
            }
        });

        return () => {
            if (unsubscribeScene) {
                unsubscribeScene();
            }
            unsubscribeRoomMetadata();
        }
    }, [isOBRReady]);

    return {
        isOBRReady,
        isSceneReady,
        roomCharacters,
        addCharacterToRoom: (character: HeroLite) => {
            const currentCharacters = Array.from(roomCharacters);
            currentCharacters.push(character);
            OBR.room.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: currentCharacters });
        },
        removeCharacterFromRoom: (character: HeroLite) => {
            const currentCharacters = Array.from(roomCharacters);
            OBR.room.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: currentCharacters.filter((c) => c.id != character.id) });
        }
    };
}