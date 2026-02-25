import type { CellV3, Row, SheetData } from "../excel-types";
import type { CellStructureUnifier } from "./CellStructureUnifier";

export class NumberPrecisionSetter {
  private unifier: CellStructureUnifier;
  constructor(unifier: CellStructureUnifier) {
    this.unifier = unifier;
  }

  public setPrecisionInSheet(sheetData: SheetData): SheetData {
    return sheetData.map(this.setPrecisionInRow.bind(this));
  }

  public setPrecisionInRow(row: Row): Row {
    return row.map(this.setPrecisionInCell.bind(this));
  }

  public setPrecisionInCell(cell: CellV3): CellV3 {
    const cellObject = this.unifier.unify(cell);

    const cellValue = cellObject?.value;
    if (!cellObject || typeof cellValue !== "number") return cell;

    return {
      ...cellObject,
      value: cellValue % 1 === 0 ? cellValue : cellValue.toFixed(3),
    };
  }
}
