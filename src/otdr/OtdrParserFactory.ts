import { OdtrParser } from "./otdr-parser";
import { BlockParserFactory } from "./parser/BlockParserFactory";

export class OtdrParserFactory {
  public createParser(): OdtrParser {
    const parserFactory = new BlockParserFactory();
    return new OdtrParser(parserFactory);
  }
}
