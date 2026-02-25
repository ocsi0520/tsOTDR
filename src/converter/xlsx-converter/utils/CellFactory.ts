import type { CellWithSpan, CellV3 } from "../excel-types";

export class CellFactory {
  public getEmptyCell(): CellV3 {
    return null;
  }

  public getEmptyCells(count: number): CellV3[] {
    return Array.from({ length: count }).map(this.getEmptyCell.bind(this));
  }

  public createSpanCell(spannedCell: CellWithSpan): CellV3[] {
    return [spannedCell, ...this.getEmptyCells(spannedCell.span - 1)];
  }
}
