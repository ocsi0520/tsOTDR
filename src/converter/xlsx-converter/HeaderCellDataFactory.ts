import type { Representation } from "../../otdr/representation/Representation";
import type { CellFactory } from "./CellFactory";
import type { BorderStyler } from "./BorderStyler";
import type { CellWithSpan, Row, SheetData, CellObject } from "./excel-types";

export class HeaderCellDataFactory {
  private cellFactory: CellFactory;
  private borderStyler: BorderStyler;
  constructor(cellFactory: CellFactory, borderStyler: BorderStyler) {
    this.cellFactory = cellFactory;
    this.borderStyler = borderStyler;
  }

  public getRows(representation: Representation): SheetData {
    const allRows: SheetData = [
      this.getFirstRow(representation),
      this.getSecondRow(representation),
      this.getThirdRow(representation),
      this.getFourthRow(representation),
      this.getFifthRow(representation),
      this.getSixthRow(representation),
      this.getSeventhRow(representation),
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
      }),
      ...this.cellFactory.createSpanCell(this.getLocationCell(representation)),
    ];
  }

  private getThirdRow({ genParamsBlock }: Representation): Row {
    return [
      ...this.cellFactory.createSpanCell({
        value: "Mérési hullámhossz:",
        span: 6,
      }),
      ...this.cellFactory.createSpanCell({
        span: 4,
        value: genParamsBlock.waveLengthInNm + " nm",
      }),
      ...this.cellFactory.createSpanCell({
        span: 9,
        value: "Mérést végezte:" + genParamsBlock.operator,
      }),
    ];
  }

  private getFourthRow({ genParamsBlock }: Representation): Row {
    const bindingText = "Kötést készítette: " + genParamsBlock.operator;
    return [
      ...this.cellFactory.createSpanCell({
        value: "Alk törésmutató:",
        span: 6,
      }),
      ...this.cellFactory.createSpanCell({ value: "", span: 4 }),
      ...this.cellFactory.createSpanCell({ value: bindingText, span: 9 }),
    ];
  }

  private getFifthRow(representation: Representation): Row {
    const typeAndSerialNumber = `${representation.supParamsBlock.module.name} ${representation.supParamsBlock.module.serialNumber}`;
    return [
      ...this.cellFactory.createSpanCell({
        span: 5,
        value: "Mérési pontok azonosító \nszáma/jele:",
        rowSpan: 2,
      }),
      { value: "A" },
      ...this.cellFactory.createSpanCell({
        span: 4,
        value: representation.genParamsBlock.location.A,
        fontWeight: "bold",
      }),
      ...this.cellFactory.createSpanCell({
        span: 9,
        value: "Kötőber. tip; gy.sz.:" + typeAndSerialNumber,
      }),
    ];
  }

  private getSixthRow(representation: Representation): Row {
    return [
      ...this.cellFactory.getEmptyCells(5),
      { value: "B" },
      ...this.cellFactory.createSpanCell({
        span: 4,
        value: representation.genParamsBlock.location.B,
      }),
      ...this.cellFactory.createSpanCell({
        span: 9,
        value: "gyári száma: ???",
      }),
    ];
  }

  private getSeventhRow(representation: Representation): Row {
    console.log(representation);
    return [
      ...this.cellFactory.createSpanCell({
        span: 6,
        value: "Kábel típusa: ???",
      }),
      ...this.cellFactory.createSpanCell({
        span: 4,
        value: "???",
      }),
      ...this.cellFactory.createSpanCell({
        span: 9,
        value: "Szálhossz:",
      }),
    ];
  }

  private getCombinedLocation(representation: Representation): string {
    const { A: locationA, B: locationB } =
      representation.genParamsBlock.location;
    return [locationA, locationB]
      .map((location) => location.trim())
      .filter(Boolean)
      .join("-");
  }

  private getDateOfMeasurementCell(representation: Representation): CellObject {
    return {
      type: Date,
      value: representation.fxdParamsBlock.date.normalized,
    };
  }
  private getLocationCell(representation: Representation): CellWithSpan {
    return {
      value: this.getCombinedLocation(representation),
      type: String,
      fontWeight: "bold",
      span: 13,
    };
  }
}
