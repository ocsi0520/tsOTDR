import type { XlsxConverter } from "../converter/xlsx-converter/XlsxConverter";
import type { OdtrParser } from "./otdr-parser";
import type { ReaderFactory } from "./reader/ReaderFactory";

// __LATER__ base can be extracted, convertRepresentation can be abstract protected
// so after that any kind of file can be created from the representation
export class OtdrToXlsxConverter {
  private parser: OdtrParser;
  private readerFactory: ReaderFactory;
  private xlsxConverter: XlsxConverter;
  constructor(
    parser: OdtrParser,
    readerFactory: ReaderFactory,
    xlsxConverter: XlsxConverter,
  ) {
    this.parser = parser;
    this.readerFactory = readerFactory;
    this.xlsxConverter = xlsxConverter;
  }

  public async convert(sorFile: File): Promise<File> {
    this.validate(sorFile);
    const reader = await this.readerFactory.createReader(sorFile);

    const representation = this.parser.parseWith(reader);
    return this.xlsxConverter.convertRepresentation(representation);
  }
  private validate(sorFile: File): void {
    if (!sorFile.name.endsWith(".sor")) throw new Error("not a SOR file");
  }
}
