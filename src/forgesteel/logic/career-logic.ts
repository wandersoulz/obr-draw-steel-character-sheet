import { SourcebookLogic } from "./sourcebook-logic";

export class CareerLogic {
    static getCareerFromId(careerId: string) {
        const sourceBooks = SourcebookLogic.getSourcebooks();
        const careers = SourcebookLogic.getCareers(sourceBooks);

        const filteredData = careers.filter(career => career.id == careerId);
        if (filteredData.length != 1) {
            return null;
        }
        return filteredData[0];
    }
}
