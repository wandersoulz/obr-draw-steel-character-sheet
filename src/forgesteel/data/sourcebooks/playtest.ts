import { KitData } from '@/forgesteel/data/kit-data';
import { PerkData } from '@/forgesteel/data/perk-data';
import { Sourcebook } from '@/forgesteel/models/sourcebook';
import { SourcebookType } from '@/forgesteel/enums/sourcebook-type';
import { TitleData } from '@/forgesteel/data/title-data';
import { beastheart } from '@/forgesteel/data/classes/beastheart/beastheart';
import { summoner } from '@/forgesteel/data/classes/summoner/summoner';

export const playtest: Sourcebook = {
	id: 'playtest',
	name: 'Playtest',
	description: 'Unreleased game content.',
	type: SourcebookType.Official,
	adventures: [],
	ancestries: [],
	careers: [],
	classes: [
		beastheart,
		summoner
	],
	complications: [],
	cultures: [],
	domains: [],
	encounters: [],
	imbuements: [],
	items: [],
	kits: [
		KitData.outrider,
		KitData.predator,
		KitData.stormcrow,
		KitData.warBeast
	],
	monsterGroups: [],
	montages: [],
	negotiations: [],
	perks: [
		PerkData.bornTracker,
		PerkData.rideAlong,
		PerkData.wildRumpus,
		PerkData.wildsExplorer,
		PerkData.peopleSense,
		PerkData.voiceOfTheWild,
		PerkData.youCanPetThem,
		PerkData.trainedThief
	],
	projects: [],
	subclasses: [],
	tacticalMaps: [],
	terrain: [],
	titles: [
		TitleData.safeguarded,
		TitleData.summonerSuccessor,
		TitleData.ringleader,
		TitleData.delegator,
		TitleData.highSummoner
	],
	skills: [],
	languages: []
};
