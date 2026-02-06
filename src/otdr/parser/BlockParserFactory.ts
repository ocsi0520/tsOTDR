import type { OtdrReader } from "../reader/OtdrReader";
import { MapBlockParser } from "./MapBlockParser";
import type { BlockParser } from "./BlockParser";
import {
  knownBlockNames,
  type KnownBlockName,
} from "../representation/block-names";
import { GenParamsBlockParser } from "./GenParamsBlockParser";
import { SupParamsBlockParser } from "./SupParamsBlockParser";
import { FxdParamsBlockParser } from "./FxdParamsBlockParser";
import { KeyEventsBlockParser } from "./KeyEventsBlockParser";

export class BlockParserFactory {
  public createParser(
    blockName: KnownBlockName,
    reader: OtdrReader,
  ): BlockParser;
  public createParser(blockName: string, reader: OtdrReader): BlockParser;
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
        return new SupParamsBlockParser(reader);
      case "FxdParams":
        return new FxdParamsBlockParser(reader);
      case "KeyEvents":
        return new KeyEventsBlockParser(reader);
      case "DataPts":
      case "LnkParams":
        // TODO: LnkParams is missing from jsODTR, most probably it is solved by
        // "slurping"
      case "Cksum":
        throw new Error("no implementation yet for: " + blockName);
    }
  }

  private isKnownBlockName(blockName: string): blockName is KnownBlockName {
    return knownBlockNames.includes(blockName as KnownBlockName);
  }
}
