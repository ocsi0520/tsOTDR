import type { BlockParserFactory } from "./parser/BlockParserFactory";
import type { Representation } from "./representation/Representation";

// facade parser, let's have a factory based on the name, which produces a specific parser
// specific parser parses a part of the representation
// the first anyway must be map block
export class OdtrParser {
  private blockParserFactory: BlockParserFactory;
  constructor(parserFactory: BlockParserFactory) {
    this.blockParserFactory = parserFactory;
  }
  public parse(): Representation {
    const mapBlockParser = this.blockParserFactory.createParserFor("Map");

    let representationSoFar: Partial<Representation> = {};
    representationSoFar = mapBlockParser.parse(representationSoFar);
    console.log({ representationSoFar });
    throw new Error("not implemented yet");
  }
}
