import { Identifiable } from "../data/identifiable";

export interface Skill extends Identifiable {
  name: string;
  skillGroupId: string;
}
