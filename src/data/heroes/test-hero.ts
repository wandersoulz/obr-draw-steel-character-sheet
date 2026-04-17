import { HeroState } from "../../models/hero/hero-state";

export const TestHero: HeroState = {
  id: "hero_001",
  name: "Hero Developer",
  ancestry: {
    ancestryId: "ancestry-devil",
    purchasedTraits: [],
    signatureTraits: [
      {
        traitId: "trait_devil_sig_silver_tongue",
        selections: {
          trait_devil_sig_silver_tongue_skill_selection: "persuade",
        },
      },
    ],
  },
};
