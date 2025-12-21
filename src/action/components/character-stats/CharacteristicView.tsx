import { Characteristic } from 'forgesteel';

interface CharacteristicProps {
    characteristic: Characteristic;
    modifier: number;
}

export default function CharacteristicView({ characteristic, modifier }: CharacteristicProps) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-xs font-bold">{characteristic}</span>
            <span className="text-md font-bold">{modifier}</span>
        </div>
    );
}
