import { Identifiable } from "./identifiable";
import { WriteableRegistry } from "./writeable-registry";

export class LocalRegistry<
  T extends Identifiable,
> implements WriteableRegistry<T> {
  private items = new Map<string, T>();

  constructor(initialValues: T[]) {
    this.registerMany(initialValues);
  }

  public register(item: T): void {
    if (this.items.has(item.id)) {
      console.warn(`[LocalRegistry] Overwriting existing ID: ${item.id}`);
    }
    this.items.set(item.id, item);
  }

  public registerMany(items: T[]): void {
    for (const item of items) {
      this.register(item);
    }
  }

  public async get(id: string): Promise<T | undefined> {
    return Promise.resolve(this.items.get(id));
  }

  public async getAll(): Promise<T[]> {
    return Promise.resolve(Array.from(this.items.values()));
  }

  public async has(id: string): Promise<boolean> {
    return Promise.resolve(this.items.has(id));
  }
}
