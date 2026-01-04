import { Hero, ClassicSheetBuilder, AbilityKeyword, Characteristic, ElementFactory } from 'forgesteel';
import { AbilityCard } from './ability/AbilityCard';

interface CharacterAbilitiesProps {
    hero: Hero;
}

export function CharacterAbilities({ hero }: CharacterAbilitiesProps) {
    if (!hero) return <div></div>;
    
    const heroicResourceName = hero.getHeroicResources()[0].name;
    const abilities = hero.getAbilities([]).map(a => a.ability);

    const freeStrikeMelee = ElementFactory.createAbility({
        id: 'free-melee',
        name: 'Free Strike (melee)',
        description: '',
        type: ElementFactory.AbilityTypeFactory.createFreeStrike(),
        keywords: [AbilityKeyword.Charge, AbilityKeyword.Melee, AbilityKeyword.Strike, AbilityKeyword.Weapon],
        distance: [ElementFactory.DistanceFactory.createMelee()],
        target: 'One creature or object',
        sections: [
            ElementFactory.createAbilitySectionRoll(
                ElementFactory.createPowerRoll({
                    characteristic: [Characteristic.Might, Characteristic.Agility],
                    tier1: '2 + M or A damage',
                    tier2: '5 + M or A damage',
                    tier3: '7 + M or A damage',
                })
            ),
        ],
    });

    const freeStrikeRanged = ElementFactory.createAbility({
        id: 'free-ranged',
        name: 'Free Strike (ranged)',
        description: '',
        type: ElementFactory.AbilityTypeFactory.createFreeStrike(),
        keywords: [AbilityKeyword.Ranged, AbilityKeyword.Strike, AbilityKeyword.Weapon],
        distance: [ElementFactory.DistanceFactory.createRanged(5)],
        target: 'One creature or object',
        sections: [
            ElementFactory.createAbilitySectionRoll(
                ElementFactory.createPowerRoll({
                    characteristic: [Characteristic.Might, Characteristic.Agility],
                    tier1: '2 + M or A damage',
                    tier2: '4 + M or A damage',
                    tier3: '6 + M or A damage',
                })
            ),
        ],
    });    

    const freeStrikes = [ freeStrikeMelee, freeStrikeRanged ]
        .map(a => ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined));
    let abilitySheets = freeStrikes.concat(abilities.map(a => ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined)));

    abilitySheets = abilitySheets.filter((ability, index) => {
        return index === abilitySheets.findIndex((t) => t.id === ability.id);
    });

    return (
        <div className="flex flex-col gap-3 flex-1 min-h-0 m-2">
            <div className="flex gap-3 flex-wrap">
                {abilitySheets.map(ability => <AbilityCard key={ability.id} heroicResourceName={heroicResourceName} ability={ability} />)}
            </div>
        </div>
    );
}