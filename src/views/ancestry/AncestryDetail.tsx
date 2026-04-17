import React, { useEffect, useState } from "react";
import { Hero } from "../../models/hero/hero";
import { HeroState } from "../../models/hero/hero-state";
import { Library } from "../../models/sourcebook/library";
import { RegistryName } from "../../models/sourcebook/registry-name";
import { Ancestry } from "../../models/ancestry/ancestry";
import { AncestryTrait } from "../../models/ancestry/ancestry-trait";
import { Skill } from "../../models/skill/skill";

interface Props {
  hero: Hero;
  library: Library;
  isOpen: boolean;
  isEditable: boolean;
  onClose: () => void;
  onHeroStateChange: (newState: HeroState) => void;
}

export const AncestryDetail: React.FC<Props> = ({
  hero,
  library,
  isOpen,
  isEditable,
  onClose,
  onHeroStateChange,
}) => {
  const [ancestryData, setAncestryData] = useState<Ancestry | null>(null);
  const [allPurchasedTraits, setAllPurchasedTraits] = useState<AncestryTrait[]>(
    [],
  );
  const [skillOptions, setSkillOptions] = useState<Skill[]>([]);

  if (!hero.ancestry) return null;

  useEffect(() => {
    const ancestryRegistry = library.getCompositeRegistry<Ancestry>(
      RegistryName.Ancestries,
    );
    ancestryRegistry.get(hero.ancestry!.id).then((data) => {
      if (!data) return;
      setAncestryData(data);

      const traitRegistry = library.getCompositeRegistry<AncestryTrait>(
        RegistryName.AncestryTraits,
      );
      Promise.all(data.purchasedTraitIds.map((id) => traitRegistry.get(id)))
        .then((traits) => traits.filter((t): t is AncestryTrait => !!t))
        .then(setAllPurchasedTraits);
    });

    const skillRegistry = library.getCompositeRegistry<Skill>(
      RegistryName.Skills,
    );
    skillRegistry.getAll().then(setSkillOptions);
  }, [hero.ancestry.id, library]);

  if (!ancestryData) return null;

  const purchasedTraitsCost = hero.ancestry.purchasedTraits.reduce(
    (total, trait) => total + trait.cost,
    0,
  );
  const availablePoints =
    (ancestryData.ancestryPoints || 0) - purchasedTraitsCost;

  const handleSelectionChange = (
    traitId: string,
    choiceId: string,
    value: string,
  ) => {
    const newState = structuredClone(hero.state);
    if (!newState.ancestry) return;

    const traitState = newState.ancestry.signatureTraits.find(
      (t) => t.traitId === traitId,
    );
    if (traitState) {
      if (!traitState.selections) traitState.selections = {};
      traitState.selections[choiceId] = value;
      onHeroStateChange(newState);
    }
  };

  const handlePurchaseToggle = (traitToToggle: AncestryTrait) => {
    const newState = structuredClone(hero.state);
    if (!newState.ancestry) return;

    const currentPurchased = newState.ancestry.purchasedTraits || [];
    const traitIndex = currentPurchased.findIndex(
      (t) => t.traitId === traitToToggle.id,
    );

    if (traitIndex > -1) {
      // Trait is already purchased, so remove it
      newState.ancestry.purchasedTraits.splice(traitIndex, 1);
    } else {
      // Trait is not purchased, so add it if there are enough points
      if (availablePoints >= traitToToggle.cost) {
        newState.ancestry.purchasedTraits.push({ traitId: traitToToggle.id });
      } else {
        // Not enough points, do nothing.
        return;
      }
    }
    onHeroStateChange(newState);
  };

  return (
    <>
      {/* Darkened Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Side Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 pb-6 border-b border-gray-200 shrink-0 relative bg-gray-50 z-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 text-xl font-bold"
          >
            ✕
          </button>

          <h2 className="text-3xl font-bold mb-2 pr-6 text-gray-900">
            {ancestryData.name}
          </h2>
          <p className="text-gray-700 leading-relaxed pr-2">
            {ancestryData.description || "No description available."}
          </p>
        </div>

        <div className="p-8 pt-6 flex-grow overflow-y-auto">
          <div className="mb-10">
            <h3 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4 text-gray-800">
              Signature Traits
            </h3>
            <div className="space-y-4">
              {hero.ancestry.signatureTraits.map((trait) => {
                const stateTrait = hero.state.ancestry?.signatureTraits.find(
                  (t) => t.traitId === trait.id,
                );

                return (
                  <div
                    key={trait.id}
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
                  >
                    <h4 className="font-bold text-lg mb-1">{trait.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {trait.description}
                    </p>

                    {trait.choices?.map((choice) => {
                      const options =
                        choice.registry === RegistryName.Skills
                          ? skillOptions.filter(choice.filter)
                          : [];
                      const selectedValue =
                        stateTrait?.selections?.[choice.id] || "";

                      return (
                        <div
                          key={choice.id}
                          className="mt-3 bg-gray-50 p-3 rounded border border-gray-100"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {choice.name}
                          </label>
                          <select
                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            disabled={!isEditable}
                            value={selectedValue}
                            onChange={(e) =>
                              handleSelectionChange(
                                trait.id,
                                choice.id,
                                e.target.value,
                              )
                            }
                          >
                            <option value="" disabled>
                              Select an option
                            </option>
                            {options.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="flex justify-between items-baseline text-xl font-semibold border-b border-gray-200 pb-2 mb-4 text-gray-800">
              <span>Purchased Traits</span>
              {isEditable && (
                <span className="text-sm font-normal text-gray-500">
                  {availablePoints} Points Available
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {allPurchasedTraits.map((trait) => {
                const isSelected = hero.ancestry!.purchasedTraits.some(
                  (t) => t.id === trait.id,
                );
                return (
                  <div
                    key={trait.id}
                    onClick={() => isEditable && handlePurchaseToggle(trait)}
                    className={`p-4 rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-blue-50 border-blue-400"
                        : "bg-white border-gray-200"
                    } ${!isEditable ? "cursor-default" : isSelected ? "cursor-pointer" : "cursor-pointer hover:bg-gray-100"}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4
                        className={`font-bold ${isSelected ? "text-blue-900" : "text-gray-800"}`}
                      >
                        {trait.name}
                      </h4>
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">
                        Cost: {trait.cost}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-snug">
                      {trait.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
