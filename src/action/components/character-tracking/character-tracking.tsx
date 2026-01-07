import { Hero } from 'forgesteel';
import { HeroLite } from '@/models/hero-lite';
import { useMemo } from 'react';
import { Trackers } from './trackers';
import { CharacterStats } from './character-stats';
import { Vitality } from './vitality';
import { Conditions } from './conditions';
import { Skills } from './skills';

interface SheetHeaderProps {
    hero: Hero;
    isOwner: boolean;
    onUpdate: (update: Partial<HeroLite>) => void;
}

export function CharacterTracking({ hero, onUpdate }: SheetHeaderProps) {
    const heroicResourceName = useMemo(() => hero.getHeroicResources()[0].name, [hero]);

    const getOnStateValueChange = (stateFieldName: string) => {
        return (newValue: number) => {
            if (stateFieldName == heroicResourceName.toLowerCase()) {
                onUpdate({ heroicResourceValue: newValue });
            } else {
                onUpdate({
                    state: {
                        ...hero.state,
                        [stateFieldName]: newValue,
                    },
                });
            }
        };
    };

    if (!hero) return <div></div>;

    return (
        <div className="flex flex-col gap-2 font-sans">
            <div className="flex sm:flex-row flex-col gap-2">
                <Trackers
                    hero={hero}
                    heroicResourceName={heroicResourceName}
                    onValueChanged={getOnStateValueChange}
                />
                <Vitality hero={hero} onUpdate={onUpdate} onValueChanged={getOnStateValueChange} />
            </div>
            <div className="flex sm:flex-row flex-col gap-2">
                <CharacterStats hero={hero} />
                <Conditions hero={hero} onUpdate={onUpdate} />
            </div>
            <div className="flex">
                <Skills hero={hero} />
            </div>
        </div>
    );
}
