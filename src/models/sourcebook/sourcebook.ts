import { Identifiable } from "../data/identifiable";
import { ReadOnlyRegistry } from "../data/readonly-registry";

type RegistryMap = Record<string, ReadOnlyRegistry<Identifiable>>;

export class Sourcebook<T extends RegistryMap> {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly registries: T, // The variable number of typed registries
  ) {}

  // A helper method that maintains perfect type safety when fetching a specific registry
  public getRegistry<K extends keyof T>(key: K): T[K] {
    return this.registries[key];
  }
}
