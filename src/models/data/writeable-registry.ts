import { Identifiable } from "./identifiable";
import { ReadOnlyRegistry } from "./readonly-registry";

export interface WriteableRegistry<
  T extends Identifiable,
> extends ReadOnlyRegistry<T> {
  register(item: T): void;
  registerMany(items: T[]): void;
}
