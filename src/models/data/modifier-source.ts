import { Modifier } from "../modifiers/modifier";

export interface ModifierSource {
  getModifiers(selections?: Record<string, string>): Modifier[];
}
