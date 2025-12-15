import { AbilityData } from "@/forgesteel/data/ability-data";
import { ClassicSheetBuilder } from "@/forgesteel/logic/classic-sheet/classic-sheet-builder";
import { AbilityCard } from "../ability/AbilityCard";
import { Hero } from "@/forgesteel/models/hero";
import { HeroLogic } from "@/forgesteel/logic/hero-logic";

interface StandardAbilitiesProps {
    hero: Hero;
}

export function StandardAbilities({ hero }: StandardAbilitiesProps) {
    let heroicResourceName = HeroLogic.getHeroicResources(hero)[0].name;
    let standardAbilities = AbilityData.standardAbilities.map(a => ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined));
    return (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
            <div>
                <div className="flex gap-3 flex-wrap overflow-hidden">
                    {standardAbilities.map(ability => <AbilityCard key={ability.id} heroicResourceName={heroicResourceName} ability={ability} />)}
                </div>
            </div>
        </div>
    )
}