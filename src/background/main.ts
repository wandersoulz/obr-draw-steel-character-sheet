import OBR, { Image, Item } from '@owlbear-rodeo/sdk';
import { METADATA_KEYS } from '../constants';
import { getOriginAndBounds } from './overlays/math-helpers';
import { createHealthBar, createNameTag } from './overlays/create-overlays';
import { HeroLite } from '@/models/hero-lite';
import { OverlayState } from '@/models/overlay-state';

const icon = new URL(
    "/icon.svg#icon",
    import.meta.url,
).toString();

async function updateOverLays(tokens: Record<string, OverlayState>, dpi: number) {
    const items = await OBR.scene.items.getItems(Object.keys(tokens));
    items.forEach((item) => {
        const { origin, bounds } = getOriginAndBounds(item as Image, dpi, 38);
        const overlayState = tokens[item.id];
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
        OBR.scene.local.addItems(overlays);
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
                "height": 200,
                "width": 300,
                "url": `/assignCharacter.html?tokenId=${context.items[0].id}`
            });
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
        tokens = getTokensFromItems(items);
        await updateOverLays(tokens, dpi);
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