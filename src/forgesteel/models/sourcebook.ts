import { Adventure } from '@/forgesteel/models/adventure';
import { Ancestry } from '@/forgesteel/models/ancestry';
import { Career } from '@/forgesteel/models/career';
import { Complication } from '@/forgesteel/models/complication';
import { Culture } from '@/forgesteel/models/culture';
import { Domain } from '@/forgesteel/models/domain';
import { Element } from '@/forgesteel/models/element';
import { Encounter } from '@/forgesteel/models/encounter';
import { HeroClass } from '@/forgesteel/models/class';
import { Imbuement } from '@/forgesteel/models/imbuement';
import { Item } from '@/forgesteel/models/item';
import { Kit } from '@/forgesteel/models/kit';
import { Language } from '@/forgesteel/models/language';
import { MonsterGroup } from '@/forgesteel/models/monster-group';
import { Montage } from '@/forgesteel/models/montage';
import { Negotiation } from '@/forgesteel/models/negotiation';
import { Perk } from '@/forgesteel/models/perk';
import { Project } from '@/forgesteel/models/project';
import { Skill } from '@/forgesteel/models/skill';
import { SourcebookType } from '@/forgesteel/enums/sourcebook-type';
import { SubClass } from '@/forgesteel/models/subclass';
import { TacticalMap } from '@/forgesteel/models/tactical-map';
import { Terrain } from '@/forgesteel/models/terrain';
import { Title } from '@/forgesteel/models/title';

export interface Sourcebook extends Element {
	type: SourcebookType;

	adventures: Adventure[];
	ancestries: Ancestry[];
	careers: Career[];
	classes: HeroClass[];
	complications: Complication[];
	cultures: Culture[];
	domains: Domain[];
	encounters: Encounter[];
	imbuements: Imbuement[];
	items: Item[];
	kits: Kit[];
	monsterGroups: MonsterGroup[];
	montages: Montage[];
	negotiations: Negotiation[];
	perks: Perk[];
	projects: Project[];
	subclasses: SubClass[];
	tacticalMaps: TacticalMap[];
	terrain: Terrain[];
	titles: Title[];

	skills: Skill[];
	languages: Language[];
}

export type SourcebookElementKind = 'adventure' | 'ancestry' | 'career' | 'class' | 'complication' | 'culture' | 'domain' | 'encounter' | 'imbuement' | 'item' | 'kit' | 'monster-group' | 'montage' | 'negotiation' | 'perk' | 'project' | 'subclass' | 'tactical-map' | 'terrain' | 'title';
