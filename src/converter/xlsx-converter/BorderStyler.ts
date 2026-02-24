import type { CellStructureUnifier } from "./CellStructureUnifier";
import type { CellObject, RawCell, Row, SheetData } from "./excel-types";

type CellBorderDirectionProps = Extract<
  keyof NonNullable<CellObject>,
  `${string}BorderStyle`
>;

export class BorderStyler {
  private unifier: CellStructureUnifier;
  constructor(unifier: CellStructureUnifier) {
    this.unifier = unifier;
  }
  public thickenBorder(row: Row, whichBorder: CellBorderDirectionProps): Row {
    return row.map((cell) => cell && { ...cell, [whichBorder]: "thick" });
  }
  public thickenLastCellBorder(row: Row): Row {
    const lastIndexOfNonNullCell = row.findLastIndex(Boolean);
    return row.map((cell, index) =>
      cell && index === lastIndexOfNonNullCell
        ? { ...this.unifier.unify(cell), rightBorderStyle: "thick" }
        : cell,
    );
  }

  public createThinGrid(sheetData: SheetData): SheetData {
    return sheetData.map(this.createThinBordersForCellsIn.bind(this));
  }

  private createThinBordersForCellsIn(row: Row): Row {
    return row.map(this.createThinBordersForCell.bind(this));
  }
  private createThinBordersForCell(cell: RawCell): RawCell {
    const unified = this.unifier.unify(cell);
    if (!unified) return cell;
    return {
      ...unified,
      borderStyle: "thin",
    };
  }

  // TODO: extract this or rename class
  private colorize(sheetData: RawCell[][]): RawCell[][] {
    return sheetData.map((row) =>
      row.map(
        (cell) =>
          cell && { ...this.unifier.unify(cell), backgroundColor: "#F2F2F2" },
      ),
    );
  }

  public frameFor(sheetData: SheetData): SheetData {
    const sheetDataWithGrid = this.createThinGrid(sheetData);
    const firstRow = this.thickenLastCellBorder(
      this.thickenBorder(sheetDataWithGrid[0], "topBorderStyle"),
    );
    const lastRow = this.thickenLastCellBorder(
      this.thickenBorder(sheetDataWithGrid.at(-1)!, "bottomBorderStyle"),
    );
    const middle = sheetDataWithGrid
      .slice(1, -1)
      .map(this.thickenLastCellBorder.bind(this));
    return this.colorize([firstRow, ...middle, lastRow]);
  }
}
