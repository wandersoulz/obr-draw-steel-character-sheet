// types.ts

// --- Core Enums & Types ---

export type AbilityType = 'Main Action' | 'Maneuver' | 'Triggered Action' | 'Move Action' | 'Free Triggered Action';
export type Characteristic = 'Might' | 'Agility' | 'Reason' | 'Intuition' | 'Presence' | 'Any';
export type TierRange = '11-' | '12-16' | '17+';

// --- Interfaces ---

/**
 * Represents a standard text-based rule (e.g., "Flanking" or "Cover").
 */
export interface GeneralRule {
    title: string;
    kind: 'rule' | 'section';
    description: string;
    subRules?: GeneralRule[]; // For nested bullet points like Edges/Banes
}

/**
 * Represents a specific tiered outcome in a Power Roll.
 */
export interface PowerRollResult {
    tier: 1 | 2 | 3;
    range: TierRange;
    effect: string;
}

/**
 * Represents an Action, Maneuver, or Spell.
 * This is designed to hold the specific formatting you requested.
 */
export interface Ability {
    title: string;
    kind: 'ability';
    type: AbilityType;
    keywords?: string[];
    distance: string; // e.g., "Melee 1", "Self"
    target: string;   // e.g., "One creature"
    characteristic?: Characteristic[]; // Array because Escape Grab is M or A
    powerRoll?: PowerRollResult[]; // Optional, as not all abilities roll
    effectText?: string; // Static text for abilities without rolls (e.g., Hide)
}

/**
 * Represents a Condition (e.g., "Bleeding", "Prone").
 */
export interface Condition {
    title: string;
    kind: 'condition';
    effect: string;
}

// --- Data Collection Type ---

export interface DrawSteelData {
    rules: GeneralRule[];
    actions: Ability[];
    conditions: Condition[];
}