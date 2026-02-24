import type writeXlsxFile from "write-excel-file/browser";
import type { Cell as RawCell, ValueType } from "write-excel-file/browser";
export type { Cell as RawCell, Row, SheetData, ValueType } from "write-excel-file/browser";

export type CellV3 = RawCell extends ValueType ? RawCell : RawCell | ValueType;

export type CellObject = NonNullable<Exclude<CellV3, ValueType>>;
export type CellWithSpan = CellObject & { span: number };

export type Columns = NonNullable<
  Parameters<typeof writeXlsxFile>[1]["columns"]
>[number];
