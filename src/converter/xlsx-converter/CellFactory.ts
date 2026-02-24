import type { Cell, CellObject } from "write-excel-file/browser";

export type CellWithSpan = NonNullable<CellObject> & { span: number };

export class CellFactory {
  public getEmptyCell(): Cell {
    return null;
  }

  public getEmptyCells(count: number): Cell[] {
    return Array.from({ length: count }).map(this.getEmptyCell.bind(this));
  }

  public createSpanCell(spannedCell: CellWithSpan): Cell[] {
    return [spannedCell, ...this.getEmptyCells(spannedCell.span - 1)];
  }
}
