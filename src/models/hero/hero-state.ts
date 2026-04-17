import { AncestryState } from "../ancestry/ancestry-state";
import { CareerState } from "../career/career-state";
import { ClassState } from "../class/class-state";
import { CultureState } from "../culture/culture-state";

export interface HeroState {
  id: string;
  name: string;
  ancestry?: AncestryState;
  culture?: CultureState;
  career?: CareerState;
  class?: ClassState;
}
