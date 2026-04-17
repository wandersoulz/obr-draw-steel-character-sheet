import React, { useState, useEffect } from "react";
import { Hero } from "../../models/hero/hero";
import { Library } from "../../models/sourcebook/library";
import { RegistryName } from "../../models/sourcebook/registry-name";
import { Ancestry } from "../../models/ancestry/ancestry";

interface AncestryCardProps {
  hero: Hero;
  library: Library;
  onClick: () => void;
}

export const AncestryCard: React.FC<AncestryCardProps> = ({
  hero,
  library,
  onClick,
}) => {
  if (!hero.ancestry) return null;
  const [ancestryData, setAncestryData] = useState<Ancestry | undefined>(
    undefined,
  );

  useEffect(() => {
    const ancestryRegistry = library.getCompositeRegistry<Ancestry>(
      RegistryName.Ancestries,
    );
    ancestryRegistry.get(hero.ancestry!.id).then(setAncestryData);
  }, [hero.ancestry]);

  return (
    <div
      className="border border-gray-200 rounded-lg p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-gray-300 transition-all bg-white"
      onClick={onClick}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {ancestryData?.name || "Unknown Ancestry"}
      </h2>

      <div className="mb-4">
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {hero.ancestry.signatureTraits.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
          {hero.ancestry.purchasedTraits.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
