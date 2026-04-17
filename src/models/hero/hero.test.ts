import { describe, it, expect, beforeEach } from "vitest";
import { Hero } from "./hero";
import { HeroState } from "./hero-state";
import { TestHero } from "../../data/heroes/test-hero";
import { HeroesSourcebook } from "../sourcebook/heros-sourcebook";
import { Library } from "../sourcebook/library";

describe("Hero Class", () => {
  let library: Library;

  beforeEach(async () => {
    // Setup a library containing the Heroes Sourcebook for the tests to use
    library = new Library([HeroesSourcebook]);
  });

  it("should initialize a Hero with the Devil ancestry and correct signature traits", async () => {
    const hero = await Hero.create(TestHero, library);

    // Verify basic instantiation properties
    expect(hero.state.name).toBe("Hero Developer");
    expect(hero.ancestry).toBeDefined();
    expect(hero.ancestry?.id).toBe("ancestry-devil");

    // Verify TestHero's initial signature trait is correctly loaded
    const activeTraits = hero.ancestry?.getAllTraits() || [];
    expect(activeTraits.length).toBe(1);
    expect(activeTraits[0].id).toBe("trait_devil_sig_silver_tongue");
  });

  it("should correctly calculate stats based on purchased traits", async () => {
    // Provide a state with multiple purchased traits that modify stat values
    const customState: HeroState = {
      ...TestHero,
      ancestry: {
        ...TestHero.ancestry!,
        purchasedTraits: [
          { traitId: "trait_devil_pt_beast_legs" }, // Grants base speed 6
          { traitId: "trait_devil_pt_impressive_horns" }, // Grants base saving_throw 5
        ],
      },
    };

    const hero = await Hero.create(customState, library);

    expect(hero.getStat("speed")).toBe(6);
    expect(hero.getStat("saving_throw")).toBe(5);
  });

  it("should correctly collect selected skills from ancestry traits", async () => {
    const hero = await Hero.create(TestHero, library);
    const skills = hero.getSkills();

    expect(skills.length).toBe(1);
    expect(skills.map((s) => s.name)).toContain("persuade");
  });
});
