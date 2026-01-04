import { AbilityCustomizationInterface, FeatureType, Hero, HeroInterface, HeroStateInterface } from 'forgesteel';
import { AncestryLite } from './ancestry-lite';
import { AncestryConverter } from '@/conversion/ancestry-converter';
import { CultureConverter } from '@/conversion/culture-converter';
import { CultureLite } from './culture-lite';
import { CareerLite } from './career-lite';
import { CareerConverter } from '@/conversion/career-converter';
import { ClassLite } from './class-lite';
import { ClassConverter } from '@/conversion/class-converter';
import { ComplicationLite } from './complication-lite';
import { ComplicationConverter } from '@/conversion/complication-converter';
import { FeatureInterface } from 'forgesteel';

export class HeroLite {
    id: string;
    name: string;
    tokenId: string;
    heroicResourceValue: number;

    ancestry: AncestryLite;
    culture: CultureLite;
    career: CareerLite;
    class: ClassLite;
    complication: ComplicationLite | null;

    features: FeatureInterface[];
    abilityCustomizations: AbilityCustomizationInterface[];
    state: HeroStateInterface;

    maxStamina: number;

    constructor(
        id: string,
        name: string,
        tokenId: string,
        maxStamina: number,
        ancestry: AncestryLite,
        culture: CultureLite,
        career: CareerLite,
        _class: ClassLite,
        complication: ComplicationLite | null,
        features: FeatureInterface[],
        abilityCustomizations: AbilityCustomizationInterface[],
        state: HeroStateInterface,
        heroicResourceValue: number,
    ) {
        this.id = id;
        this.name = name;
        this.tokenId = tokenId;
        this.maxStamina = maxStamina;
        this.ancestry = ancestry;
        this.culture = culture;
        this.career = career;
        this.class = _class;
        this.complication = complication;
        this.features = features;
        this.abilityCustomizations = abilityCustomizations;
        this.state = state;
        this.heroicResourceValue = heroicResourceValue;
    }

    copyOf(): HeroLite {
        return new HeroLite(
            this.id,
            this.name,
            this.tokenId,
            this.maxStamina,
            this.ancestry,
            this.culture,
            this.career,
            this.class,
            this.complication,
            this.features,
            this.abilityCustomizations,
            this.state,
            this.heroicResourceValue,
        );
    }

    static fromHeroLiteInterface(interfaceValue: HeroLite) {
        return new HeroLite(
            interfaceValue.id,
            interfaceValue.name,
            interfaceValue.tokenId,
            interfaceValue.maxStamina,
            interfaceValue.ancestry,
            interfaceValue.culture,
            interfaceValue.career,
            interfaceValue.class,
            interfaceValue.complication,
            interfaceValue.features,
            interfaceValue.abilityCustomizations,
            interfaceValue.state,
            interfaceValue.heroicResourceValue,
        );
    }

    update(partialUpdate: Partial<HeroLite>) {
        this.id = partialUpdate.id ?? this.id;
        this.name = partialUpdate.name ?? this.name;
        this.tokenId = partialUpdate.tokenId ?? this.tokenId;
        this.maxStamina = partialUpdate.maxStamina ?? this.maxStamina;
        this.ancestry = partialUpdate.ancestry ?? this.ancestry;
        this.culture = partialUpdate.culture ?? this.culture;
        this.state = partialUpdate.state ?? this.state;
        this.abilityCustomizations = partialUpdate.abilityCustomizations ?? this.abilityCustomizations;
        this.features = partialUpdate.features ?? this.features;
        this.class = partialUpdate.class ?? this.class;
        this.career = partialUpdate.career ?? this.career;
        this.complication = partialUpdate.complication ?? this.complication;
    }

    static fromHero(hero: Hero) {
        return new HeroLite(
            hero.id,
            hero.name,
            hero.folder,
            hero.getStamina(),
            AncestryConverter.fromAncestry(hero.ancestry!),
            CultureConverter.fromCulture(hero.culture!),
            CareerConverter.fromCareer(hero.career!),
            ClassConverter.fromClass(hero.class!),
            hero.complication ? ComplicationConverter.fromComplication(hero.complication) : null,
            hero.features,
            hero.abilityCustomizations,
            hero.state,
            hero.getFeatures().map(f => f.feature).filter(f => f.type === FeatureType.HeroicResource).find(f => f.data.type === 'heroic')?.data.value || 0
        );
    }

    toHero(): Hero {
        const heroConfig: HeroInterface = {
            id: this.id,
            name: this.name,
            ancestry: this.getAncestry(),
            career: CareerConverter.toCareer(this.career),
            culture: CultureConverter.toCulture(this.culture),
            class: ClassConverter.toClass(this.class),
            complication: this.complication ? ComplicationConverter.toComplication(this.complication) : null,
            features: this.features,
            state: this.state,
            picture: null,
            folder: this.tokenId,
            settingIDs: [],
            abilityCustomizations: []
        };
        const hero = new Hero(heroConfig);
        hero.getFeatures().map(f => f.feature).filter(f => f.type === FeatureType.HeroicResource).forEach(f => {
            f.data.value = this.heroicResourceValue || 0;
        });
        
        return hero;
    }

    public getAncestry() {
        return AncestryConverter.toAncestry(this.ancestry);
    }

    public getClass() {
        return ClassConverter.toClass(this.class);
    }

    public getCulture() {
        return CultureConverter.toCulture(this.culture);
    }

    public getFeatures() {
        return this.features;
    }
}