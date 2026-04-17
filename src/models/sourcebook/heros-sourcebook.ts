import { Ancestry } from "../ancestry/ancestry";
import { LazyRegistry } from "../data/lazy-registry";
import { LocalRegistry } from "../data/local-registry";
import { Sourcebook } from "./sourcebook";
import { AncestryTrait } from "../ancestry/ancestry-trait";
import { RegistryName } from "./registry-name";
import { Skill } from "../skill/skill";

type HeroesSourcebookRegistries = {
  [RegistryName.Ancestries]: LazyRegistry<Ancestry>;
  [RegistryName.AncestryTraits]: LazyRegistry<AncestryTrait>;
  [RegistryName.Skills]: LazyRegistry<Skill>;
};

export const HeroesSourcebook = new Sourcebook<HeroesSourcebookRegistries>(
  "heroes-sourcebook",
  "Heroes (Core Rules)",
  {
    [RegistryName.Ancestries]: new LazyRegistry<Ancestry>(
      async () => (await import("../../data/ancestries/core")).ancestries,
    ),
    [RegistryName.AncestryTraits]: new LazyRegistry<AncestryTrait>(
      async () => (await import("../../data/ancestries/core")).ancestryTraits,
    ),
    [RegistryName.Skills]: new LazyRegistry<Skill>(
      async () => (await import("../../data/skills/core/skills")).Skills,
    ),
  },
);
