import { ApprovalDataFactory } from "./ApprovalDataFactory";
import { FrameCreator } from "./FrameCreator";
import { CellFactory } from "./CellFactory";
import { CellStructureUnifier } from "./CellStructureUnifier";
import { HeaderCellDataFactory } from "./HeaderCellDataFactory";
import { XlsxConverter } from "./XlsxConverter";
import { CommentDataFactory } from "./CommentDataFactory";

export class XlsxConverterFactory {
  public createXlsxConverter(): XlsxConverter {
    const cellFactory = new CellFactory();
    const frameCreator = new FrameCreator(new CellStructureUnifier());
    return new XlsxConverter(
      new HeaderCellDataFactory(cellFactory, frameCreator),
      new ApprovalDataFactory(cellFactory, frameCreator),
      new CommentDataFactory(cellFactory, frameCreator)
    );
  }
}
