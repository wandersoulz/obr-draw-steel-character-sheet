import { Hero } from 'forgesteel';
import { HeroLite } from '@/models/hero-lite';
import { TrackerRow } from '../controls/TrackerRow';

interface TrackersProps {
    hero: Hero;
    heroicResourceName: string;
    onValueChanged: (fieldName: string) => (value: number) => void;
}
export function Trackers({ hero, heroicResourceName, onValueChanged }: TrackersProps) {
    const combatCounters = {
        [heroicResourceName]: HeroLite.fromHero(hero).heroicResourceValue,
        Surges: hero.state.surges,
        Victories: hero.state.victories,
    };

    const otherCounters = {
        XP: hero.state.xp,
        Wealth: hero.state.wealth,
        Renown: hero.state.renown,
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 w-full flex-[2]">
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                <div className="bg-indigo-900 text-white p-2">
                    <h2 className="text-sm font-bold">Combat Status Trackers</h2>
                </div>
                <div className="p-2 space-y-2">
                    {Object.entries(combatCounters).map(([key, value]) => (
                        <TrackerRow
                            key={key}
                            label={key}
                            value={value}
                            onIncrement={() => onValueChanged(key.toLowerCase())(value + 1)}
                            onDecrement={() => onValueChanged(key.toLowerCase())(value - 1)}
                            onUpdateValue={(val) => onValueChanged(key.toLowerCase())(val)}
                        />
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                <div className="bg-indigo-900 text-white p-2">
                    <h2 className="text-sm font-bold">Non-Combat Status Trackers</h2>
                </div>
                <div className="p-2 space-y-2">
                    {Object.entries(otherCounters).map(([key, value]) => (
                        <TrackerRow
                            key={key}
                            label={key}
                            value={value}
                            onIncrement={() => onValueChanged(key.toLowerCase())(value + 1)}
                            onDecrement={() => onValueChanged(key.toLowerCase())(value - 1)}
                            onUpdateValue={(val) => onValueChanged(key.toLowerCase())(val)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
