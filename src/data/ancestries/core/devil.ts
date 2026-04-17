import { Ancestry } from "../../../models/ancestry/ancestry";
import { AncestryTrait } from "../../../models/ancestry/ancestry-trait";
import { Skill } from "../../../models/skill/skill";
import { RegistryName } from "../../../models/sourcebook/registry-name";
import { SkillGroups } from "../../skills/core/skill-groups";

const ancestry: Ancestry = {
  id: "ancestry-devil",
  name: "Devil",
  description: "",
  loreDescription: "",
  ancestryPoints: 3,
  signatureTraitIds: [],
  purchasedTraitIds: [],
};

const signatureTraits: AncestryTrait[] = [
  {
    id: "trait_devil_sig_silver_tongue",
    ancestryId: ancestry.id,
    name: "Silver Tongue",
    description:
      "Your innate magic allows you to twist how your words are perceived to get a better read on people and convince them to see things your way. You have one skill of your choice from the interpersonal skill group and you gain an edge on tests when attempting to discover an NPC's motivations and pitfalls during a negotiation.",
    cost: 0,
    choices: [
      {
        id: "trait_devil_sig_silver_tongue_skill_selection",
        name: "Interpersonal Skill Choice",
        registry: RegistryName.Skills,
        // The UI will run all skills through this filter to populate the dropdown
        filter: (skill: Skill) =>
          skill.skillGroupId === SkillGroups.Interpersonal,
      },
    ],
    getModifiers: (_) => [],
  },
];

const purchasedTraits: AncestryTrait[] = [
  {
    id: "trait_devil_pt_beast_legs",
    ancestryId: ancestry.id,
    name: "Beast Legs",
    description: "Your powerful legs make you faster. You have speed 6.",
    cost: 1,
    getModifiers: () => [{ stat: "speed", value: 6, type: "base" }],
  },
  {
    id: "trait_devil_pt_glowing_eyes",
    ancestryId: ancestry.id,
    name: "Glowing Eyes",
    description:
      "Triggered action to deal psychic damage equal to 1d10 + level when taking damage.",
    cost: 1,
    abilities: [
      {
        id: "trait_devil_pt_glowing_eyes_ability",
        name: "Glowing Eyes",
        description: "",
        type: "ancestry",
        range: {
          distance: 0,
          type: "any",
        },
        action: "triggered",
        keywords: [],
        effect: "Deal psychic damage equal to 1d10 + your level",
      },
    ],
    getModifiers: () => [],
  },
  {
    id: "trait_devil_pt_hellsight",
    ancestryId: ancestry.id,
    name: "Hellsight",
    description: "No bane on strikes made against creatures with concealment.",
    cost: 1,
    getModifiers: () => [],
  },
  {
    id: "trait_devil_pt_impressive_horns",
    ancestryId: ancestry.id,
    name: "Impressive Horns",
    description:
      "Whenever you make a saving throw, you succeed on a roll of 5 or higher.",
    cost: 2,
    getModifiers: () => [{ stat: "saving_throw", value: 5, type: "base" }],
  },
  {
    id: "trait_devil_pt_prehensile_tail",
    ancestryId: ancestry.id,
    name: "Prehensile Tail",
    description: "You cannot be flanked.",
    cost: 2,
    getModifiers: () => [
      { stat: "condition_immunity", condition: "flanked", type: "bonus" },
    ],
  },
  {
    id: "trait_devil_pt_wings",
    ancestryId: ancestry.id,
    name: "Wings",
    description:
      "You possess wings powerful enough to take you airborne. While using your wings to fly, you can stay aloft for a number of rounds equal to your Might score (minimum 1 round) before you fall. While using your wings to fly at 3rd level or lower, you have damage weakness 5.",
    cost: 2,
    getModifiers: () => [],
  },
];

ancestry.signatureTraitIds = signatureTraits.map((st) => st.id);
ancestry.purchasedTraitIds = purchasedTraits.map((pt) => pt.id);

export const Devil = {
  ancestry,
  purchasedTraits,
  signatureTraits,
};
