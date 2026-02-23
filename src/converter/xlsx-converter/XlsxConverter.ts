import type { Representation } from "../../otdr/representation/Representation";
import writeXlsxFile, { type SheetData } from "write-excel-file";
import type { HeaderCellDataFactory as HeaderCellDataFactory } from "./HeaderCellDataFactory";

// options: - https://sheetjs.com/ (no styling)
//          - https://www.npmjs.com/package/write-excel-file (minimatch - https://gitlab.com/catamphetamine/write-excel-file/-/issues/106)
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
}
