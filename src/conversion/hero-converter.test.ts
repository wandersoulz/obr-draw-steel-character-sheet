import { describe, it, expect } from 'vitest';
import { HeroData } from '@/forgesteel/data/hero-data';
import { HeroLite } from '@/models/hero-lite';
import { Hero } from '@/forgesteel/models/hero';

describe('Hero Conversion', () => {
    const heroes = Object.values(HeroData) as Hero[];

    heroes.forEach(hero => {
        it(`should convert ${hero.name} to HeroLite and back`, async () => {
            const clonedHero = JSON.parse(JSON.stringify(hero)); // Deep clone to avoid modifying static data

            // Set some choices on the original hero object to test the converters
            if (clonedHero.ancestry && clonedHero.ancestry.features) {
                clonedHero.ancestry.features.forEach((f: any) => {
                    if (f.type === 'Choice' && f.data.options && f.data.options.length > 0) {
                        f.data.selected = [f.data.options[0].feature];
                    }
                });
            }
            if (clonedHero.career && clonedHero.career.incitingIncidents && clonedHero.career.incitingIncidents.options && clonedHero.career.incitingIncidents.options.length > 0) {
                clonedHero.career.incitingIncidents.selected = clonedHero.career.incitingIncidents.options[0];
            }
            if (clonedHero.class) {
                if (clonedHero.class.primaryCharacteristicsOptions && clonedHero.class.primaryCharacteristicsOptions.length > 0) {
                    clonedHero.class.primaryCharacteristics = clonedHero.class.primaryCharacteristicsOptions[0];
                }
                if (clonedHero.class.subclasses && clonedHero.class.subclasses.length > 0) {
                    clonedHero.class.subclasses[0].selected = true;
                }
            }
            // Set default choices for culture's environment, organization, and upbringing
            if (clonedHero.culture) {
                if (clonedHero.culture.environment && clonedHero.culture.environment.data.listOptions.length > 0) {
                    clonedHero.culture.environment.data.selected = [clonedHero.culture.environment.data.listOptions[0]];
                }
                if (clonedHero.culture.organization && clonedHero.culture.organization.data.listOptions.length > 0) {
                    clonedHero.culture.organization.data.selected = [clonedHero.culture.organization.data.listOptions[0]];
                }
                if (clonedHero.culture.upbringing && clonedHero.culture.upbringing.data.listOptions.length > 0) {
                    clonedHero.culture.upbringing.data.selected = [clonedHero.culture.upbringing.data.listOptions[0]];
                }
            }


            const heroLite = HeroLite.fromHero(clonedHero);
            const reconstructedHero = await heroLite.toHero();

            const reconstructedHeroLite = HeroLite.fromHero(reconstructedHero);
            
            expect(reconstructedHeroLite).toEqual(heroLite);
        });
    });
});
