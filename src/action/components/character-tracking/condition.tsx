import { useEffect, useState } from 'react';
import { ConditionInterface } from 'forgesteel';
import { HeroLite } from '@/models/hero-lite';
import InputBackground from '@/components/common/InputBackground';

interface ConditionProps {
    hero: HeroLite;
    name: string;
    condition: ConditionInterface;
    updateHero: (update: Partial<HeroLite>) => void;
}

export function Condition({ hero, name, updateHero, condition }: ConditionProps) {
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        const heroState = Object.assign({}, hero.state);
        if (selected) {
            // Add the condition
            heroState.conditions.push(condition);
            updateHero({ state: heroState });
        } else {
            const conditions = heroState.conditions.filter((cond) => cond.id != condition.id);
            updateHero({ state: { ...heroState, conditions } });
        }
    }, [selected]);

    return (
        <div onClick={() => setSelected(!selected)} className="flex">
            <InputBackground color={selected ? 'VIOLET' : 'DEFAULT'}>
                <div className="p-1.5 text-sm text-gray-900">{name}</div>
            </InputBackground>
        </div>
    );
}
