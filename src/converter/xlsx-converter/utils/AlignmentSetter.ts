import type { CellObject, CellV3, Row, SheetData } from "../excel-types";
import type { CellStructureUnifier } from "./CellStructureUnifier";

export type Alignment = Pick<CellObject, "align" | "alignVertical">;

export class AlignmentSetter {
  private unifier: CellStructureUnifier;
  constructor(unifier: CellStructureUnifier) {
    this.unifier = unifier;
  }

  public setAlignmentInSheet(
    sheetData: SheetData,
    alignment: Alignment,
  ): SheetData {
    return sheetData.map((row) => this.setAlignmentInRow(row, alignment));
  }

  public setAlignmentInRow(row: Row, alignment: Alignment): Row {
    return row.map((cell) => this.setAlignmentInCell(cell, alignment));
  }

  public setAlignmentInCell(cell: CellV3, alignment: Alignment): CellV3 {
    const cellObject = this.unifier.unify(cell);

    if (!cellObject) return cell;

    return {
      ...cellObject,
      ...alignment,
    };
  }
}
