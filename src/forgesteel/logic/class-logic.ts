import { SourcebookLogic } from "./sourcebook-logic";

export class ClassLogic {
    static getClassFromId(classId: string) {
        const sourceBooks = SourcebookLogic.getSourcebooks();
        const classes = SourcebookLogic.getClasses(sourceBooks);

        const filteredData = classes.filter(c => c.id == classId);
        if (filteredData.length != 1) {
            return null;
        }
        return filteredData[0];
    }
}
