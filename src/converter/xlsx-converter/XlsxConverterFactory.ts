import { CellFactory } from "./CellFactory";
import { HeaderCellDataFactory } from "./HeaderCellDataFactory";
import { XlsxConverter } from "./XlsxConverter";

export class XlsxConverterFactory {
  public createXlsxConverter(): XlsxConverter {
    return new XlsxConverter(new HeaderCellDataFactory(new CellFactory()));
  }
}
