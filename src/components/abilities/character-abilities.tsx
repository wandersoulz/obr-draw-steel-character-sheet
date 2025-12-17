import { AbilityData } from 'forgesteel';
import { ClassicSheetBuilder } from 'forgesteel';
import { Hero } from 'forgesteel';
import { AbilityCard } from "../ability/AbilityCard";

interface CharacterAbilitiesProps {
    hero?: Hero;
}

export function CharacterAbilities({ hero }: CharacterAbilitiesProps) {
    if (!hero) return <div></div>;
    
    const heroicResourceName = hero.getHeroicResources()[0].name;
    const abilities = hero.getAbilities([]).map(a => a.ability);

    const freeStrikes = [ AbilityData.freeStrikeMelee, AbilityData.freeStrikeRanged ]
        .map(a => ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined));
    let abilitySheets = abilities.map(a => ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined)).concat(freeStrikes);

    abilitySheets = abilitySheets.filter((ability, index) => {
        return index === abilitySheets.findIndex((t) => t.id === ability.id)
    });

    return (
        <div className="flex flex-col gap-3 flex-1 min-h-0 m-2">
            <div className="flex gap-3 flex-wrap">
                {abilitySheets.map(ability => <AbilityCard key={ability.id} heroicResourceName={heroicResourceName} ability={ability} />)}
            </div>
        </div>
    )
}