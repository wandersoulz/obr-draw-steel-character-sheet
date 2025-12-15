import { community, communityPrerelease } from '@/forgesteel/data/sourcebooks/community';
import { blacksmith } from '@/forgesteel/data/sourcebooks/magazine-blacksmith';
import { core } from '@/forgesteel/data/sourcebooks/core';
import { orden } from '@/forgesteel/data/sourcebooks/orden';
import { playtest } from '@/forgesteel/data/sourcebooks/playtest';
import { ratcatcher } from '@/forgesteel/data/sourcebooks/magazine-ratcatcher';
import { triglav } from '@/forgesteel/data/sourcebooks/triglav';

export class SourcebookData {
	// Official
	static core = core;
	static orden = orden;
	static playtest = playtest;

	// Third Party
	static magazineBlacksmith = blacksmith;
	static magazineRatcatcher = ratcatcher;
	static triglav = triglav;

	// Community
	static communityPrerelease = communityPrerelease;
	static community = community;
}
