import type { OdtrParser } from "./otdr-parser";
import type { ReaderFactory } from "./reader/ReaderFactory";
import type { Representation } from "./representation/Representation";

// __LATER__ base can be extracted, convertRepresentation can be abstract protected
// so after that any kind of file can be created from the representation
export class OtdrToXlsxConverter {
  private parser: OdtrParser;
  private readerFactory: ReaderFactory;
  constructor(parser: OdtrParser, readerFactory: ReaderFactory) {
    this.parser = parser;
    this.readerFactory = readerFactory;
  }

  public async convert(sorFile: File): Promise<File> {
    this.validate(sorFile);
    const reader = await this.readerFactory.createReader(sorFile);

    const representation = this.parser.parse(reader);
    return this.convertRepresentation(representation);
  }
  private validate(sorFile: File): void {
    if (!sorFile.name.endsWith(".sor")) throw new Error("not a SOR file");
  }

  private convertRepresentation(_representation: Representation): File {
    // options: - https://sheetjs.com/ (no styling)
    //          - https://www.npmjs.com/package/write-excel-file (minimatch - https://gitlab.com/catamphetamine/write-excel-file/-/issues/106)
    //          - https://www.npmjs.com/package/exceljs (minimatch - https://github.com/exceljs/exceljs/issues/3024)
    throw new Error("xlsx file creation is not implemented yet");
  }
}
