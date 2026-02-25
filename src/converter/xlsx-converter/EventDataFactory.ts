import type { Representation } from "../../otdr/representation/Representation";
import type { CellFactory } from "./CellFactory";
import type { FrameCreator } from "./FrameCreator";
import type { Row, SheetData } from "./excel-types";

const KM_TO_M = 1_000;

// TODO: proper styling
export class EventDataFactory {
  private cellFactory: CellFactory;
  private frameCreator: FrameCreator;

  constructor(cellFactory: CellFactory, frameCreator: FrameCreator) {
    this.cellFactory = cellFactory;
    this.frameCreator = frameCreator;
  }

  public getRows(representation: Representation): SheetData {
    const allRows: SheetData = [
      this.getFiberRow(representation),
      this.getTableHeadersRow(representation),
      this.getLegendsRow(),
      this.getARow(representation),
      ...this.getEventRows(representation),
      this.getBRow(representation),
      this.getFooterRow(representation),
    ];

    const borderedRows: SheetData = [
      allRows[0],
      ...this.frameCreator.createFrameFor(allRows.slice(1)),
    ];

    return borderedRows;
  }

  private getFiberRow(representation: Representation): Row {
    return [
      { value: representation.genParamsBlock.fiberId, fontWeight: "bold" },
    ];
  }

  private getTableHeadersRow({ genParamsBlock }: Representation): Row {
    return [
      {
        value: "Kötés száma",
        rowSpan: 2,
      },
      ...this.cellFactory.createSpanCell({
        value: "Opt.hossz [m]:",
        span: 6,
        rightBorderStyle: "thick",
      }),
      ...this.cellFactory.createSpanCell({
        value: `Kötés csill. ${genParamsBlock.waveLengthInNm}-en [dB]`,
        span: 6,
      }),
    ];
  }

  private getLegendsRow(): Row {
    return [
      this.cellFactory.getEmptyCell(),
      ...this.cellFactory.createSpanCell({ value: "A>B", span: 3 }),
      ...this.cellFactory.createSpanCell({
        value: "B>A",
        rightBorderStyle: "thick",
        span: 3,
      }),
      ...this.cellFactory.createSpanCell({ value: "A>B", span: 2 }),
      ...this.cellFactory.createSpanCell({ value: "B>A", span: 2 }),
      ...this.cellFactory.createSpanCell({ value: "Átlag", span: 2 }),
    ];
  }

  private getARow(representation: Representation): Row {
    return [
      { value: "A" },
      ...this.cellFactory.createSpanCell({ value: 0, span: 3 }),
      ...this.cellFactory.createSpanCell({
        value: representation.keyEventBlock.summary.fiberLength.inKm * KM_TO_M,
        rightBorderStyle: "thick",
        span: 3,
      }),
      ...this.cellFactory.createSpanCell({ value: "", span: 2 }),
      ...this.cellFactory.createSpanCell({ value: "", span: 2 }),
      ...this.cellFactory.createSpanCell({ value: "", span: 2 }),
    ];
  }

  private getEventRows({ keyEventBlock }: Representation): Row[] {
    // TODO: finish
    keyEventBlock.events.slice(0, -1);

    return [];
  }

  private getBRow({ keyEventBlock }: Representation): Row {
    const lastKeyEvent = keyEventBlock.events.at(-1)!;
    const endOfLastEvent =
      lastKeyEvent.end?.inKm ?? lastKeyEvent.timeOfTravel.calculatedDistance;
    return [
      { value: "B" },
      ...this.cellFactory.createSpanCell({ value: 0, span: 3 }),
      ...this.cellFactory.createSpanCell({
        value: endOfLastEvent * KM_TO_M,
        rightBorderStyle: "thick",
        span: 3,
      }),
      ...this.cellFactory.createSpanCell({ value: "", span: 2 }),
      ...this.cellFactory.createSpanCell({ value: "", span: 2 }),
      ...this.cellFactory.createSpanCell({ value: "", span: 2 }),
    ];
  }

  private getFooterRow(_representation: Representation): Row {
    return this.frameCreator.thickenBorder(
      [
        { value: "FILE az.sz.:" },
        ...this.cellFactory.createSpanCell({
          span: 3,
          value: "…………1",
        }),
        ...this.cellFactory.createSpanCell({
          span: 3,
          value: "…………1",
          rightBorderStyle: "thick",
        }),
        ...this.cellFactory.createSpanCell({
          span: 4,
          value: "A szál köt.csill.átlaga:",
          rightBorderStyle: "thick",
        }),
        ...this.cellFactory.createSpanCell({
          span: 2,
          // TODO:
          value: "???",
        }),
      ],
      "topBorderStyle",
    );
  }
}
