import { useParams, useNavigate } from 'react-router-dom';
import { CharacterTracking } from '../components/character-tracking/character-tracking';
import { HeroLite } from '../../models/hero-lite';
import { ChangeEvent, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { CharacterAbilities } from '../components/abilities/character-abilities';
import { Features } from '../components/features/features';
import { useGm } from '@/hooks/useGm';
import {
    ActiveSourcebooks,
    CoreUtils,
    ElementInterface,
    FeatureTitleChoiceInterface,
    FeatureType,
    ItemInterface,
    TitleInterface,
} from 'forgesteel';
import { FeatureSelectModal } from '../components/controls/FeatureSelectModal';
import { useDebounce } from '@/hooks/useDebounce';
import { DiceRollerModal } from '../components/dice/dice-roller-modal';
import { useModalStore } from '@/stores/modalStore';
import { PlayerCombat } from '../components/combat/player-combat';
import { useCombatStore } from '@/stores/combatStore';
import { usePlayerCombat } from '@/hooks/usePlayerCombat';
import OBR from '@owlbear-rodeo/sdk';
import { createRollRequest, useDiceRoller } from '@/hooks/useDiceRoller';
import { RollResult } from '@/utils/dice-protocol';

interface CharacterSheetProps {
    forgeSteelLoaded: boolean;
    playerRole?: 'GM' | 'PLAYER';
}

export function CharacterSheet({ forgeSteelLoaded, playerRole }: CharacterSheetProps) {
    const [features, setFeatures] = useState<ElementInterface[]>([]);
    const [activeTab, setActiveTab] = useState('tracking');
    const [activeCharacter, setActiveCharacter] = useState<HeroLite>();
    const { characterId } = useParams<{ characterId: string }>();
    const navigate = useNavigate();
    const { characters, getCharacters, updateCharacter } = usePlayer();
    const { playerCharacters, getPlayerCharacters, setPlayerCharacters } = useGm();
    const characterName = useDebounce(activeCharacter?.name, 500);
    const diceRollerModalIsOpen = useModalStore((state) => state.diceRollerModalIsOpen);
    const featureModalIsOpen = useModalStore((state) => state.featureModalIsOpen);
    const setFeatureModalIsOpen = useModalStore((state) => state.setFeatureModalIsOpen);
    const rollAttributes = useModalStore((state) => state.diceRollerAttributes);
    const [modalType, setModalType] = useState('');
    const { initiative, startCombat, numPlayers, numEnemyGroups } = useCombatStore();
    const combatState = usePlayerCombat(activeCharacter?.tokenId);
    const diceRoller = useDiceRoller<RollResult>({ rollReplyChannel: 'initiative-roller-result' });

    const tabs = ['tracking', 'features', 'class abilities'];
    if (initiative != 'no-combat') {
        tabs.push('combat');
    }

    useEffect(() => {
        const character = characters.find((character) => character.id == characterId);
        if (!character) return;
        updateCharacter(character!, { name: characterName });
    }, [characterName]);

    useEffect(() => {
        Promise.resolve(() => {
            if (forgeSteelLoaded) {
                const character = getCharacters().find((c) => c.id === characterId);
                if (character) setActiveCharacter(character);
                else {
                    if (playerRole == 'PLAYER') throw new Error('Chosen character not found');

                    const character = Object.values(getPlayerCharacters())
                        .flat()
                        .find((hero: HeroLite) => hero.id == characterId);
                    if (!character)
                        throw new Error('Chosen character cannot be found among players');
                    setActiveCharacter(character);
                }
            }
        });
    }, [forgeSteelLoaded]);

    useEffect(() => {
        Promise.resolve().then(() => {
            const character = characters.find((c) => c.id === characterId);
            if (character) setActiveCharacter(character);
            else {
                if (playerRole == 'PLAYER') throw new Error('Chosen character not found');

                const character = Object.values(getPlayerCharacters())
                    .flat()
                    .find((hero: HeroLite) => hero.id == characterId);
                if (!character) throw new Error('Chosen character cannot be found among players');
                setActiveCharacter(character);
            }
        });
    }, [characters, playerCharacters, characterId, playerRole, getPlayerCharacters]);

    const onUpdate = (partialCharacter: Partial<HeroLite>) => {
        if (!activeCharacter) return;

        const currCharacter = getCharacters().find((c) => c.id == activeCharacter.id);
        if (currCharacter) {
            const updatedChar: HeroLite = Object.assign(currCharacter, partialCharacter);
            setActiveCharacter(updatedChar);
            updateCharacter(currCharacter, partialCharacter);
        } else {
            const newPlayerCharacters = Object.fromEntries(
                Object.entries(getPlayerCharacters()).map(([playerId, characters]) => {
                    const currCharacter = characters.find(
                        (character) => character.id == activeCharacter.id
                    );
                    if (currCharacter) {
                        const updatedChar: HeroLite = Object.assign(
                            currCharacter,
                            partialCharacter
                        );
                        setActiveCharacter(currCharacter);
                        return [
                            playerId,
                            characters.map((character) =>
                                character.id == updatedChar.id ? updatedChar : character
                            ),
                        ];
                    }
                    return [playerId, characters];
                })
            );
            setPlayerCharacters(newPlayerCharacters);
        }
    };

    const showFeatureSelectModal = (features: ElementInterface[], modalType: string) => {
        setModalType(modalType);
        setFeatures(features);
        setFeatureModalIsOpen(true);
    };

    const handleAddItem = () => {
        const items = ActiveSourcebooks.getInstance().getItems();
        showFeatureSelectModal(items, 'items');
    };

    const handleAddTitle = () => {
        const titles = ActiveSourcebooks.getInstance().getTitles();
        showFeatureSelectModal(titles, 'titles');
    };

    const handleOnModalClose = (feature: ElementInterface) => {
        if (!activeCharacter) return;
        const partialCharacter: Partial<HeroLite> = {};
        const itemFeature = feature as ItemInterface;
        if (modalType == 'items') {
            const activeInventory = activeCharacter.state.inventory || [];
            activeInventory.push(itemFeature);
            partialCharacter.state = {
                ...activeCharacter.state,
                inventory: activeInventory,
            };
        } else {
            const titleFeature = feature as TitleInterface;
            partialCharacter.features = [
                ...activeCharacter.features,
                {
                    id: CoreUtils.guid(),
                    name: `${feature.name}`,
                    type: FeatureType.TitleChoice,
                    data: {
                        count: 1,
                        echelon: titleFeature.echelon,
                        selected: [titleFeature],
                    },
                } as FeatureTitleChoiceInterface,
            ];
        }
        const updatedChar: HeroLite = Object.assign(activeCharacter, partialCharacter);
        setModalType('');
        setActiveCharacter(updatedChar);
        updateCharacter(activeCharacter, partialCharacter);
        setFeatureModalIsOpen(false);
    };

    const handleCharacterNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (activeCharacter) {
            const updatedChar: HeroLite = Object.assign(
                {},
                Object.assign(activeCharacter, { name: event.target.value })
            );
            setActiveCharacter(updatedChar);
        }
    };

    const handleDrawSteel = () => {
        if (diceRoller.config !== undefined)
            diceRoller
                .requestRoll(createRollRequest('initiative-die-roll', ['1d10'], 0))
                .then((data) => {
                    const roll = data.result
                        .map((r) => r.result)
                        .reduce((prev, curr) => prev + curr, 0);
                    const startingInitiative = roll >= 6 ? 'heroes' : 'enemies';
                    startCombat(startingInitiative, numPlayers, numEnemyGroups);
                    OBR.notification.show(
                        startingInitiative == 'heroes'
                            ? 'Heroes act first!'
                            : 'Director has the first turn!'
                    );
                });
    };

    if (!forgeSteelLoaded) return <div></div>;

    if (!activeCharacter) {
        return (
            <div className="h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold mb-4">Character Not Found</h2>
            </div>
        );
    }
    const character = HeroLite.fromHeroLiteInterface(activeCharacter);
    const fullHero = character.toHero();
    const level = fullHero.class?.level || 1;
    const ancestry = fullHero.ancestry?.name;
    const className = fullHero.class?.name;
    return (
        <div className="h-screen w-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
            <FeatureSelectModal
                features={features}
                isOpen={featureModalIsOpen}
                handleOnClose={handleOnModalClose}
            />
            <DiceRollerModal
                hero={activeCharacter}
                updateHero={onUpdate}
                isOpen={diceRollerModalIsOpen}
                initialRollAttributes={rollAttributes}
            />
            <div className="w-full bg-slate-700 flex flex-col h-full overflow-hidden">
                <div className="flex-shrink-0">
                    {/* Header */}
                    <header className="bg-slate-900 shadow-lg border-b border-slate-700 px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-1 md:gap-0 flex-shrink-0">
                        <div className="w-full md:w-auto flex justify-start">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors pl-2 pt-2 md:pl-0 md:pt-0 -ml-2 md:ml-0"
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>
                        </div>

                        <div className="text-center w-full md:flex-1 md:mx-4 flex flex-col justify-center">
                            <input
                                className="w-full text-xl text-center font-bold text-slate-100 bg-transparent outline-none placeholder-slate-600 focus:text-white"
                                value={activeCharacter.name}
                                onChange={handleCharacterNameChange}
                                placeholder="Character Name"
                            />
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                {ancestry} • {className} • Level {level}
                            </p>
                        </div>

                        <div className="w-full md:w-auto flex items-center justify-center gap-3">
                            {initiative === 'no-combat' && (
                                <button
                                    onClick={handleDrawSteel}
                                    className="px-2 py-1 md:px-3 md:py-1 text-sm md:text-xs font-bold rounded-full bg-red-700 text-red-100 border border-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-sm"
                                >
                                    Draw Steel!
                                </button>
                            )}
                            <button
                                onClick={handleAddItem}
                                className="px-2 py-1 md:px-3 md:py-1 text-sm md:text-xs font-medium rounded-full bg-indigo-900 text-indigo-100 border border-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors"
                            >
                                Add Item
                            </button>
                            <button
                                onClick={handleAddTitle}
                                className="px-2 py-1 md:px-3 md:py-1 text-sm md:text-xs font-medium rounded-full bg-indigo-900 text-indigo-100 border border-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors"
                            >
                                Add Title
                            </button>
                        </div>
                    </header>
                    <div className="flex bg-slate-900 flex-shrink-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 text-sm font-medium capitalize transition-all relative ${
                                    activeTab === tab
                                        ? 'text-indigo-200'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col no-scrollbar overflow-y-auto bg-slate-700">
                    <div className="flex flex-col flex-1 p-2 gap-4">
                        {activeTab == 'tracking' && (
                            <CharacterTracking
                                hero={fullHero}
                                isOwner={false}
                                onUpdate={onUpdate}
                            />
                        )}
                        {activeTab == 'class abilities' && <CharacterAbilities hero={fullHero} />}
                        {activeTab == 'features' && (
                            <Features updateHero={onUpdate} hero={fullHero} />
                        )}
                        {activeTab == 'combat' && (
                            <PlayerCombat
                                hero={fullHero}
                                activeCharacter={activeCharacter}
                                onUpdate={onUpdate}
                                combatState={combatState}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
