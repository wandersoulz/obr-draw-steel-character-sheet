import { Ancestry } from "./ancestry";
import { AncestryTrait } from "./ancestry-trait";

export interface AncestryData {
  ancestry: Ancestry;
  signatureTraits: AncestryTrait[];
  purchasedTraits: AncestryTrait[];
}
