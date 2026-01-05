import { useModalStore } from '@/stores/modalStore';
import { ComponentPropsWithoutRef } from 'react';

interface ShowDiceRollerButtonProps extends ComponentPropsWithoutRef<'div'> {
    characteristics?: Record<string, number>;
    cost?: number;
}

export function ShowDiceRollerButton({
    characteristics,
    cost,
    ...props
}: ShowDiceRollerButtonProps) {
    const setDiceRollerModalIsOpen = useModalStore((state) => state.setDiceRollerModalIsOpen);
    const setRollAttributes = useModalStore((state) => state.setDiceRollerAttributes);
    const setRollCost = useModalStore((state) => state.setRollCost);

    const getRollBonusFromCharacteristics = () => {
        if (!characteristics) return 0;
        let rollBonus = 0;
        for (const value of Object.values(characteristics)) {
            if (rollBonus < value) {
                rollBonus = value;
            }
        }
        return rollBonus;
    };

    const handleRollClick = () => {
        setRollCost(cost || 0);
        setRollAttributes({
            bonus: getRollBonusFromCharacteristics(),
        });
        setDiceRollerModalIsOpen(true);
    };

    return (
        <div className={props.className}>
            <button
                className="bg-sky-700 hover:bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                onClick={handleRollClick}
            >
                Roll Dice
            </button>
        </div>
    );
}
