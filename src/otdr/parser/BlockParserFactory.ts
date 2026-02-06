import type { OtdrReader } from "../reader/OtdrReader";
import { MapBlockParser } from "./MapBlockParser";
import type { BlockParser } from "./BlockParser";
import {
  knownBlockNames,
  type KnownBlockName,
} from "../representation/block-names";
import { GenParamsBlockParser } from "./GenParamsBlockParser";

export class BlockParserFactory {
  public createParser(blockName: KnownBlockName, reader: OtdrReader): BlockParser
  public createParser(blockName: string, reader: OtdrReader): BlockParser
  public createParser(blockName: string, reader: OtdrReader): BlockParser {
    if (!this.isKnownBlockName(blockName))
      throw new Error("no parser found for blockname: " + blockName);

    switch (blockName) {
      case "Map":
        return new MapBlockParser(reader);
      // TODO: implement
      case "GenParams":
        return new GenParamsBlockParser(reader);
      case "SupParams":
      case "FxdParams":
      case "KeyEvents":
      case "DataPts":
      case "LnkParams":
      case "Cksum":
        throw new Error("no implementation yet for: " + blockName);
    }
  }

  private isKnownBlockName(blockName: string): blockName is KnownBlockName {
    return knownBlockNames.includes(blockName as KnownBlockName);
  }
}
