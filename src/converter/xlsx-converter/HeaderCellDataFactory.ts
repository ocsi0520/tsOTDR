import type { Cell, Row, SheetData } from "write-excel-file/browser";
import type { Representation } from "../../otdr/representation/Representation";
import type { CellFactory, CellWithSpan } from "./CellFactory";
import type { BorderStyler } from "./BorderStyler";

export class HeaderCellDataFactory {
  private cellFactory: CellFactory;
  private borderStyler: BorderStyler;
  constructor(cellFactory: CellFactory, borderStyler: BorderStyler) {
    this.cellFactory = cellFactory;
    this.borderStyler = borderStyler;
  }
  // TODO: finish
  public getRows(representation: Representation): SheetData {
    const allRows = [
      this.getFirstRow(representation),
      this.getSecondRow(representation),
      this.getThirdRow(representation),
    ];

    const borderedRows: SheetData = [
      allRows[0],
      ...this.borderStyler.frameFor(allRows.slice(1)),
    ];

    return borderedRows;
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
      ...this.cellFactory.getEmptyCells(2),
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
