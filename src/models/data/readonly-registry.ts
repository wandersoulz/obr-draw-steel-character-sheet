import { Identifiable } from "./identifiable";

export interface ReadOnlyRegistry<T extends Identifiable> {
  get(id: string): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  has(id: string): Promise<boolean>;
}
