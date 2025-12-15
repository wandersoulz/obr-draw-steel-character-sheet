import { Adventure } from '@/forgesteel/models/adventure';
import { Encounter } from '@/forgesteel/models/encounter';
import { Montage } from '@/forgesteel/models/montage';
import { Negotiation } from '@/forgesteel/models/negotiation';
import { TacticalMap } from '@/forgesteel/models/tactical-map';

export interface Playbook {
	adventures: Adventure[];
	encounters: Encounter[];
	montages: Montage[];
	negotiations: Negotiation[];
	tacticalMaps: TacticalMap[];
}
