import { AbilityData } from 'forgesteel';
import { ClassicSheetBuilder } from 'forgesteel';
import { AbilityCard } from "../ability/AbilityCard";
import { Hero } from 'forgesteel';
import { HeroLogic } from 'forgesteel';

interface StandardAbilitiesProps {
    hero?: Hero;
}

export function StandardAbilities({ hero }: StandardAbilitiesProps) {
    if (!hero) return <div></div>;

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