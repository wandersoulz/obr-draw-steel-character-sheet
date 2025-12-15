import { AttitudeType } from '@/forgesteel/enums/attitude-type';
import { Element } from '@/forgesteel/models/element';
import { NegotiationTrait } from '@/forgesteel/enums/negotiation-trait';

export interface Negotiation extends Element {
	attitude: AttitudeType;
	impression: number;
	interest: number;
	patience: number;
	motivations: { trait: NegotiationTrait, description: string }[];
	pitfalls: { trait: NegotiationTrait, description: string }[];
	languages: string[];
	outcomes: string[];
}
