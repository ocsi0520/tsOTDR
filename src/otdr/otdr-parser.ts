import { BlockParserFactory } from "./parser/BlockParserFactory";
import type { OtdrReader } from "./reader/OtdrReader";
import type { Representation } from "./representation/Representation";

export class OdtrParser {
  private blockParserFactory: BlockParserFactory;
  constructor(parserFactory: BlockParserFactory) {
    this.blockParserFactory = parserFactory;
  }
  public parse(reader: OtdrReader): Representation {
    let representationSoFar: Partial<Representation> = {};
    const mapBlockParser = this.blockParserFactory.createMapBlockParser(reader);
    representationSoFar = mapBlockParser.parse(representationSoFar);
    const blockDescriptors = representationSoFar.mapBlock!.map.blockDescriptors;

    for (let blockDescriptor of blockDescriptors) {
      const parser = this.blockParserFactory.createParser(
        blockDescriptor,
        reader,
      );
      representationSoFar = parser.parse(representationSoFar);
    }
    return representationSoFar as Representation;
  }
}
