import OBR, { Image, Item } from '@owlbear-rodeo/sdk';
import { METADATA_KEYS } from '../constants';
import { getOriginAndBounds } from './overlays/math-helpers';
import { createHealthBar, createNameTag } from './overlays/create-overlays';
import { HeroLite } from '@/models/hero-lite';
import { OverlayState } from '@/models/overlay-state';

const OVERLAY_VERTICAL_OFFSET = 38;

const icon = new URL(
    "/icon.svg#icon",
    import.meta.url,
).toString();

async function updateOverLays(tokens: Record<string, OverlayState>, dpi: number, previousTokens: Record<string, OverlayState> = {}) {
    const setOfExistingTokens = new Set(Object.keys(tokens));
    const tokensRemoved = new Set(Object.keys(previousTokens).filter((tokenId) => !setOfExistingTokens.has(tokenId)));
    // Get items for all distinct token ids
    const itemsToChange = Array.from(new Set(Object.keys(tokens).concat(Object.keys(previousTokens))));
    const items = await OBR.scene.items.getItems(itemsToChange);
    items.forEach(async (item) => {
        const { origin, bounds } = getOriginAndBounds(item as Image, dpi, OVERLAY_VERTICAL_OFFSET);
        const overlayState = tokens[item.id] || previousTokens[item.id];
        const overlays: Item[] = createHealthBar(
            item,
            bounds,
            overlayState.stamina,
            overlayState.maxStamina,
            false,
            origin,
            0,
        );
        const nameTagPosition = {
            x: origin.x,
            y: origin.y,
        };
        overlays.push(createNameTag(item, dpi, overlayState.name, nameTagPosition, "UP"));        
        // Add back anything that wasn't from a removed token
        if (!tokensRemoved.has(item.id)) {
            await OBR.scene.local.addItems(overlays);
        } else {
            await OBR.scene.local.deleteItems(overlays.map(item => item.id));
        }
    });
}

function getTokensFromItems(items: Item[]): Record<string, OverlayState> {
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

async function createContextMenuItems() {
    await OBR.contextMenu.create({
        id: "assign-character",
        icons: [
            {
                icon: icon,
                label: "Assign Character",
                filter: {
                    every: [
                        { key: "layer", value: "CHARACTER" },
                        {
                            key: ["metadata", METADATA_KEYS.CHARACTER_DATA],
                            value: undefined,
                            operator: "==",
                        },
                    ],
                    permissions: ["UPDATE"],
                    roles: ["PLAYER", "GM"],
                    max: 1,
                },
            },
        ],
        onClick: (context, _) => {
            OBR.popover.open({
                "id": "select-character",
                "height": 400,
                "width": 300,
                "url": `/assignCharacter.html?tokenId=${context.items[0].id}`
            });
        }
    });

    await OBR.contextMenu.create({
        id: "remove-assigned-character",
        icons: [
            {
                icon: icon,
                label: "Remove Assigned Character",
                filter: {
                    every: [
                        { key: "layer", value: "CHARACTER" },
                        {
                            key: ["metadata", METADATA_KEYS.CHARACTER_DATA],
                            value: undefined,
                            operator: "!=",
                        },
                    ],
                    permissions: ["UPDATE"],
                    roles: ["PLAYER", "GM"],
                    max: 1,
                },
            },
        ],
        onClick: async (context, _) => {
            await OBR.scene.items.updateItems([context.items[0].id], (items) => {
                items[0].metadata[METADATA_KEYS.CHARACTER_DATA] = undefined;
            });
            await OBR.player.deselect();
        }
    });
}

async function initBackground() {
    await createContextMenuItems();

    let dpi = await OBR.scene.grid.getDpi();

    const initialItems = await OBR.scene.items.getItems();
    let tokens = getTokensFromItems(initialItems);

    await updateOverLays(tokens, dpi);

    OBR.scene.grid.onChange(async (grid) => {
        dpi = grid.dpi;
        await updateOverLays(tokens, dpi);
    });

    OBR.scene.items.onChange(async (items) => {
        const previousTokens = Object.assign({}, tokens);
        tokens = getTokensFromItems(items);
        await updateOverLays(tokens, dpi, previousTokens);
    });
}

// Start the background task once OBR and scene are ready.
OBR.onReady(async () => {
    const isReady = await OBR.scene.isReady()
    if (!isReady) {
        OBR.scene.onReadyChange(async (isNowReady) => {
            if (!isNowReady) return;
            await initBackground();
        });
    }
    else {
        await initBackground();
    }
});