import { METADATA_KEYS } from "@/constants";
import { HeroLite } from "@/models/hero-lite";
import { OverlayState } from "@/models/overlay-state";
import OBR, { Item } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

export function useObr() {  
    const [isOBRReady, setIsObrReady] = useState<boolean>(false);
    const [isSceneReady, setIsSceneReady] = useState<boolean>(false);
    const [tokens, setTokens] = useState<Record<string, OverlayState>>({});

    const getStateFromItems = (items: Item[]): Record<string, OverlayState> => {
        const characters = items
            .filter((item) => item.metadata[METADATA_KEYS.CHARACTER_DATA])
            .map((item) => {
                const character = item.metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite;
                return [
                    item.id,
                    {
                        maxStamina: character.maxStamina,
                        stamina: character.maxStamina - character.state.staminaDamage,
                        name: character.name,
                    }
                ]
            });
        return Object.fromEntries(characters);
    }

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
        if (isOBRReady) {
            OBR.scene.isReady().then((isSceneReady) => {
                if (!isSceneReady) {
                    OBR.scene.onReadyChange((isReady) => {
                        if (!isReady) return;
                        setIsSceneReady(true);
                    });
                } else {
                    setIsSceneReady(true);
                }
            });
        }
    }, [isOBRReady]);

    useEffect(() => {
        let unsubscribeItemChange: (() => void) | undefined = undefined;
        if (isSceneReady) {
            OBR.scene.items.getItems().then((items) => {
                setTokens(getStateFromItems(items));
            });
            unsubscribeItemChange = OBR.scene.items.onChange((items) => {
                setTokens(getStateFromItems(items));
            });
        }
        if (unsubscribeItemChange) {
            return () => {
                unsubscribeItemChange();
            }
        }
    }, [isSceneReady]);

    return {
        tokens,
        isOBRReady,
        isSceneReady,
    };
}