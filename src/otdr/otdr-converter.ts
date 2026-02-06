import type { OdtrParser } from "./otdr-parser";
import type { Representation } from "./representation/Representation";

export class OtdrConverter {
  private parser: OdtrParser;

  constructor(parser: OdtrParser) {
    this.parser = parser;
  }

  // TODO: should return a File
  public async convert(sorFile: File): Promise<File> {
    this.validate(sorFile);
    const representation = this.parser.parse(await sorFile.arrayBuffer());
    return this.convertRepresentationToXlsx(representation);
  }
  private validate(sorFile: File): void {
    if (!sorFile.name.endsWith(".sor")) throw new Error("not a SOR file");
  }

  private convertRepresentationToXlsx(_representation: Representation): File {
    throw new Error("xlsx file creation is not implemented yet");
  }
}
