import type { FrameCreator } from "./utils/FrameCreator";
import type { CellFactory } from "./utils/CellFactory";
import type { Row, SheetData } from "./excel-types";

export class CommentDataFactory {
  private cellFactory: CellFactory;
  private frameCreator: FrameCreator;
  constructor(cellFactory: CellFactory, frameCreator: FrameCreator) {
    this.cellFactory = cellFactory;
    this.frameCreator = frameCreator;
  }

  public getRows(): SheetData {
    return this.frameCreator.createFrameFor([
      this.getCommentRow(),
      this.cellFactory.getEmptyCells(19),
      this.cellFactory.getEmptyCells(19),
      this.cellFactory.getEmptyCells(19),
    ]);
  }
  private getCommentRow(): Row {
    return this.cellFactory.createSpanCell({
      value: "Megjegyzés:",
      rowSpan: 4,
      span: 19,
      alignVertical: "top",
      // TODO: this should be set inside frameCreator, but currently the last row is full of `null`s
      // it should check for each cell whether its in the last row of the frame
      bottomBorderStyle: "thick",
    });
  }
}
