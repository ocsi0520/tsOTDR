import type {
  Cell,
  CellObject,
  Row,
  SheetData,
} from "write-excel-file/browser";
import type { Representation } from "../../otdr/representation/Representation";
import type { CellFactory, CellWithSpan } from "./CellFactory";

type CellBorderDirectionProps = Extract<
  keyof NonNullable<CellObject>,
  `${string}BorderStyle`
>;

export class HeaderCellDataFactory {
  private cellFactory: CellFactory;
  constructor(cellFactory: CellFactory) {
    this.cellFactory = cellFactory;
  }
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
      ...this.cellFactory.createSpanCell({
        span: 8,
        value: "KÖTÉSCSILLAPITÁS ÉRTÉKEK SZÁLANKÉNT",
        fontWeight: "bold",
      }),
      ...this.cellFactory.getEmptyCells(5), // really empty cells
      { value: "Mérés dátuma" },
      ...this.cellFactory.getEmptyCells(2),
      this.getDateOfMeasurementCell(representation),
      this.cellFactory.getEmptyCell(),
    ];
  }
  private getSecondRow(representation: Representation): Row {
    return [
      ...this.cellFactory.createSpanCell({
        value: "Kábel telepítés helye:",
        span: 6,
        borderStyle: "thin",
        topBorderStyle: "thick",
      }),
      ...this.cellFactory.createSpanCell(this.getLocationCell(representation)),
    ];
  }

  // Mérési hullámhossz:						1310 nm		1550 nm		Mérést végezte: Horváth Ádám, Oláh Attila
  private getThirdRow({ genParamsBlock }: Representation): Row {
    return [
      ...this.cellFactory.createSpanCell({
        value: "Mérési hullámhossz:",
        span: 6,
        borderStyle: "thin",
      }),
      ...this.cellFactory.createSpanCell({
        borderStyle: "thin",
        span: 4,
        value: genParamsBlock.waveLengthInNm + " nm",
      }),
      ...this.cellFactory.createSpanCell({
        borderStyle: "thin",
        span: 9,
        value: "Mérést végezte:" + genParamsBlock.operator,
      }),
    ];
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
