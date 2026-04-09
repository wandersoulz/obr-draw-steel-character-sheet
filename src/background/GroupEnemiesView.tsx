import OBR, { Image, buildShape } from '@owlbear-rodeo/sdk';
import { useState } from 'react';
import { getImageCenter } from './overlays/math-helpers';
import { useEnemyStore } from '../stores/enemyStore';

const ENEMY_GROUP_METADATA_KEY = 'draw-steel-sheet/enemy-group-id';

const ENEMY_GROUP_COLORS = [
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Light Blue', color: '#0ea5e9' },
    { name: 'Green', color: '#22c55e' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Yellow', color: '#eab308' },
    { name: 'White', color: '#ffffff' },
];

export default function GroupEnemiesView() {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleColorSelect = async (color: string) => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            // In embeds, we retrieve context items dynamically via the active selection
            const tokenIds = await OBR.player.getSelection();
            if (!tokenIds || tokenIds.length === 0) return;

            const items = await OBR.scene.items.getItems(tokenIds);
            const groupId = crypto.randomUUID();
            const dpi = await OBR.scene.grid.getDpi();

            const rings = items.map((item) => {
                const imgItem = item as Image;
                const dpiScale = dpi / imgItem.grid.dpi;
                const width = imgItem.image.width * dpiScale * imgItem.scale.x;
                const height = imgItem.image.height * dpiScale * imgItem.scale.y;
                const center = getImageCenter(imgItem, dpi);

                const strokeWidth = 10;

                return buildShape()
                    .width(width - strokeWidth + 1)
                    .height(height - strokeWidth + 1)
                    .shapeType('CIRCLE')
                    .fillOpacity(0)
                    .strokeColor(color)
                    .strokeOpacity(1)
                    .strokeWidth(strokeWidth)
                    .position(center)
                    .attachedTo(item.id)
                    .locked(true)
                    .disableHit(true)
                    .layer('ATTACHMENT')
                    .name(`enemy-group-ring-${groupId}`)
                    .build();
            });

            await OBR.scene.items.addItems(rings);
            await OBR.scene.items.updateItems(tokenIds, (sceneItems) => {
                sceneItems.forEach((item) => {
                    item.metadata[ENEMY_GROUP_METADATA_KEY] = groupId;
                });
            });
            useEnemyStore.getState().addGroup(groupId, tokenIds);

            // Deselecting automatically dismisses the context menu UI
            await OBR.player.deselect();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-row items-center justify-evenly p-2 w-full h-[48px] bg-transparent box-border">
            {ENEMY_GROUP_COLORS.map((groupColor) => (
                <button
                    key={groupColor.name}
                    title={`Group Enemies (${groupColor.name})`}
                    onClick={() => handleColorSelect(groupColor.color)}
                    disabled={isProcessing}
                    className="w-6 h-6 rounded-full border-[3px] focus:outline-none hover:scale-110 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: groupColor.color, backgroundColor: 'transparent' }}
                />
            ))}
        </div>
    );
}
