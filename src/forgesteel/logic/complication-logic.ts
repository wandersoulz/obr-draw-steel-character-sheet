import { SourcebookLogic } from "./sourcebook-logic";

export class ComplicationLogic {
    static getComplicationFromId(complicationId: string) {
        const sourceBooks = SourcebookLogic.getSourcebooks();
        const complications = SourcebookLogic.getComplications(sourceBooks);

        const filteredData = complications.filter(c => c.id == complicationId);
        if (filteredData.length != 1) {
            return null;
        }
        return filteredData[0];
    }
}
