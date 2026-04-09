import OBR, { Image, Item } from '@owlbear-rodeo/sdk';
import { METADATA_KEYS } from '../constants';
import { getOriginAndBounds } from './overlays/math-helpers';
import { createHealthBar, createNameTag } from './overlays/create-overlays';
import { TokenData } from '@/models/token-data';
import { OverlayState } from '@/models/overlay-state';
import { useEnemyStore } from '@/stores/enemyStore';

const OVERLAY_VERTICAL_OFFSET = 38;
const ENEMY_GROUP_METADATA_KEY = 'draw-steel-sheet/enemy-group-id';

const icon = new URL('/icon.svg#icon', import.meta.url).toString();

async function updateOverLays(
    tokens: Record<string, OverlayState>,
    dpi: number,
    previousTokens: Record<string, OverlayState> = {}
) {
    const setOfExistingTokens = new Set(Object.keys(tokens));
    const tokensRemoved = new Set(
        Object.keys(previousTokens).filter((tokenId) => !setOfExistingTokens.has(tokenId))
    );
    // Get items for all distinct token ids
    const itemsToChange = Array.from(
        new Set(Object.keys(tokens).concat(Object.keys(previousTokens)))
    );
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
            0
        );
        const nameTagPosition = {
            x: origin.x,
            y: origin.y,
        };
        const nameTag = createNameTag(item, dpi, overlayState.name, nameTagPosition, 'UP');
        const allOverlays = overlays.concat(nameTag);
        // Add back anything that wasn't from a removed token
        if (!tokensRemoved.has(item.id)) {
            await OBR.scene.local.addItems(allOverlays);
        } else {
            await OBR.scene.local.deleteItems(allOverlays.map((item) => item.id));
        }
    });
}

function getTokensFromItems(items: Item[]): Record<string, OverlayState> {
    const characters = items
        .filter((item) => item.metadata[METADATA_KEYS.CHARACTER_DATA])
        .map((item) => {
            const character = item.metadata[METADATA_KEYS.CHARACTER_DATA] as TokenData;
            return [
                item.id,
                {
                    maxStamina: character.maxStamina || 0,
                    stamina: character.stamina || 0,
                    name: character.name || '',
                },
            ];
        });
    return Object.fromEntries(characters);
}

async function createContextMenuItems() {
    await OBR.contextMenu.create({
        id: 'assign-character',
        icons: [
            {
                icon: icon,
                label: 'Assign Character',
                filter: {
                    every: [
                        { key: 'layer', value: 'CHARACTER' },
                        {
                            key: ['metadata', METADATA_KEYS.CHARACTER_DATA],
                            value: undefined,
                            operator: '==',
                        },
                    ],
                    permissions: ['UPDATE'],
                    roles: ['PLAYER', 'GM'],
                    max: 1,
                },
            },
        ],
        onClick: (context, _) => {
            OBR.popover.open({
                id: 'select-character',
                height: 400,
                width: 300,
                url: `/assignCharacter.html?tokenId=${context.items[0].id}`,
            });
        },
    });

    await OBR.contextMenu.create({
        id: 'remove-assigned-character',
        icons: [
            {
                icon: icon,
                label: 'Remove Character',
                filter: {
                    every: [
                        { key: 'layer', value: 'CHARACTER' },
                        {
                            key: ['metadata', METADATA_KEYS.CHARACTER_DATA],
                            value: undefined,
                            operator: '!=',
                        },
                    ],
                    permissions: ['UPDATE'],
                    roles: ['PLAYER', 'GM'],
                    max: 1,
                },
            },
        ],
        onClick: async (context, _) => {
            await OBR.scene.items.updateItems([context.items[0].id], (items) => {
                items[0].metadata[METADATA_KEYS.CHARACTER_DATA] = undefined;
            });
            await OBR.player.deselect();
        },
    });

    await OBR.contextMenu.create({
        id: 'group-enemies',
        icons: [
            {
                icon: icon,
                label: 'Group Enemies',
                filter: {
                    every: [
                        { key: 'layer', value: 'CHARACTER' },
                        {
                            key: ['metadata', ENEMY_GROUP_METADATA_KEY],
                            value: undefined,
                            operator: '==',
                        },
                    ],
                    permissions: ['UPDATE'],
                    roles: ['GM'],
                },
            },
        ],
        embed: {
            url: '/groupEnemies.html',
            height: 48,
        },
    });

    await OBR.contextMenu.create({
        id: 'remove-from-group',
        icons: [
            {
                icon: icon,
                label: 'Remove from Group',
                filter: {
                    every: [
                        { key: 'layer', value: 'CHARACTER' },
                        {
                            key: ['metadata', ENEMY_GROUP_METADATA_KEY],
                            value: undefined,
                            operator: '!=',
                        },
                    ],
                    max: 1,
                    permissions: ['UPDATE'],
                    roles: ['GM'],
                },
            },
        ],
        onClick: async (context, _) => {
            const token = context.items[0];
            const groupId = token.metadata[ENEMY_GROUP_METADATA_KEY] as string;

            await OBR.scene.items.updateItems([token.id], (items) => {
                items[0].metadata[ENEMY_GROUP_METADATA_KEY] = undefined;
            });

            const attachments = await OBR.scene.items.getItemAttachments([token.id]);
            const ring = attachments.find((a) => a.name === `enemy-group-ring-${groupId}`);
            if (ring) {
                await OBR.scene.items.deleteItems([ring.id]);
            }

            useEnemyStore.getState().removeTokens([token.id]);
            await OBR.player.deselect();
        },
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

        // Detect if any grouped tokens were deleted from the scene and update the store
        const currentItemIds = new Set(items.map((i) => i.id));
        const state = useEnemyStore.getState();
        const missingTokens: string[] = [];
        for (const groupTokens of Object.values(state.enemyGroups)) {
            for (const tokenId of groupTokens) {
                if (!currentItemIds.has(tokenId)) {
                    missingTokens.push(tokenId);
                }
            }
        }
        if (missingTokens.length > 0) {
            state.removeTokens(missingTokens);
        }
    });
}

// Start the background task once OBR and scene are ready.
OBR.onReady(async () => {
    const isReady = await OBR.scene.isReady();
    if (!isReady) {
        OBR.scene.onReadyChange(async (isNowReady) => {
            if (!isNowReady) return;
            await initBackground();
        });
    } else {
        await initBackground();
    }
});
