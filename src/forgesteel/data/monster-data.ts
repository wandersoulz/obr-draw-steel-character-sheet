import { FactoryLogic } from '@/forgesteel/logic/factory-logic';
import { StatBlockIcon } from '@/forgesteel/enums/stat-block-icon';
import { ajax } from '@/forgesteel/data/monsters/ajax';
import { angulotl } from '@/forgesteel/data/monsters/angulotl';
import { animal } from '@/forgesteel/data/monsters/animal';
import { arixx } from '@/forgesteel/data/monsters/arixx';
import { ashenHoarder } from '@/forgesteel/data/monsters/ashen-hoarder';
import { basilisk } from '@/forgesteel/data/monsters/basilisk';
import { bredbeddle } from '@/forgesteel/data/monsters/bredbeddle';
import { bugbear } from '@/forgesteel/data/monsters/bugbear';
import { chimera } from '@/forgesteel/data/monsters/chimera';
import { civilian } from '@/forgesteel/data/monsters/civilian';
import { countRhodar } from '@/forgesteel/data/monsters/count-rhodar';
import { demon } from '@/forgesteel/data/monsters/demon';
import { devil } from '@/forgesteel/data/monsters/devil';
import { draconian } from '@/forgesteel/data/monsters/draconian';
import { dragonCrucible } from '@/forgesteel/data/monsters/dragon-crucible';
import { dragonGloom } from '@/forgesteel/data/monsters/dragon-gloom';
import { dragonMeteor } from '@/forgesteel/data/monsters/dragon-meteor';
import { dragonOmen } from '@/forgesteel/data/monsters/dragon-omen';
import { dragonThorn } from '@/forgesteel/data/monsters/dragon-thorn';
import { dwarf } from '@/forgesteel/data/monsters/dwarf';
import { elemental } from '@/forgesteel/data/monsters/elemental';
import { elfHigh } from '@/forgesteel/data/monsters/elf-high';
import { elfShadow } from '@/forgesteel/data/monsters/elf-shadow';
import { elfWode } from '@/forgesteel/data/monsters/elf-wode';
import { fossilCryptic } from '@/forgesteel/data/monsters/fossil-cryptic';
import { giant } from '@/forgesteel/data/monsters/giant';
import { gnoll } from '@/forgesteel/data/monsters/gnoll';
import { goblin } from '@/forgesteel/data/monsters/goblin';
import { griffon } from '@/forgesteel/data/monsters/griffon';
import { hag } from '@/forgesteel/data/monsters/hag';
import { hobgoblin } from '@/forgesteel/data/monsters/hobgoblin';
import { human } from '@/forgesteel/data/monsters/human';
import { kingfissureWorm } from '@/forgesteel/data/monsters/kingfissure-worm';
import { kobold } from '@/forgesteel/data/monsters/kobold';
import { lich } from '@/forgesteel/data/monsters/lich';
import { lightbender } from '@/forgesteel/data/monsters/lightbender';
import { lizardfolk } from '@/forgesteel/data/monsters/lizardfolk';
import { lordSyuul } from '@/forgesteel/data/monsters/lord-syuul';
import { manticore } from '@/forgesteel/data/monsters/manticore';
import { medusa } from '@/forgesteel/data/monsters/medusa';
import { minotaur } from '@/forgesteel/data/monsters/minotaur';
import { ogre } from '@/forgesteel/data/monsters/ogre';
import { olothec } from '@/forgesteel/data/monsters/olothec';
import { orc } from '@/forgesteel/data/monsters/orc';
import { radenwight } from '@/forgesteel/data/monsters/radenwight';
import { retainer } from '@/forgesteel/data/monsters/retainer';
import { rival } from '@/forgesteel/data/monsters/rival';
import { shamblingMound } from '@/forgesteel/data/monsters/shambling-mound';
import { timeRaider } from '@/forgesteel/data/monsters/time-raider';
import { troll } from '@/forgesteel/data/monsters/troll';
import { undead } from '@/forgesteel/data/monsters/undead';
import { valok } from '@/forgesteel/data/monsters/valok';
import { voicelessTalker } from '@/forgesteel/data/monsters/voiceless-talker';
import { warDog } from '@/forgesteel/data/monsters/wardog';
import { werewolf } from '@/forgesteel/data/monsters/werewolf';
import { wyvern } from '@/forgesteel/data/monsters/wyvern';
import { xorannox } from '@/forgesteel/data/monsters/xorannox';

export class MonsterData {
	static ajax = ajax;
	static angulotl = angulotl;
	static animal = animal;
	static arixx = arixx;
	static ashenHoarder = ashenHoarder;
	static basilisk = basilisk;
	static bredbeddle = bredbeddle;
	static bugbear = bugbear;
	static chimera = chimera;
	static civilian = civilian;
	static countRhodar = countRhodar;
	static demon = demon;
	static devil = devil;
	static draconian = draconian;
	static dragonCrucible = dragonCrucible;
	static dragonGloom = dragonGloom;
	static dragonMeteor = dragonMeteor;
	static dragonOmen = dragonOmen;
	static dragonThorn = dragonThorn;
	static dwarf = dwarf;
	static elemental = elemental;
	static elfHigh = elfHigh;
	static elfShadow = elfShadow;
	static elfWode = elfWode;
	static fossilCryptic = fossilCryptic;
	static giant = giant;
	static gnoll = gnoll;
	static goblin = goblin;
	static griffon = griffon;
	static hag = hag;
	static hobgoblin = hobgoblin;
	static human = human;
	static kingfissureWorm = kingfissureWorm;
	static kobold = kobold;
	static lich = lich;
	static lightbender = lightbender;
	static lizardfolk = lizardfolk;
	static lordSyuul = lordSyuul;
	static manticore = manticore;
	static medusa = medusa;
	static minotaur = minotaur;
	static ogre = ogre;
	static olothec = olothec;
	static orc = orc;
	static radenwight = radenwight;
	static retainer = retainer;
	static rival = rival;
	static shamblingMound = shamblingMound;
	static timeRaider = timeRaider;
	static troll = troll;
	static undead = undead;
	static valok = valok;
	static voicelessTalker = voicelessTalker;
	static warDog = warDog;
	static werewolf = werewolf;
	static wyvern = wyvern;
	static xorannox = xorannox;

	static malice = [
		FactoryLogic.feature.createMalice({
			id: 'malice-1',
			name: 'Brutal Effectiveness',
			cost: 3,
			sections: [
				'The monster digs into the enemy’s weak spot. The next ability the monster uses with a potency has its potency increased by 1.'
			],
			icon: StatBlockIcon.Self
		}),
		FactoryLogic.feature.createMalice({
			id: 'malice-2',
			name: 'Malicious Strike',
			cost: 5,
			repeatable: true,
			sections: [
				'The monster pours all their animosity into their attack. Their next strike deals additional damage to one target equal to their highest characteristic. The damage increases by 1 for every additional malice spent on this feature (to a maximum total of three times their highest characteristic). This feature can’t be used two rounds in a row.'
			],
			icon: StatBlockIcon.Self
		})
	];
}
