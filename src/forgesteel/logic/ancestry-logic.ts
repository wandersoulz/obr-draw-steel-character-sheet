import { SourcebookLogic } from "./sourcebook-logic";

export class AncestryLogic {
    static getAncestryFromId(ancestryId: string) {
        const sourceBooks = SourcebookLogic.getSourcebooks();
        const ancestries = SourcebookLogic.getAncestries(sourceBooks);

        const filteredData = ancestries.filter(ancestry => ancestry.id == ancestryId);
        if (filteredData.length != 1) {
            return null;
        }
        return filteredData[0];
    }
}