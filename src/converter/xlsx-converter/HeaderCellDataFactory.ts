import type { Cell, Row, SheetData } from "write-excel-file";
import type { Representation } from "../../otdr/representation/Representation";

type CellWithSpan = NonNullable<Cell> & { span: number };
type CellBorderDirectionProps = Extract<
  keyof NonNullable<Cell>,
  `${string}BorderStyle`
>;

export class HeaderCellDataFactory {
  // TODO: finish
  public getRows(representation: Representation): SheetData {
    const allRows = [
      this.getFirstRow(representation),
      this.getSecondRow(representation),
      this.getThirdRow(representation),
    ];

    return this.frameWithThickStyle(allRows);
  }

  private thickenBorder(row: Row, whichBorder: CellBorderDirectionProps): Row {
    return row.map((cell) => cell && { ...cell, [whichBorder]: "thick" });
  }
  private thickenLastCellBorder(row: Row): Row {
    const lastIndexOfNonNullCell = row.findLastIndex(Boolean);
    return row.map((cell, index) =>
      cell && index === lastIndexOfNonNullCell
        ? { ...cell, rightBorderStyle: "thick" }
        : cell,
    );
  }

  private frameWithThickStyle(sheetData: SheetData): SheetData {
    return [
      this.thickenBorder(sheetData[0], "bottomBorderStyle"),
      ...sheetData.slice(1, -1).map(this.thickenLastCellBorder.bind(this)),
      this.thickenLastCellBorder(
        this.thickenBorder(sheetData.at(-1)!, "bottomBorderStyle"),
      ),
    ];
  }

  private getFirstRow(representation: Representation): Row {
    return [
      ...this.createSpanCell({
        span: 8,
        value: "KÖTÉSCSILLAPITÁS ÉRTÉKEK SZÁLANKÉNT",
        fontWeight: "bold",
      }),
      ...this.getEmptyCells(5), // really empty cells
      { value: "Mérés dátuma" },
      ...this.getEmptyCells(2),
      this.getDateOfMeasurementCell(representation),
      this.getEmptyCell(),
    ];
  }
  private getSecondRow(representation: Representation): Row {
    return [
      ...this.createSpanCell({
        value: "Kábel telepítés helye:",
        span: 6,
        borderStyle: "thin",
        topBorderStyle: "thick",
      }),
      ...this.createSpanCell(this.getLocationCell(representation)),
    ];
  }

  // Mérési hullámhossz:						1310 nm		1550 nm		Mérést végezte: Horváth Ádám, Oláh Attila
  private getThirdRow({ genParamsBlock }: Representation): Row {
    return [
      ...this.createSpanCell({
        value: "Mérési hullámhossz:",
        span: 6,
        borderStyle: "thin",
      }),
      ...this.createSpanCell({
        borderStyle: "thin",
        span: 4,
        value: genParamsBlock.waveLengthInNm + " nm",
      }),
      ...this.createSpanCell({
        borderStyle: "thin",
        span: 9,
        value: "Mérést végezte:" + genParamsBlock.operator,
      }),
    ];
  }

  // TODO: extract SpanCellFactory
  private getEmptyCell(): Cell {
    return null;
  }

  private getEmptyCells(count: number): Cell[] {
    return Array.from({ length: count }).map(this.getEmptyCell.bind(this));
  }

  private createSpanCell(spannedCell: CellWithSpan): Cell[] {
    return [spannedCell, ...this.getEmptyCells(spannedCell.span - 1)];
  }

  private getDateOfMeasurementCell(representation: Representation): Cell {
    return {
      type: Date,
      value: representation.fxdParamsBlock.date.normalized,
    };
  }
  private getLocationCell(representation: Representation): CellWithSpan {
    const { A: locationA, B: locationB } =
      representation.genParamsBlock.location;
    const combinedLocation = [locationA, locationB]
      .map((location) => location.trim())
      .filter(Boolean)
      .join("-");
    return {
      value: combinedLocation,
      type: String,
      fontWeight: "bold",
      topBorderStyle: "thick",
      borderStyle: "thin",
      span: 13,
    };
  }
}
