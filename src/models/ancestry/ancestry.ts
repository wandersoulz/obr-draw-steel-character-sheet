import { Identifiable } from "../data/identifiable";

export interface Ancestry extends Identifiable {
  name: string;
  description: string;
  loreDescription: string;
  ancestryPoints: number;
  signatureTraitIds: string[];
  purchasedTraitIds: string[];
}
