import type { Cell, CellObject, ValueType } from "write-excel-file/browser";

export class CellStructureUnifier {
  public unify(cell: Cell): CellObject | null {
    if (!cell) return null;
    if (this.isValueTypeCell(cell)) return { value: cell };
    return cell;
  }
  private isValueTypeCell(cell: Cell): cell is ValueType {
    return (
      cell instanceof Date ||
      ["number", "string", "boolean"].includes(typeof cell)
    );
  }
}
