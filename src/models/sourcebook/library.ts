import { Identifiable } from "../data/identifiable";
import { ReadOnlyRegistry } from "../data/readonly-registry";
import { CompositeRegistry } from "../data/composite-registry";
import { Sourcebook } from "./sourcebook";

// We use an open constraint here so it can accept any sourcebook
type AnySourcebook = Sourcebook<{
  [key: string]: ReadOnlyRegistry<Identifiable>;
}>;

export class Library {
  private sourcebooks: AnySourcebook[] = [];

  constructor(sourcebooks: AnySourcebook[]) {
    this.sourcebooks = sourcebooks;
  }

  /**
   * Searches all sourcebooks for a specific registry key and combines
   * them into a single, queryable CompositeRegistry.
   */
  public getCompositeRegistry<T extends Identifiable>(
    registryKey: string,
  ): ReadOnlyRegistry<T> {
    const composite = new CompositeRegistry<T>();

    for (const book of this.sourcebooks) {
      // Check if this specific sourcebook has a registry with the requested key
      const registry = book.registries[registryKey];

      if (registry) {
        // We cast it here because the Library dynamically groups them,
        // but the caller dictates the expected generic type <T>
        composite.addRegistry(registry as ReadOnlyRegistry<T>);
      }
    }

    return composite;
  }
}
