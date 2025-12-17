import { AbilityData } from 'forgesteel';
import { ClassicSheetBuilder } from 'forgesteel';
import { AbilityCard } from "../ability/AbilityCard";
import { Hero } from 'forgesteel';

interface StandardAbilitiesProps {
    hero?: Hero;
}

export function StandardAbilities({ hero }: StandardAbilitiesProps) {
    if (!hero) return <div></div>;

    let heroicResourceName = hero.getHeroicResources()[0].name;
    let standardAbilities = AbilityData.standardAbilities.map(a => ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined));
    return (
        <div className="flex flex-col gap-3 flex-1 min-h-0 m-2">
            <div className="flex gap-3 flex-wrap">
                {standardAbilities.map(ability => <AbilityCard key={ability.id} heroicResourceName={heroicResourceName} ability={ability} />)}
            </div>
        </div>
    )
}