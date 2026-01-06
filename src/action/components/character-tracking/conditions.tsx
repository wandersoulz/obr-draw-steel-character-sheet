import { ConditionEndType, ConditionLogic, ConditionType, Hero } from 'forgesteel';
import { Condition } from './condition';
import { Info } from 'lucide-react';
import OBR from '@owlbear-rodeo/sdk';
import { HeroLite } from '@/models/hero-lite';

interface ConditionsProps {
    hero: Hero;
    onUpdate: (update: Partial<HeroLite>) => void;
}

export function Conditions({ hero, onUpdate }: ConditionsProps) {
    return (
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
            <div className="flex flex-row bg-indigo-900 text-white p-2">
                <h2 className="text-sm font-bold">Conditions</h2>
                <div className="flex flex-row text-sm font-bold ml-auto">
                    <Info
                        size={20}
                        onClick={() => {
                            OBR.action.close();
                            OBR.popover.open({
                                id: 'rules-reference-viewer-draw-steel',
                                url: '/rules-ref.html?filter=condition',
                                height: 2000,
                                width: 500,
                                anchorOrigin: {
                                    horizontal: 'RIGHT',
                                    vertical: 'BOTTOM',
                                },
                                transformOrigin: {
                                    horizontal: 'CENTER',
                                    vertical: 'CENTER',
                                },
                                disableClickAway: true,
                            });
                        }}
                    />
                </div>
            </div>
            <div className="columns-1 md:columns-3 gap-2 p-2">
                {Object.values(ConditionType)
                    .filter(
                        (conditionType) =>
                            conditionType != ConditionType.Custom &&
                            conditionType != ConditionType.Quick
                    )
                    .map((conditionType) => {
                        return (
                            <div key={conditionType} className="break-inside-avoid mb-2">
                                <Condition
                                    name={conditionType}
                                    condition={{
                                        id: conditionType,
                                        type: conditionType,
                                        text: ConditionLogic.getDescription(conditionType),
                                        ends: ConditionEndType.UntilRemoved,
                                    }}
                                    hero={HeroLite.fromHero(hero)}
                                    updateHero={onUpdate}
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
