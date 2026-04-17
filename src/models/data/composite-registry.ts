import { Identifiable } from "./identifiable";
import { ReadOnlyRegistry } from "./readonly-registry";

export class CompositeRegistry<
  T extends Identifiable,
> implements ReadOnlyRegistry<T> {
  private registries: ReadOnlyRegistry<T>[] = [];

  constructor(registries?: ReadOnlyRegistry<T>[]) {
    if (registries) {
      this.registries = [...registries];
    }
  }

  public addRegistry(registry: ReadOnlyRegistry<T>): void {
    this.registries.push(registry);
  }

  public async get(id: string): Promise<T | undefined> {
    // Searches through composed registries in order.
    // The first one to return a match wins (allowing homebrew to override core rules).
    for (const registry of this.registries) {
      const item = await registry.get(id);
      if (item) {
        return item;
      }
    }
    return undefined;
  }

  public async getAll(): Promise<T[]> {
    // Flattens and deduplicates items across all registries
    const allItems = new Map<string, T>();
    for (const registry of this.registries) {
      for (const item of await registry.getAll()) {
        if (!allItems.has(item.id)) {
          allItems.set(item.id, item);
        }
      }
    }
    return Array.from(allItems.values());
  }

  public async has(id: string): Promise<boolean> {
    for (const registry of this.registries) {
      if (await registry.has(id)) return true;
    }
    return false;
  }
}
