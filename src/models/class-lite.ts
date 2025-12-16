import { Characteristic } from 'forgesteel';

export interface ClassLite {
    classId: string;
    level: number;
    selectedSubclassIds: string[];
    primaryCharacteristics: Characteristic[];
    characteristicAssignments: { characteristic: Characteristic, value: number }[];
    selectedFeatures: Record<string, string[]>;
    selectedAbilities: string[];
}
