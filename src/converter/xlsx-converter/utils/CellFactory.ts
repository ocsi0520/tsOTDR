import type { CellWithSpan, RawCell } from "../excel-types";

export class CellFactory {
  public getEmptyCell(): RawCell {
    return null;
  }

  public getEmptyCells(count: number): RawCell[] {
    return Array.from({ length: count }).map(this.getEmptyCell.bind(this));
  }

  public createSpanCell(spannedCell: CellWithSpan): RawCell[] {
    return [spannedCell, ...this.getEmptyCells(spannedCell.span - 1)];
  }
}
