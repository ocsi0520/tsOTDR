import { BlockParserFactory } from "./parser/BlockParserFactory";
import type { OtdrReader } from "./reader/OtdrReader";
import type { Representation } from "./representation/Representation";

export class OdtrParser {
  private blockParserFactory: BlockParserFactory;
  constructor(parserFactory: BlockParserFactory) {
    this.blockParserFactory = parserFactory;
  }
  public parse(reader: OtdrReader): Representation {
    const mapBlockParser = this.blockParserFactory.createParser("Map", reader);

    let representationSoFar: Partial<Representation> = {};
    representationSoFar = mapBlockParser.parse(representationSoFar);
    console.log({ representationSoFar });
    throw new Error("not implemented yet");
  }
}
