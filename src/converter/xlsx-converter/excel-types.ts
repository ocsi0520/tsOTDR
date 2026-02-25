import type writeXlsxFile from "write-excel-file";
import type { Cell as RawCell, ValueType } from "write-excel-file";
export type { ValueType } from "write-excel-file";

export type CellV3 = RawCell extends ValueType ? RawCell : RawCell | ValueType;
export type Row = CellV3[];
export type SheetData = Row[];

export type CellObject = NonNullable<Exclude<CellV3, ValueType>>;
export type CellWithSpan = CellObject & { span: number };

export type Columns = NonNullable<
  Parameters<typeof writeXlsxFile>[1]["columns"]
>[number];
