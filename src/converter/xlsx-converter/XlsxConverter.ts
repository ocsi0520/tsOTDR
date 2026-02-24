import type { Representation } from "../../otdr/representation/Representation";
import writeXlsxFile from "write-excel-file/browser";
import type { HeaderCellDataFactory as HeaderCellDataFactory } from "./HeaderCellDataFactory";
import type { Columns, SheetData } from "./excel-types";

// options: - https://sheetjs.com/ (no styling)
//          - https://www.npmjs.com/package/write-excel-file (fixed minimatch - https://gitlab.com/catamphetamine/write-excel-file/-/issues/106)
//          - https://www.npmjs.com/package/exceljs (minimatch - https://github.com/exceljs/exceljs/issues/3024)


export class XlsxConverter {
  private headerCellDataFactory: HeaderCellDataFactory;
  constructor(headerCellDataFactory: HeaderCellDataFactory) {
    this.headerCellDataFactory = headerCellDataFactory;
  }

  public async convertRepresentation(
    representation: Representation,
  ): Promise<File> {
    const xlsxBlob = await writeXlsxFile(this.gatherAllParts(representation), {
      dateFormat: "yyyy.mm.dd",
      fontSize: 10,
      columns: this.getColumnWeights([[17, 17]]),
    });
    return new File([xlsxBlob], this.getFileName(representation), {
      // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      type: xlsxBlob.type,
    });
  }

  private gatherAllParts(representation: Representation): SheetData {
    return [...this.headerCellDataFactory.getRows(representation)];
  }

  private getFileName(representation: Representation): `${string}.xlsx` {
    const waveLengthInNm = representation.genParamsBlock.waveLengthInNm;
    const operatorName = this.getNormalizedName(
      representation.genParamsBlock.operator,
    );

    return `${operatorName}-${waveLengthInNm}nm.xlsx`;
  }

  private getNormalizedName(operatorName: string): string {
    return operatorName.replaceAll(" ", "_");
  }

  /**
   *
   * @param columnDescriptors tuple of `column number` (1-based) and its `width` in characters
   */
  private getColumnWeights(
    columnDescriptors: Array<[columnNumber: number, width: number]>,
  ): Columns {
    const maxColumn = Math.max(...columnDescriptors.map((descr) => descr[1]));
    const columns: Columns = [];
    for (let i = 1; i <= maxColumn; i++) {
      const width = columnDescriptors.find((descr) => descr[0] === i)?.[1];
      columns.push(width !== undefined ? { width } : {});
    }

    return columns;
  }
}
