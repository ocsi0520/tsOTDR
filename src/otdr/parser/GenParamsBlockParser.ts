import {
  buildConditionByRaw,
  type BuildCondition,
  type FiberType,
  type GenParams,
  type KnownRawBuildCondition,
} from "../representation/GenParams";
import type { Representation } from "../representation/Representation";
import { BlockParser } from "./BlockParser";

type Format = Representation["mapBlock"]["format"];

export class GenParamsBlockParser extends BlockParser {
  private static fiberTypeByRaw: Record<number, FiberType> = {
    651: "G.651 (50um core multimode)",
    652: "G.652 (standard SMF)",
    653: "G.653 (dispersion-shifted fiber)",
    654: "G.654 (1550nm loss-minimzed fiber)",
    655: "G.655 (nonzero dispersion-shifted fiber)",
  };

  private currentBlock: Partial<GenParams> = {};
  public parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation> {
    const format = dataParsedSoFar.mapBlock?.format || 1;
    console.log({ format });
    this.currentBlock.name = this.readName(dataParsedSoFar, "GenParams");
    this.currentBlock.lang = this.reader.readFixedString(2);
    this.currentBlock.cableId = this.reader.readStringUntilNull();
    this.currentBlock.fiberId = this.reader.readStringUntilNull();
    this.parseFiberType(format);
    this.currentBlock.waveLengthInNm = this.reader.readUnsignedInt(2);
    this.parseLocation();
    this.currentBlock.cableCodeOrFiberType = this.reader.readStringUntilNull();
    this.parseBuildCondition();
    this.currentBlock.userOffset = this.reader.readSignedInt(4);
    if (format === 2)
      this.currentBlock.userOffsetDistance = this.reader.readSignedInt(4);

    this.currentBlock.operator = this.reader.readStringUntilNull();
    this.currentBlock.comments = this.reader.readStringUntilNull();

    return {
      ...dataParsedSoFar,
      genParamsBlock: this.currentBlock as GenParams,
    };
  }

  private parseFiberType(format: Format) {
    if (format === 1) return;
    const rawFiberType = this.reader.readUnsignedInt(2);
    this.currentBlock.fiberType = {
      raw: rawFiberType,
      normalized:
        GenParamsBlockParser.fiberTypeByRaw[rawFiberType] || "unknown",
    };
  }

  private parseLocation(): void {
    const locationA = this.reader.readStringUntilNull();
    const locationB = this.reader.readStringUntilNull();
    this.currentBlock.location = { A: locationA, B: locationB };
  }

  private parseBuildCondition(): void {
    const rawBuildCondition = this.reader.readFixedString(2);
    const normalized =
      buildConditionByRaw[rawBuildCondition as KnownRawBuildCondition] ||
      "unknown";
    this.currentBlock.buildCondition = {
      raw: rawBuildCondition,
      normalized,
    } as BuildCondition;
  }
}
