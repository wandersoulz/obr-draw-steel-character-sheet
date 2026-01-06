import {
    Hero,
    ClassicSheetBuilder,
    AbilityKeyword,
    Characteristic,
    ElementFactory,
    AbilityUsage,
} from 'forgesteel';
import { AbilitySection } from './ability-section';
import { Activity, Flame, Footprints, Heart, Swords, Zap } from 'lucide-react';

interface CharacterAbilitiesProps {
    hero: Hero;
}

export function CharacterAbilities({ hero }: CharacterAbilitiesProps) {
    if (!hero) return <div></div>;

    const heroicResourceName = hero.getHeroicResources()[0].name;
    const abilities = hero.getAbilities([]).map((a) => a.ability);

    const freeStrikeMelee = ElementFactory.createAbility({
        id: 'free-melee',
        name: 'Free Strike (melee)',
        description: '',
        type: ElementFactory.AbilityTypeFactory.createFreeStrike(),
        keywords: [
            AbilityKeyword.Charge,
            AbilityKeyword.Melee,
            AbilityKeyword.Strike,
            AbilityKeyword.Weapon,
        ],
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

    let abilitySheets = abilities.map((a) =>
        ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined)
    );

    abilitySheets = abilitySheets.filter((ability, index) => {
        return index === abilitySheets.findIndex((t) => t.id === ability.id);
    });

    const mainActions = abilitySheets.filter(
        (ability) => ability.actionType == AbilityUsage.MainAction
    );
    const maneuvers = abilitySheets.filter(
        (ability) => ability.actionType == AbilityUsage.Maneuver
    );
    const freeStrikes = [freeStrikeMelee, freeStrikeRanged].map((a) =>
        ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined)
    );
    const movement = abilitySheets.filter((ability) => ability.actionType == AbilityUsage.Move);
    const triggeredActions = abilitySheets.filter(
        (ability) => ability.actionType == AbilityUsage.Trigger
    );

    const abilitySections = {
        'Main Action': mainActions,
        Maneuvers: maneuvers,
        'Free Strikes': freeStrikes,
        Move: movement,
        'Triggered Actions': triggeredActions,
    };

    const getIcon = (name: string) => {
        switch (name) {
            case 'Main Action':
                return Swords;
            case 'Maneuvers':
                return Zap;
            case 'Free Strikes':
                return Flame;
            case 'Triggered Actions':
                return Activity;
            case 'Move':
                return Footprints;
            default:
                return Heart;
        }
    };

    return (
        <div className="space-y-2">
            {Object.entries(abilitySections)
                .filter(([_, abilities]) => abilities.length > 0)
                .map(([name, abilities]) => (
                    <AbilitySection
                        name={name}
                        abilities={abilities}
                        icon={getIcon(name)}
                        color="violet"
                        heroicResourceName={heroicResourceName}
                        heroCharacteristics={Object.fromEntries(
                            hero.class!.characteristics.map((value) => {
                                return [value.characteristic, value.value];
                            })
                        )}
                    />
                ))}
        </div>
    );
}
