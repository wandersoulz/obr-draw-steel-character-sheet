import { SourcebookLogic } from "./sourcebook-logic";

export class CultureLogic {
    static getCultureFromId(cultureId: string) {
        const sourceBooks = SourcebookLogic.getSourcebooks();
        const cultures = SourcebookLogic.getCultures(sourceBooks, true);

        const filteredData = cultures.filter(culture => culture.id == cultureId);
        if (filteredData.length != 1) {
            return null;
        }
        return filteredData[0];
    }
}
