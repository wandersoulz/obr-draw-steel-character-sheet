import { TraitSelectionState } from "./ancestry-trait-selection-state";

export interface AncestryState {
  ancestryId: string;
  signatureTraits: TraitSelectionState[];
  purchasedTraits: TraitSelectionState[];
}
