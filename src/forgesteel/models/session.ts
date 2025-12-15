import { Counter } from '@/forgesteel/models/counter';
import { Encounter } from '@/forgesteel/models/encounter';
import { Montage } from '@/forgesteel/models/montage';
import { Negotiation } from '@/forgesteel/models/negotiation';
import { TacticalMap } from '@/forgesteel/models/tactical-map';

export interface Session {
	counters: Counter[];
	encounters: Encounter[];
	montages: Montage[];
	negotiations: Negotiation[];
	tacticalMaps: TacticalMap[];
	playerViewID: string | null;
}
