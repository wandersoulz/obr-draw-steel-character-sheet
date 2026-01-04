import { HeroLite } from '@/models/hero-lite';

interface CharacterNameProps {
    name: string;
    isGM: boolean;
    isOwner: boolean;
    onUpdate: (update: Partial<HeroLite>) => void;
}

export default function CharacterName({ name, isGM, isOwner, onUpdate }: CharacterNameProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onUpdate({ name: newValue });
    };

    return (
        <div className="group text-foreground w-full">
            <div className="grid grid-cols-2 pb-0.5">
                <div 
                    className="font-bold text-foreground col-span-2 col-start-1 row-start-1 block overflow-clip text-sm text-nowrap text-ellipsis opacity-100 transition-all duration-150"
                >
                    Character Name
                </div>
            </div>
            {isGM || isOwner ? <input className="w-32 font-bold col-start-1 row-start-1 h-full w-full bg-transparent text-center outline-hidden focus:border-b-2 focus:outline-none focus:border-blue-500" value={name} onChange={handleInputChange} /> : <h2 className="text-md font-bold">{name}</h2>}
        </div>
    );
}
