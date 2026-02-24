import { BorderStyler } from "./BorderStyler";
import { CellFactory } from "./CellFactory";
import { CellStructureUnifier } from "./CellStructureUnifier";
import { HeaderCellDataFactory } from "./HeaderCellDataFactory";
import { XlsxConverter } from "./XlsxConverter";

export class XlsxConverterFactory {
  public createXlsxConverter(): XlsxConverter {
    return new XlsxConverter(
      new HeaderCellDataFactory(
        new CellFactory(),
        new BorderStyler(new CellStructureUnifier()),
      ),
    );
  }
}
