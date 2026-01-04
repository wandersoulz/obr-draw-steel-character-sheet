import { AttachmentBehavior, Item, buildCurve, buildText, Vector2, buildLabel } from '@owlbear-rodeo/sdk';
import { createRoundedRectangle, getFillPortion } from './math-helpers';

const FULL_BAR_HEIGHT = 20;
export const TEXT_VERTICAL_OFFSET = -0.3;
const LINE_HEIGHT = 0.95;
const BAR_PADDING = 2;
const HEALTH_OPACITY = 0.5;
const BAR_CORNER_RADIUS = FULL_BAR_HEIGHT / 2;
const FONT_SIZE = 22;
const FONT = 'Roboto, sans-serif';
const LOCKED = true;
const DISABLE_HIT = true;
const BACKGROUND_OPACITY = 0.7;
const DISABLE_ATTACHMENT_BEHAVIORS: AttachmentBehavior[] = [
    'ROTATION',
    'VISIBLE',
    'COPY',
    'SCALE',
    // "POSITION",
];

const getNameTagId = (itemId: string) => `${itemId}-name-tag`;

const hpTextId = (itemId: string) => `${itemId}-health-text`;
const hpFillId = (itemId: string) => `${itemId}-health-fill`;
const hpBackgroundId = (itemId: string) => `${itemId}-health-background`;

export function createHealthBar(
    item: Item,
    bounds: { width: number; height: number },
    health: number,
    maxHealth: number,
    lightBackground: boolean,
    origin: { x: number; y: number },
    segments = 0,
): Item[] {
    const barHeight = FULL_BAR_HEIGHT;

    const position = {
        x: origin.x - bounds.width / 2 + BAR_PADDING,
        y: origin.y - barHeight - 2,
    };
    const barWidth = bounds.width - BAR_PADDING * 2;
    const barTextHeight = barHeight + 0;
    const setVisibilityProperty = item.visible;

    let healthBackgroundColor = '#A4A4A4';
    if (!lightBackground) {
        healthBackgroundColor = 'black';
    }

    const backgroundShape = buildCurve()
        .fillColor(healthBackgroundColor)
        .fillOpacity(BACKGROUND_OPACITY)
        .position({ x: position.x, y: position.y })
        .zIndex(10000)
        .attachedTo(item.id)
        .layer('TEXT')
        .locked(LOCKED)
        .id(hpBackgroundId(item.id))
        .visible(setVisibilityProperty)
        .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
        .disableHit(DISABLE_HIT)
        .strokeWidth(0)
        .tension(0)
        .closed(true)
        .points(createRoundedRectangle(barWidth, barHeight, BAR_CORNER_RADIUS))
        .build();

    const fillPortion = getFillPortion(health, maxHealth, segments);
    const fillColor = health >= 0 ? 'red' : 'red';

    const fillShape = buildCurve()
        .fillColor(fillColor)
        .fillOpacity(HEALTH_OPACITY)
        .zIndex(20000)
        .position({ x: position.x, y: position.y })
        .strokeWidth(0)
        .strokeOpacity(0)
        .attachedTo(item.id)
        .layer('TEXT')
        .locked(LOCKED)
        .id(hpFillId(item.id))
        .visible(setVisibilityProperty)
        .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
        .disableHit(DISABLE_HIT)
        .tension(0)
        .closed(true)
        .points(
            createRoundedRectangle(
                barWidth,
                barHeight,
                BAR_CORNER_RADIUS,
                fillPortion,
            ),
        )
        .build();

    const healthText = buildText()
        .position({ x: position.x, y: position.y + TEXT_VERTICAL_OFFSET })
        .plainText(`${health}/${maxHealth}`)
        .textAlign('CENTER')
        .textAlignVertical('TOP')
        .fontSize(FONT_SIZE)
        .fontFamily(FONT)
        .textType('PLAIN')
        .height(barTextHeight)
        .width(barWidth)
        .fontWeight(400)
        .attachedTo(item.id)
        .fillOpacity(1)
        .layer('TEXT')
        .lineHeight(LINE_HEIGHT)
        .locked(LOCKED)
        .id(hpTextId(item.id))
        .visible(setVisibilityProperty)
        .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
        .disableHit(DISABLE_HIT)
        .build();

    return [backgroundShape, fillShape, healthText];
}

/** Create name tag component items */
export function createNameTag(
    item: Item,
    sceneDpi: number,
    plainText: string,
    position: Vector2,
    pointerDirection: 'UP' | 'DOWN',
): Item {
    const nameTagText = buildLabel()
        .maxViewScale(1)
        .minViewScale(1)
        .position(position)
        .plainText(plainText)
        .fontSize(FONT_SIZE)
        .fontFamily(FONT)
        .fontWeight(400)
        .pointerHeight(0)
        .pointerDirection(pointerDirection)
        .attachedTo(item.id)
        .fillOpacity(0.87)
        .layer('TEXT')
        .cornerRadius(sceneDpi / 12)
        .padding(sceneDpi / 50)
        .backgroundOpacity(BACKGROUND_OPACITY)
        .locked(LOCKED)
        .id(getNameTagId(item.id))
        .visible(item.visible)
        .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
        .disableHit(DISABLE_HIT)
        .build();

    return nameTagText;
}

