import type { OtdrReader } from "../reader/OtdrReader";
import { MapBlockParser } from "./MapBlockParser";
import type { BlockParser } from "./BlockParser";
import { GenParamsBlockParser } from "./GenParamsBlockParser";
import { SupParamsBlockParser } from "./SupParamsBlockParser";
import { FxdParamsBlockParser } from "./FxdParamsBlockParser";
import { KeyEventsBlockParser } from "./KeyEventsBlockParser";
import { DataPtsBlockParser } from "./DataPtsBlockParser";
import { SkippingBlockParser } from "./SkippingBlockParser";
import type { BlockDescriptor } from "../representation/MapBlock";

export class BlockParserFactory {
  public createMapBlockParser(reader: OtdrReader) {
    return new MapBlockParser(reader);
  }

  public createParser(
    blockDescriptor: BlockDescriptor,
    reader: OtdrReader,
  ): BlockParser {
    const blockName = blockDescriptor.name;
    switch (blockName) {
      case "Map":
        throw new Error(
          "Map should not be present twice. If this is the first time, then rather use createMapBlockParser() fn",
        );
      case "GenParams":
        return new GenParamsBlockParser(reader);
      case "SupParams":
        return new SupParamsBlockParser(reader);
      case "FxdParams":
        return new FxdParamsBlockParser(reader);
      case "KeyEvents":
        return new KeyEventsBlockParser(reader);
      case "DataPts":
        return new DataPtsBlockParser(reader);
      case "LnkParams":
        // LnkParams is missing from jsODTR, most probably it is solved by "slurping"
        return new SkippingBlockParser(reader, blockDescriptor); // used to be "slurping" in jsODTR
      case "Cksum":
        throw new Error("no implementation yet for: " + blockName);
      default:
        return new SkippingBlockParser(reader, blockDescriptor); // used to be "slurping" in jsODTR
    }
  }
}
