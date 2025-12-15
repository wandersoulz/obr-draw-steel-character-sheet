import { FeatureMalice, FeatureMaliceAbility } from '@/forgesteel/models/feature';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Encounter } from '@/forgesteel/models/encounter';
import { EncounterLogic } from '@/forgesteel/logic/encounter-logic';
import { MonsterData } from '@/forgesteel/data/monster-data';
import { MonsterGroup } from '@/forgesteel/models/monster-group';

describe('getAllMaliceFeatures', () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	test('returns the basic malice features', () => {
		const encounter = {} as Encounter;
		vi.spyOn(EncounterLogic, 'getMonsterGroups').mockReturnValue([]);

		const result = EncounterLogic.getAllMaliceFeatures(encounter, []);

		expect(result.length).toBe(1);
		MonsterData.malice.forEach(malice => {
			expect(result[0].features).toContain(malice);
		});
	});

	test('returns relevant monster group malice features', () => {
		const encounter = {} as Encounter;
		const malice1 = { id: 'fake-1' } as FeatureMalice;
		const malice2 = { id: 'fake-2' } as FeatureMaliceAbility;
		const group1 = { name: 'testGroup', malice: [ malice1, malice2 ] } as MonsterGroup;
		vi.spyOn(EncounterLogic, 'getMonsterGroups').mockReturnValue([
			group1
		]);

		const result = EncounterLogic.getAllMaliceFeatures(encounter, []);
		expect(result.length).toBe(2);
		const resultGroup = result.find(g => g.group === 'testGroup');
		expect(resultGroup?.features).toContain(malice1);
		expect(resultGroup?.features).toContain(malice2);
	});
});
