import { Hero } from 'forgesteel';
import { CounterTracker } from '../controls/CounterTracker';
import { HeroLite } from '@/models/hero-lite';
import parseNumber from '@/utils/input';

interface TrackersProps {
    hero: Hero;
    heroicResourceName: string;
    onValueChanged: (fieldName: string) => (value: number) => void;
}
export function Trackers({ hero, heroicResourceName, onValueChanged }: TrackersProps) {
    const counters = {
        Surges: hero.state.surges,
        Wealth: hero.state.wealth,
        XP: hero.state.xp,
        Renown: hero.state.renown,
        Victories: hero.state.victories,
        [heroicResourceName]: HeroLite.fromHero(hero).heroicResourceValue,
    };

    return (
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
            <div className="bg-indigo-900 text-white p-2">
                <h2 className="text-sm font-bold">Status Trackers</h2>
            </div>
            <div className="p-2 grid grid-cols-3 gap-2">
                {Object.entries(counters).map(([key, value]) => (
                    <CounterTracker
                        key={key}
                        label={key}
                        parentValue={value}
                        incrementHandler={() => onValueChanged(key.toLowerCase())(value + 1)}
                        decrementHandler={() => onValueChanged(key.toLowerCase())(value - 1)}
                        updateHandler={(target) =>
                            onValueChanged(key.toLowerCase())(
                                parseNumber(target.value, {
                                    min: -999,
                                    max: 999,
                                    truncate: true,
                                    inlineMath: { previousValue: value },
                                })
                            )
                        }
                    />
                ))}
            </div>
        </div>
    );
}
