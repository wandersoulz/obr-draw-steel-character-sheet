import type { Feature } from '@/forgesteel/models/feature';
import type { PerkList } from '@/forgesteel/enums/perk-list';

export type Perk<TFeature extends Feature = Feature> = TFeature & { list: PerkList };
