export const ID = 'com.wandersoulz.drawsteelsheet';

export const METADATA_KEYS = {
    // Stores the full Forge Steel JSON blob
    CHARACTER_DATA: `${ID}/char-data`,
    // Stores a list of tokens owned by the current player
    HERO_TOKEN_DATA: `${ID}/hero-token-data`,
    // Stores the Player ID who owns this sheet
    OWNER: `${ID}/owner`,
    // Stores the version of the sheet (good for future migrations)
    VERSION: `${ID}/version`,
    // Stores data about a combat encounter
    COMBAT_DATA: `ID/combat-data`,
};

export const CHARACTER_ASSIGNMENT_CHANNEL = `${ID}/character_assignment`;
export const CHARACTER_UPDATE_CHANNEL = `${ID}/character_update`;

export const LOAD_DEFAULT_CHARACTERS = false;
