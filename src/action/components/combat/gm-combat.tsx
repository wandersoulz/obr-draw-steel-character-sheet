import { useEffect, useState } from 'react';
import OBR, { Item } from '@owlbear-rodeo/sdk';
import { useEnemyStore } from '@/stores/enemyStore';
import { METADATA_KEYS } from '@/constants';
import { TokenData } from '@/models/token-data';
import { useCombatStore } from '@/stores/combatStore';
import { Eye, EyeOff } from 'lucide-react';

const ENEMY_GROUP_METADATA_KEY = 'draw-steel-sheet/enemy-group-id';

interface ExtendedTokenData extends TokenData {
    tokenId: string;
}

export default function GMCombatView() {
    const [playerTokens, setPlayerTokens] = useState<ExtendedTokenData[]>([]);
    const [groupVisibility, setGroupVisibility] = useState<Record<string, boolean>>({});
    const { enemyGroups, groupNames, setGroupName } = useEnemyStore((state) => state);
    const {
        initiative,
        currentActor,
        enemiesActed,
        playersActed,
        startCombat,
        endCombat,
        takeTurn,
        endTurn,
        round,
    } = useCombatStore();

    useEffect(() => {
        const updateTokens = (items: Item[]) => {
            const players = items
                .filter(
                    (item) =>
                        item.layer === 'CHARACTER' &&
                        item.metadata[METADATA_KEYS.CHARACTER_DATA] !== undefined &&
                        item.metadata[ENEMY_GROUP_METADATA_KEY] === undefined
                )
                .map((item) => ({
                    ...(item.metadata[METADATA_KEYS.CHARACTER_DATA] as TokenData),
                    tokenId: item.id,
                }));
            setPlayerTokens(players);

            const newVisibility: Record<string, boolean> = {};
            items.forEach((item) => {
                const groupId = item.metadata[ENEMY_GROUP_METADATA_KEY] as string;
                if (groupId) {
                    newVisibility[groupId] =
                        newVisibility[groupId] === undefined
                            ? item.visible
                            : newVisibility[groupId] || item.visible;
                }
            });
            setGroupVisibility(newVisibility);
        };

        const fetchItems = async () => {
            if (await OBR.scene.isReady()) {
                const items = await OBR.scene.items.getItems();
                updateTokens(items);
            }
        };

        fetchItems();
        return OBR.scene.items.onChange(updateTokens);
    }, []);

    useEffect(() => {
        useCombatStore.setState({
            numPlayers: playerTokens.length,
            numEnemyGroups: Object.keys(enemyGroups).length,
        });
    }, [playerTokens.length, enemyGroups]);

    const toggleGroupVisibility = async (groupId: string, tokenIds: string[]) => {
        const isVisible = groupVisibility[groupId] ?? true;
        await OBR.scene.items.updateItems(tokenIds, (items) => {
            items.forEach((item) => {
                item.visible = !isVisible;
            });
        });
    };

    return (
        <div className="p-4 flex flex-col gap-6 text-white bg-slate-900 min-h-screen">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold border-b border-slate-700 pb-1">
                    Combat Controls
                </h2>
                {initiative === 'no-combat' ? (
                    <div className="flex flex-col gap-2 mt-1">
                        <button
                            onClick={() =>
                                startCombat(
                                    'enemies',
                                    playerTokens.length,
                                    Object.keys(enemyGroups).length
                                )
                            }
                            className="w-full bg-red-800/80 hover:bg-red-700 text-white px-3 py-2 text-sm rounded font-medium transition-colors border border-red-600 shadow-sm"
                        >
                            Start Combat (Enemies First)
                        </button>
                        <button
                            onClick={() =>
                                startCombat(
                                    'heroes',
                                    playerTokens.length,
                                    Object.keys(enemyGroups).length
                                )
                            }
                            className="w-full bg-indigo-800/80 hover:bg-indigo-700 text-white px-3 py-2 text-sm rounded font-medium transition-colors border border-indigo-600 shadow-sm"
                        >
                            Start Combat (Heroes First)
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700 shadow-sm mt-1">
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-200">
                                Round {round + 1}
                            </span>
                            <span className="text-xs text-slate-400">
                                Initiative:{' '}
                                <span className="capitalize font-semibold text-indigo-400">
                                    {initiative}
                                </span>
                            </span>
                        </div>
                        <button
                            onClick={() => endCombat()}
                            className="text-xs bg-slate-700 px-3 py-1.5 rounded hover:bg-slate-600 transition-colors font-medium border border-slate-600"
                        >
                            End Combat
                        </button>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-3 border-b border-slate-700 pb-1">Heroes</h2>
                <ul className="space-y-2">
                    {playerTokens.length === 0 && (
                        <li className="text-slate-400 italic">No player tokens found.</li>
                    )}
                    {playerTokens.map((token) => {
                        const hasActed = playersActed.includes(token.tokenId);
                        const isMyTurn = currentActor === token.tokenId;
                        const canStartTurn =
                            initiative === 'heroes' && !hasActed && currentActor === '';

                        return (
                            <li
                                key={token.tokenId}
                                className="bg-slate-800 p-2 rounded shadow-sm border border-slate-700 flex flex-col gap-2"
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <span className="font-semibold text-indigo-400 px-1">
                                        {token.name || 'Unnamed Token'}
                                    </span>
                                </div>

                                {canStartTurn && (
                                    <button
                                        onClick={() => takeTurn(token.tokenId)}
                                        className="w-full bg-indigo-700 hover:bg-indigo-600 text-white text-sm py-1.5 rounded font-medium transition-colors border border-indigo-600 shadow-sm"
                                    >
                                        Start Turn
                                    </button>
                                )}

                                {isMyTurn && (
                                    <button
                                        onClick={() => {
                                            endTurn(token.tokenId);
                                            takeTurn('');
                                        }}
                                        className="w-full bg-red-700 hover:bg-red-600 text-white text-sm py-1.5 rounded font-medium transition-colors border border-red-600 shadow-sm flex justify-center items-center gap-2"
                                    >
                                        End Turn
                                    </button>
                                )}

                                {hasActed && !isMyTurn && (
                                    <div className="w-full text-center text-xs text-slate-500 font-medium py-1 bg-slate-900/50 rounded border border-slate-700/50">
                                        Acted this round
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-3 border-b border-slate-700 pb-1">
                    Enemy Groups
                </h2>
                <ul className="space-y-2">
                    {Object.keys(enemyGroups).length === 0 && (
                        <li className="text-slate-400 italic">No enemy groups found.</li>
                    )}
                    {Object.entries(enemyGroups).map(([groupId, tokens]) => {
                        const hasActed = enemiesActed.includes(groupId);
                        const isMyTurn = currentActor === groupId;
                        const canStartTurn =
                            initiative === 'enemies' && !hasActed && currentActor === '';
                        const isVisible = groupVisibility[groupId] ?? true;

                        return (
                            <li
                                key={groupId}
                                className="bg-slate-800 p-2 rounded shadow-sm border border-slate-700 flex flex-col gap-2"
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <input
                                        type="text"
                                        value={
                                            groupNames?.[groupId] ??
                                            `Group ${groupId.substring(0, 4)}`
                                        }
                                        onChange={(e) => setGroupName(groupId, e.target.value)}
                                        className="font-semibold text-red-400 bg-transparent border-b border-transparent hover:border-slate-600 focus:border-red-400 focus:outline-none px-1 rounded w-full transition-colors"
                                        placeholder={`Group ${groupId.substring(0, 4)}`}
                                    />
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleGroupVisibility(groupId, tokens)}
                                            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-700"
                                            title={
                                                isVisible
                                                    ? 'Hide tokens from players'
                                                    : 'Show tokens to players'
                                            }
                                        >
                                            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <span className="text-sm text-slate-300 bg-slate-700 px-2 py-1 rounded-full whitespace-nowrap">
                                            {tokens.length} Tokens
                                        </span>
                                    </div>
                                </div>

                                {canStartTurn && (
                                    <button
                                        onClick={() => takeTurn(groupId)}
                                        className="w-full bg-indigo-700 hover:bg-indigo-600 text-white text-sm py-1.5 rounded font-medium transition-colors border border-indigo-600 shadow-sm"
                                    >
                                        Start Turn
                                    </button>
                                )}

                                {isMyTurn && (
                                    <button
                                        onClick={() => {
                                            endTurn(groupId);
                                            takeTurn('');
                                        }}
                                        className="w-full bg-red-700 hover:bg-red-600 text-white text-sm py-1.5 rounded font-medium transition-colors border border-red-600 shadow-sm flex justify-center items-center gap-2"
                                    >
                                        End Turn
                                    </button>
                                )}

                                {hasActed && !isMyTurn && (
                                    <div className="w-full text-center text-xs text-slate-500 font-medium py-1 bg-slate-900/50 rounded border border-slate-700/50">
                                        Acted this round
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
