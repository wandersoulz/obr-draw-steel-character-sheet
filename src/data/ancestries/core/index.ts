import { Ancestry } from "../../../models/ancestry/ancestry";
import { AncestryTrait } from "../../../models/ancestry/ancestry-trait";
import { Devil } from "./devil";

export const ancestryTraits: AncestryTrait[] = [
  ...Devil.purchasedTraits,
  ...Devil.signatureTraits,
];
export const ancestries: Ancestry[] = [Devil.ancestry];
