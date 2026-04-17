import { ReadOnlyRegistry } from "../data/readonly-registry";
import { RegistryName } from "../sourcebook/registry-name";
import { AncestryState } from "./ancestry-state";
import { AncestryTrait } from "./ancestry-trait";

export class AncestryInstance {
  public id: string;
  public signatureTraits: AncestryTrait[] = [];
  public purchasedTraits: AncestryTrait[] = [];
  private ancestryState: AncestryState;

  private constructor(
    state: AncestryState,
    signatureTraits: AncestryTrait[],
    purchasedTraits: AncestryTrait[],
  ) {
    this.id = state.ancestryId;
    this.ancestryState = state;
    this.signatureTraits = signatureTraits;
    this.purchasedTraits = purchasedTraits;
  }

  public static async create(
    state: AncestryState,
    traitRegistry: ReadOnlyRegistry<AncestryTrait>,
  ): Promise<AncestryInstance> {
    const signatureTraits = (
      await Promise.all(
        state.signatureTraits.map((t) => traitRegistry.get(t.traitId)),
      )
    ).filter((t): t is AncestryTrait => !!t);

    const purchasedTraits = (
      await Promise.all(
        state.purchasedTraits.map((t) => traitRegistry.get(t.traitId)),
      )
    ).filter((t): t is AncestryTrait => !!t);

    return new AncestryInstance(state, signatureTraits, purchasedTraits);
  }

  public getAllTraits(): AncestryTrait[] {
    return [...this.signatureTraits, ...this.purchasedTraits];
  }

  public getSkills(): { name: string; source: string }[] {
    // Gather all traits and all traits from the state (which have the selections)
    const allTraits = this.getAllTraits();
    const allStateTraits = [
      ...this.ancestryState.signatureTraits,
      ...this.ancestryState.purchasedTraits,
    ];

    // Remove any state traits that do not have selections
    const signatureSelections = allStateTraits.filter(
      (trait) => !!trait.selections,
    );

    const skills = allTraits
      .filter((trait) => !!trait.choices)
      .map((trait) => ({
        name: trait.name,
        choices: trait.choices!.filter(
          (choice) => choice.registry == RegistryName.Skills,
        ),
      }))
      .flatMap((trait) => {
        const skills = trait.choices.flatMap(
          (c) =>
            signatureSelections.find((ss) => c.id in ss.selections!)
              ?.selections![c.id],
        );
        return skills
          .map((skill) => skill || "")
          .map((skill) => ({
            source: trait.name,
            name: skill,
          }));
      });

    return skills;
  }
}
