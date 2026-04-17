import React, { useState, useEffect } from "react";
import { Hero } from "../models/hero/hero";
import { TestHero } from "../data/heroes/test-hero";
import { Library } from "../models/sourcebook/library";
import { HeroesSourcebook } from "../models/sourcebook/heros-sourcebook";
import { AncestryCard } from "./ancestry/AncestryCard";
import { AncestryDetail } from "./ancestry/AncestryDetail";

export const HeroView: React.FC = () => {
  const [library, setLibrary] = useState<Library | null>(null);
  // Store the raw JSON state in React so it can be updated
  const [heroState, setHeroState] = useState(TestHero);
  const [hero, setHero] = useState<Hero | null>(null);
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    setLibrary(new Library([HeroesSourcebook]));
  }, []);

  // Any time the state JSON or library updates, we recalculate the rich model instance
  useEffect(() => {
    if (library) {
      Hero.create(heroState, library).then(setHero);
    }
  }, [heroState, library]);

  const [isAncestryOpen, setIsAncestryOpen] = useState(false);

  if (!library || !hero) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl font-bold text-gray-500">Loading Hero...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
          {hero.state.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AncestryCard
            hero={hero}
            onClick={() => setIsAncestryOpen(true)}
            library={library}
          />
        </div>
      </div>

      <AncestryDetail
        hero={hero}
        library={library}
        isOpen={isAncestryOpen}
        isEditable={isEditable}
        onClose={() => setIsAncestryOpen(false)}
        onHeroStateChange={setHeroState}
      />
    </div>
  );
};
