export const ID = "com.wandersoulz.drawsteelsheet";

export const METADATA_KEYS = {
  // Stores the full Forge Steel JSON blob
  CHARACTER_DATA: `${ID}/data`,
  // Stores the Player ID who owns this sheet
  OWNER: `${ID}/owner`,
  // Stores the version of the sheet (good for future migrations)
  VERSION: `${ID}/version`
};

export const WIZARD_ID = `${ID}/character_wizard`;

export const CHARACTER_ASSIGNMENT_CHANNEL = `${ID}/character_assignment`;
export const CHARACTER_UPDATE_CHANNEL = `${ID}/character_update`;