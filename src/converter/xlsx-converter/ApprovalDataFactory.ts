import type { FrameCreator } from "./utils/FrameCreator";
import type { CellFactory } from "./utils/CellFactory";
import type { Row, SheetData } from "./excel-types";

export class ApprovalDataFactory {
  private cellFactory: CellFactory;
  private frameCreator: FrameCreator;
  constructor(cellFactory: CellFactory, frameCreator: FrameCreator) {
    this.cellFactory = cellFactory;
    this.frameCreator = frameCreator;
  }

  public getRows(): SheetData {
    const allRows: SheetData = [
      this.cellFactory.getEmptyCells(19),
      this.getApprovalRow(),
      this.cellFactory.getEmptyCells(19),
    ];

    const borderedRows: SheetData = [
      allRows[0],
      ...this.frameCreator.createFrameFor([allRows[1]]),
      allRows[2],
    ];

    return borderedRows;
  }
  public getApprovalRow(): Row {
    return [
      ...this.cellFactory.createSpanCell({
        span: 8,
        value: "Mérés Megfelelősége (Bekarikázni)",
        height: 30,
        alignVertical: "center",
      }),
      ...this.cellFactory.createSpanCell({
        span: 3,
        value: "Megfelelő",
        align: "center",
        alignVertical: "center",
      }),
      ...this.cellFactory.createSpanCell({
        span: 4,
        value: "Nem megfelelő",
        align: "center",
        alignVertical: "center",
      }),
      ...this.cellFactory.createSpanCell({
        span: 4,
        value: "Részben megfelelő",
        align: "center",
        alignVertical: "center",
      }),
    ];
  }
}
