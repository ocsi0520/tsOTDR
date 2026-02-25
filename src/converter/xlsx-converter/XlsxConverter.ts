import type { Representation } from "../../otdr/representation/Representation";
import writeXlsxFile, { type SheetData as RawSheetData } from "write-excel-file";
import type { HeaderCellDataFactory as HeaderCellDataFactory } from "./HeaderCellDataFactory";
import type { Columns, SheetData } from "./excel-types";
import type { ApprovalDataFactory } from "./ApprovalDataFactory";
import type { CommentDataFactory } from "./CommentDataFactory";
import type { EventDataFactory } from "./EventDataFactory";
import type { CellStructureUnifier } from "./utils/CellStructureUnifier";

// options: - https://sheetjs.com/ (no styling)
//          - https://www.npmjs.com/package/write-excel-file (fixed minimatch - https://gitlab.com/catamphetamine/write-excel-file/-/issues/106)
//          - https://www.npmjs.com/package/exceljs (minimatch - https://github.com/exceljs/exceljs/issues/3024)

export class XlsxConverter {
  private headerCellDataFactory: HeaderCellDataFactory;
  private approvalDataFactory: ApprovalDataFactory;
  private commentDataFactory: CommentDataFactory;
  private eventDataFactory: EventDataFactory;
  private cellStructureUnifier: CellStructureUnifier;

  constructor(
    headerCellDataFactory: HeaderCellDataFactory,
    approvalDataFactory: ApprovalDataFactory,
    commentDataFactory: CommentDataFactory,
    eventDataFactory: EventDataFactory,
    cellStructureUnifier: CellStructureUnifier,
  ) {
    this.headerCellDataFactory = headerCellDataFactory;
    this.approvalDataFactory = approvalDataFactory;
    this.commentDataFactory = commentDataFactory;
    this.eventDataFactory = eventDataFactory;
    this.cellStructureUnifier = cellStructureUnifier;
  }

  public async convertRepresentation(
    representation: Representation,
  ): Promise<File> {
    const allParts = this.gatherAllParts(representation);
    const compatibleSheetData = this.mapSheetDataToRaw(allParts);
    const xlsxBlob = await writeXlsxFile(compatibleSheetData, {
      dateFormat: "yyyy.mm.dd",
      fontSize: 10,
      columns: this.getColumnWidths(),
    });
    return new File([xlsxBlob], this.getFileName(representation), {
      // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      type: xlsxBlob.type,
    });
  }

  private gatherAllParts(representation: Representation): SheetData {
    return [
      ...this.headerCellDataFactory.getRows(representation),
      ...this.approvalDataFactory.getRows(),
      ...this.commentDataFactory.getRows(),
      ...this.eventDataFactory.getRows(representation),
    ];
  }

  private mapSheetDataToRaw(sheetData: SheetData): RawSheetData {
    return sheetData.map((row) =>
      row.map((cell) => this.cellStructureUnifier.unify(cell)),
    );
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

  private getColumnWidths(): Columns {
    // these fractions are from libre-office calc
    return [
      1.05, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 1.5 /*H*/, 0.3, 0.3, 0.3, 0.3, 0.3,
      1.05 /*N*/, 0.3, 0.3, 0.7, 0.7 /* Date Q,R */, 0.3,
    ].map((width) => ({ width: width * 15 }));
  }
}
