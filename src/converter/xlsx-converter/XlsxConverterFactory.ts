import { ApprovalDataFactory } from "./ApprovalDataFactory";
import { FrameCreator } from "./utils/FrameCreator";
import { CellFactory } from "./utils/CellFactory";
import { CellStructureUnifier } from "./utils/CellStructureUnifier";
import { HeaderCellDataFactory } from "./HeaderCellDataFactory";
import { XlsxConverter } from "./XlsxConverter";
import { CommentDataFactory } from "./CommentDataFactory";
import { EventDataFactory } from "./EventDataFactory";
import { NumberPrecisionSetter } from "./utils/NumberPrecisionSetter";
import { AlignmentSetter } from "./utils/AlignmentSetter";

export class XlsxConverterFactory {
  public createXlsxConverter(): XlsxConverter {
    const cellStructureUnifier = new CellStructureUnifier();
    const cellFactory = new CellFactory();
    const frameCreator = new FrameCreator(cellStructureUnifier);
    const numberPrecisionSetter = new NumberPrecisionSetter(
      cellStructureUnifier,
    );
    const alignmentSetter = new AlignmentSetter(cellStructureUnifier);
    return new XlsxConverter(
      new HeaderCellDataFactory(cellFactory, frameCreator),
      new ApprovalDataFactory(cellFactory, frameCreator),
      new CommentDataFactory(cellFactory, frameCreator),
      new EventDataFactory(cellFactory, frameCreator, numberPrecisionSetter, alignmentSetter),
      cellStructureUnifier,
    );
  }
}
