import { Identifiable } from "../data/identifiable";

export interface SkillGroup extends Identifiable {
  name: string;
  skillIds: string[];
}
