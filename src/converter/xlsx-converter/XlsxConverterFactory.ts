import { ApprovalDataFactory } from "./ApprovalDataFactory";
import { BorderStyler } from "./BorderStyler";
import { CellFactory } from "./CellFactory";
import { CellStructureUnifier } from "./CellStructureUnifier";
import { HeaderCellDataFactory } from "./HeaderCellDataFactory";
import { XlsxConverter } from "./XlsxConverter";

export class XlsxConverterFactory {
  public createXlsxConverter(): XlsxConverter {
    const cellFactory = new CellFactory();
    const borderStyler = new BorderStyler(new CellStructureUnifier());
    return new XlsxConverter(
      new HeaderCellDataFactory(cellFactory, borderStyler),
      new ApprovalDataFactory(cellFactory, borderStyler),
    );
  }
}
