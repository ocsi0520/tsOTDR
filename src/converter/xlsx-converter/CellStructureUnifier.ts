import type { CellObject, CellV3, ValueType } from "./excel-types";

export class CellStructureUnifier {
  public unify(cell: CellV3): CellObject | null {
    if (!cell) return null;
    if (this.isValueTypeCell(cell)) return { value: cell };
    return cell;
  }
  private isValueTypeCell(cell: CellV3): cell is ValueType {
    return (
      cell instanceof Date ||
      ["number", "string", "boolean"].includes(typeof cell)
    );
  }
}
