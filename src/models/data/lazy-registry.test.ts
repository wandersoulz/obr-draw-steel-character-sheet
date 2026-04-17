import { describe, it, expect, vi } from "vitest";
import { LazyRegistry } from "./lazy-registry";
import { Identifiable } from "./identifiable";

const mockData: (Identifiable & { name: string })[] = [
  { id: "item-1", name: "Item 1" },
  { id: "item-2", name: "Item 2" },
];

describe("LazyRegistry", () => {
  it("should not call the loader function on construction", () => {
    const loader = vi.fn().mockResolvedValue(mockData);
    new LazyRegistry(loader);
    expect(loader).not.toHaveBeenCalled();
  });

  it("should call the loader function when get() is first called", async () => {
    const loader = vi.fn().mockResolvedValue(mockData);
    const registry = new LazyRegistry(loader);
    await registry.get("item-1");
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("should call the loader function only once for multiple get() calls", async () => {
    const loader = vi.fn().mockResolvedValue(mockData);
    const registry = new LazyRegistry(loader);
    await registry.get("item-1");
    await registry.get("item-2");
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("should call the loader function when getAll() is first called", async () => {
    const loader = vi.fn().mockResolvedValue(mockData);
    const registry = new LazyRegistry(loader);
    await registry.getAll();
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("should call the loader function when has() is first called", async () => {
    const loader = vi.fn().mockResolvedValue(mockData);
    const registry = new LazyRegistry(loader);
    await registry.has("item-1");
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("should return the correct data from the loader", async () => {
    const loader = vi.fn().mockResolvedValue(mockData);
    const registry = new LazyRegistry(loader);
    const item = await registry.get("item-1");
    expect(item).toEqual(mockData[0]);
  });
});
