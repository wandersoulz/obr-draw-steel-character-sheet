import { useParams, useNavigate } from 'react-router-dom';
import CharacterStats from '../components/character-stats/CharacterStats';
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

interface CharacterSheetProps {
    forgeSteelLoaded: boolean;
    playerRole?: 'GM' | 'PLAYER';
}

export function CharacterSheet({ forgeSteelLoaded, playerRole }: CharacterSheetProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [features, setFeatures] = useState<ElementInterface[]>([]);
    const [activeTab, setActiveTab] = useState('tracking');
    const [activeCharacter, setActiveCharacter] = useState<HeroLite>();
    const { characterId } = useParams<{ characterId: string }>();
    const navigate = useNavigate();
    const { characters, getCharacters, updateCharacter } = usePlayer();
    const { playerCharacters, getPlayerCharacters, setPlayerCharacters } = useGm();
    const characterName = useDebounce(activeCharacter?.name, 500);

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

    const showFeatureSelectModal = (features: ElementInterface[]) => {
        setFeatures(features);
        setIsModalOpen(true);
    };

    const handleAddItem = () => {
        const items = ActiveSourcebooks.getInstance().getItems();
        showFeatureSelectModal(items);
    };

    const handleAddTitle = () => {
        const titles = ActiveSourcebooks.getInstance().getTitles();
        showFeatureSelectModal(titles);
    };

    const handleOnModalClose = (feature: ElementInterface) => {
        if (!activeCharacter) return;
        const partialCharacter: Partial<HeroLite> = {};
        const itemFeature = feature as ItemInterface;
        if ('type' in itemFeature && itemFeature.type.indexOf('Item') > -1) {
            partialCharacter.state = {
                ...activeCharacter.state,
                inventory: [itemFeature],
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
        setActiveCharacter(updatedChar);
        updateCharacter(activeCharacter, partialCharacter);
        setIsModalOpen(false);
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
                isOpen={isModalOpen}
                handleOnClose={handleOnModalClose}
            />
            <div className="w-full bg-slate-800 rounded-lg flex flex-col h-full overflow-hidden">
                <div className="flex-shrink-0">
                    {/* Header */}
                    <div className="z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-between flex-shrink-0 rounded-2xl">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={14} />
                            Back
                        </button>

                        <div className="text-center flex-1">
                            <input
                                className="text-base text-center font-bold text-amber-400"
                                value={activeCharacter.name}
                                onChange={handleCharacterNameChange}
                            />
                            <p className="text-xs text-slate-300">
                                {ancestry} • {className} • Level {level}
                            </p>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-300">
                            <button
                                onClick={handleAddItem}
                                className="hover:text-white transition-colors rounded bg-green-800 hover:bg-green-700 p-1"
                            >
                                Add Item
                            </button>
                            <button
                                onClick={handleAddTitle}
                                className="hover:text-white transition-colors rounded bg-blue-800 hover:bg-blue-700 p-1"
                            >
                                Add Title
                            </button>
                        </div>
                    </div>
                    <div className="flex border-b border-slate-600 bg-slate-750 flex-shrink-0">
                        {['tracking', 'features', 'class abilities'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-1 text-xs font-medium capitalize transition-colors bg-slate-800 ${
                                    activeTab === tab
                                        ? 'text-amber-400 border-b-2 border-amber-400'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col no-scrollbar overflow-y-auto">
                    <div className="flex flex-col flex-1 p-1">
                        {activeTab == 'tracking' && (
                            <CharacterStats hero={fullHero} isOwner={false} onUpdate={onUpdate} />
                        )}
                        {activeTab == 'class abilities' && <CharacterAbilities hero={fullHero} />}
                        {activeTab == 'features' && (
                            <Features updateHero={onUpdate} hero={fullHero} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
