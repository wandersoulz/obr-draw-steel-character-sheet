export interface TraitSelectionState {
  traitId: string;
  // Key-value pairs for any choices made within this trait
  // e.g., { "skill_choice_1": "sk_athletics" }
  selections?: Record<string, string>;
}
