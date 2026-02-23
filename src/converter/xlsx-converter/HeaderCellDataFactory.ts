import type { Cell, Row, SheetData } from "write-excel-file";
import type { Representation } from "../../otdr/representation/Representation";

export class HeaderCellDataFactory {
  // TODO: finish
  public getRows(representation: Representation): SheetData {
    return [this.getFirstRow(representation)];
  }

  private getFirstRow(representation: Representation): Row {
    return [
      {
        span: 8,
        value: "KÖTÉSCSILLAPITÁS ÉRTÉKEK SZÁLANKÉNT",
        fontWeight: "bold",
      },
      ...this.getEmptyCells(7), // for span
      ...this.getEmptyCells(5), // really empty cells
      {
        value: "Mérés dátuma",
      },
      ...this.getEmptyCells(2),
      this.getDateOfMeasurementCell(representation),
      this.getEmptyCell(),
    ];
  }
  private getEmptyCell(): Cell {
    return null;
  }

  private getEmptyCells(count: number): Cell[] {
    return Array.from({ length: count }).map(this.getEmptyCell.bind(this));
  }
  private getDateOfMeasurementCell(representation: Representation): Cell {
    return {
      type: Date,
      value: representation.fxdParamsBlock.date.normalized,
    };
  }
}
