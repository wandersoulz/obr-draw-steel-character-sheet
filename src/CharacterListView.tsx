import { usePlayerCharacters } from "./hooks/usePlayerCharacters";
import { Link } from "react-router-dom";
import OBR from "@owlbear-rodeo/sdk";
import { WIZARD_ID } from "./constants";

interface CharacterListViewProps {
    playerId: string;
    role: "GM" | "PLAYER";
}

export default function CharacterListView({ playerId, role }: CharacterListViewProps) {
    const { characters } = usePlayerCharacters(playerId, role);
    if (characters.length === 0) {
        return (
            <div className="h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold mb-4">No Characters Found</h2>
                <p className="mb-6 text-gray-400 text-center">
                    You don't have any Draw Steel characters yet.
                </p>
                <button
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        OBR.popover.open({
                            id: WIZARD_ID,
                            url: "/#/Character_Wizard",
                            width: 600,
                            height: 600,
                        });
                    }}
                >
                    Create New Character
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Characters</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map(character => (
                    <li key={character.id} className="bg-slate-800 p-4 rounded hover:bg-slate-700">
                        <Link to={`/character/${character.id}`} className="flex flex-col h-full">
                            <p className="font-bold truncate">{character.name}</p>
                            <p className="text-xs text-slate-400 truncate"></p>
                        </Link>
                    </li>
                ))}
            </ul>
             <button
                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                    OBR.popover.open({
                        id: WIZARD_ID,
                        url: "/#/Character_Wizard",
                        width: 600,
                        height: 600,
                    });
                }}
                >
                    Create New Character
                </button>
        </div>
    );
}
