import { AncestryInstance } from "../ancestry/ancestry-instance";
import { AncestryTrait } from "../ancestry/ancestry-trait";
import { Modifier, StatModifier } from "../modifiers/modifier";
import { Library } from "../sourcebook/library";
import { RegistryName } from "../sourcebook/registry-name";
import { HeroState } from "./hero-state";

export class Hero {
  public state: HeroState;
  public ancestry?: AncestryInstance;

  private constructor(state: HeroState, ancestry?: AncestryInstance) {
    this.state = state;
    this.ancestry = ancestry;
  }

  public static async create(
    state: HeroState,
    library: Library,
  ): Promise<Hero> {
    let ancestry: AncestryInstance | undefined;
    if (state.ancestry) {
      // The Hero class asks the Library to gather ALL "ancestryTraits" from ALL books
      const traitRegistry = library.getCompositeRegistry<AncestryTrait>(
        RegistryName.AncestryTraits,
      );
      ancestry = await AncestryInstance.create(state.ancestry, traitRegistry);
    }
    return new Hero(state, ancestry);
  }

  /**
   * Dynamically calculates a stat (e.g., "speed", "skill_persuasion")
   * by aggregating all modifiers from all active traits.
   */
  public getStat(statName: string): number {
    let baseValue = 0;
    let bonusValue = 0;

    // 1. Gather all active modifiers from all components
    const allModifiers: Modifier[] = [];

    this.ancestry?.getAllTraits().forEach((trait) => {
      allModifiers.push(...trait.getModifiers());
    });

    // 2. Filter for the requested stat and apply the stacking rules
    const statModifiers = allModifiers
      .filter((m) => "stat" in m)
      .map((m) => m as StatModifier)
      .filter((m) => m.stat === statName);

    for (const mod of statModifiers) {
      if (mod.type === "base") {
        // Higher base value overrides a lower base value
        baseValue = Math.max(baseValue, mod.value);
      } else if (mod.type === "bonus") {
        // Bonuses stack additively
        bonusValue += mod.value;
      }
    }

    return baseValue + bonusValue;
  }

  /**
   * Gets all skill IDs selected across all parts of the hero's data.
   */
  public getSkills(): { name: string; source: string }[] {
    let skills: { name: string; source: string }[] = [];
    if (this.ancestry) {
      skills = skills.concat(this.ancestry.getSkills());
    }

    return skills;
  }
}
