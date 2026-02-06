import type { OtdrReader } from "../reader/OtdrReader";
import type { KnownBlockName } from "../representation/MapBlock";
import { MapBlockParser } from "./MapBlockParser";
import type { BlockParser } from "./BlockParser";

export class BlockParserFactory {
  public createParser(
    blockName: KnownBlockName | "Map",
    reader: OtdrReader,
  ): BlockParser {
    switch (blockName) {
      case "Map":
        return new MapBlockParser(reader);
      // TODO: implement
      case "GenParams":
      case "SupParams":
      case "FxdParams":
      case "KeyEvents":
      case "DataPts":
      case "LnkParams":
      case "Cksum":
      default:
        throw new Error("no parser found for blockname: " + blockName);
    }
  }
}
