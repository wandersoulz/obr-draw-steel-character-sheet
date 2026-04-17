import { Feature } from "../../data/feature/feature";
import { Ability } from "../ability";
import { ModifierSource } from "../data/modifier-source";
import { RegistryName } from "../sourcebook/registry-name";

export interface AncestryTraitChoice {
  id: string;
  name: string;
  registry: RegistryName;

  filter: (item: any) => boolean;
}

export interface AncestryTrait extends Feature, ModifierSource {
  name: string;
  ancestryId: string;
  description: string;
  cost: number;
  choices?: AncestryTraitChoice[];
  abilities?: Ability[];
}
