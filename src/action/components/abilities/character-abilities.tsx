import {
    Hero,
    ClassicSheetBuilder,
    ElementFactory,
    AbilityUsage,
    AbilityKeyword,
    Characteristic,
} from 'forgesteel';
import { AbilitySection } from './ability-section';
import {
    Activity,
    Ban,
    Crown,
    Eye,
    EyeOff,
    Flame,
    Footprints,
    Heart,
    Swords,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { AbilityData } from 'forgesteel/data';

const SECTION_THEME = {
    'Main Action': { color: '#2563eb', icon: Swords }, // blue-600
    Maneuvers: { color: '#059669', icon: Footprints }, // emerald-600
    'Free Strikes': { color: '#441950ff', icon: Flame }, // slate-500
    'Triggered Actions': { color: '#d97706', icon: Activity }, // amber-600
    Move: { color: '#059669', icon: Footprints }, // emerald-600
    Default: { color: '#3f3f46', icon: Heart }, // zinc-700
};

interface CharacterAbilitiesProps {
    hero: Hero;
}

export function CharacterAbilities({ hero }: CharacterAbilitiesProps) {
    if (!hero) return <div></div>;
    const [showStandard, setShowStandard] = useState(false);
    const [showHeroic, setShowHeroic] = useState(true);
    const [showSignature, setShowSignature] = useState(true);

    const heroicResource = hero.getHeroicResources()[0];
    const heroicResourceName = heroicResource.name;
    const abilities = hero.getAbilities([]).map((a) => a.ability);
    const heroicAbilities = abilities.filter((a) => a.cost != 'signature' && a.cost > 0);
    const minHeroicCost =
        heroicAbilities.length > 0 ? Math.min(...heroicAbilities.map((a) => a.cost as number)) : 0;
    const isHeroicDisabled = heroicAbilities.length > 0 && heroicResource.value < minHeroicCost;

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

    if (showStandard) {
        AbilityData.standardAbilities.forEach((a) => abilities.push(a));
    }

    let abilitySheets = abilities.map((a) =>
        ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined)
    );

    abilitySheets = abilitySheets.filter((ability, index) => {
        return index === abilitySheets.findIndex((t) => t.id === ability.id);
    });

    const filteredAbilities = abilitySheets.filter((ability) => {
        const isHeroic = ability.abilityType === 'Heroic Ability';
        const isSignature = ability.isSignature;

        if (isHeroic && !showHeroic) return false;
        if (isSignature && !showSignature) return false;

        if (isHeroic && ability.cost > heroicResource.value) return false;

        return true;
    });

    const mainActions = filteredAbilities.filter(
        (ability) => ability.actionType == AbilityUsage.MainAction
    );
    const maneuvers = filteredAbilities.filter(
        (ability) => ability.actionType == AbilityUsage.Maneuver
    );
    const freeStrikes = [freeStrikeMelee, freeStrikeRanged].map((a) =>
        ClassicSheetBuilder.buildAbilitySheet(a, hero, undefined)
    );
    const movement = filteredAbilities.filter((ability) => ability.actionType == AbilityUsage.Move);
    const triggeredActions = filteredAbilities.filter(
        (ability) => ability.actionType == AbilityUsage.Trigger
    );

    const abilitySections = {
        'Main Action': mainActions,
        Maneuvers: maneuvers,
        'Free Strikes': freeStrikes,
        Move: movement,
        'Triggered Actions': triggeredActions,
        ...(showStandard ? { 'Free Strikes': freeStrikes } : {}),
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-end gap-2 px-1">
                <button
                    onClick={() => !isHeroicDisabled && setShowHeroic(!showHeroic)}
                    disabled={isHeroicDisabled}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all border
                        ${
                            isHeroicDisabled
                                ? 'bg-slate-900/50 text-slate-500 border-slate-800 cursor-default grayscale' // DISABLED STYLE
                                : showHeroic
                                  ? 'bg-violet-900/50 text-violet-200 border-violet-600 hover:bg-violet-900 shadow-[0_0_10px_rgba(124,58,237,0.2)]'
                                  : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700 hover:text-slate-300 opacity-60'
                        }
                    `}
                >
                    {isHeroicDisabled ? (
                        <Ban className="w-3.5 h-3.5" />
                    ) : (
                        <Crown className="w-3.5 h-3.5" />
                    )}

                    {/* Dynamic Label: Shows Resource Count if Disabled */}
                    <span>
                        {isHeroicDisabled
                            ? `No ${heroicResource.name}`
                            : `Heroic (${heroicResource.value})`}
                    </span>
                </button>
                <button
                    onClick={() => setShowSignature(!showSignature)}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all border
                        ${
                            showSignature
                                ? 'bg-cyan-900/50 text-cyan-200 border-cyan-600 hover:bg-cyan-900 shadow-[0_0_10px_rgba(8,145,178,0.2)]'
                                : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700 hover:text-slate-300 opacity-60'
                        }
                    `}
                >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Signature</span>
                </button>

                <div className="w-px h-6 bg-slate-700 mx-1" />
                <div className="flex items-center justify-end px-1">
                    <button
                        onClick={() => setShowStandard(!showStandard)}
                        className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border
                        ${
                            showStandard
                                ? 'bg-indigo-900/50 text-indigo-200 border-indigo-700 hover:bg-indigo-900'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                        }
                    `}
                    >
                        {showStandard ? (
                            <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Standard Actions: ON</span>
                            </>
                        ) : (
                            <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Standard Actions: OFF</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
            <div className="space-y-6">
                {Object.entries(abilitySections)
                    .filter(([_, abilities]) => abilities.length > 0)
                    .map(([name, abilities]) => {
                        const theme =
                            SECTION_THEME[name as keyof typeof SECTION_THEME] ||
                            SECTION_THEME['Default'];

                        return (
                            <AbilitySection
                                key={name}
                                name={name}
                                abilities={abilities}
                                icon={theme.icon}
                                color={theme.color}
                                heroicResourceName={heroicResourceName}
                                heroCharacteristics={Object.fromEntries(
                                    hero.class!.characteristics.map((value) => [
                                        value.characteristic,
                                        value.value,
                                    ])
                                )}
                            />
                        );
                    })}
            </div>
        </div>
    );
}
