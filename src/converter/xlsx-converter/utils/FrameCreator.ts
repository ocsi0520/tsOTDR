import type { CellStructureUnifier } from "./CellStructureUnifier";
import type { CellObject, RawCell, Row, SheetData } from "../excel-types";

type CellBorderDirectionProps = Extract<
  keyof NonNullable<CellObject>,
  `${string}BorderStyle`
>;

export class FrameCreator {
  private unifier: CellStructureUnifier;
  constructor(unifier: CellStructureUnifier) {
    this.unifier = unifier;
  }
  public thickenBorder(row: Row, whichBorder: CellBorderDirectionProps): Row {
    return row.map((cell) => cell && { ...cell, [whichBorder]: "thick" });
  }

  public thickenLastCellBorder(sheetData: SheetData): SheetData {
    return sheetData.map(this.thickenLastCellBorderInRow.bind(this));
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

  private thickenLastCellBorderInRow(row: Row): Row {
    const lastIndexOfNonNullCell = row.findLastIndex(Boolean);
    return row.map((cell, index) =>
      cell && index === lastIndexOfNonNullCell
        ? { ...this.unifier.unify(cell), rightBorderStyle: "thick" }
        : cell,
    );
  }

  private colorize(sheetData: RawCell[][]): RawCell[][] {
    return sheetData.map((row) =>
      row.map(
        (cell) =>
          cell && { ...this.unifier.unify(cell), backgroundColor: "#F2F2F2" },
      ),
    );
  }

  private thickenFirstRow(sheetData: SheetData): SheetData {
    return [
      this.thickenBorder(sheetData[0], "topBorderStyle"),
      ...sheetData.slice(1),
    ];
  }

  private thickenLastRow(sheetData: SheetData): SheetData {
    return [
      ...sheetData.slice(0, -1),
      this.thickenBorder(sheetData.at(-1)!, "bottomBorderStyle"),
    ];
  }

  public createFrameFor(sheetData: SheetData): SheetData {
    const sheetDataWithGrid = this.createThinGrid(sheetData);
    return this.colorize(
      this.thickenLastCellBorder(
        this.thickenLastRow(this.thickenFirstRow(sheetDataWithGrid)),
      ),
    );
  }
}
