export const ID = "com.wandersoulz.drawsteelsheet";

export const METADATA_KEYS = {
  // Stores the full Forge Steel JSON blob
  CHARACTER_DATA: `${ID}/char-data`,
  // Stores a list of tokens owned by the current player
  TOKEN_DATA: `${ID}/token-data`,
  // Stores the Player ID who owns this sheet
  OWNER: `${ID}/owner`,
  // Stores the version of the sheet (good for future migrations)
  VERSION: `${ID}/version`
};

export const CHARACTER_ASSIGNMENT_CHANNEL = `${ID}/character_assignment`;
export const CHARACTER_UPDATE_CHANNEL = `${ID}/character_update`;

export const LOAD_DEFAULT_CHARACTERS = false;