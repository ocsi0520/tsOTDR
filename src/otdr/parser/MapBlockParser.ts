import type { OtdrReader } from "../reader/OtdrReader";
import type { BlockDescriptor, MapBlock } from "../representation/MapBlock";
import type { Representation } from "../representation/Representation";
import type { BlockParser } from "./BlockParser";

export class MapBlockParser implements BlockParser {
  private reader: OtdrReader;
  private currentBlock: Partial<MapBlock> = {};

  constructor(reader: OtdrReader) {
    this.reader = reader;
  }

  public parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation> {
    this.parseFormat();
    this.parseVersion();
    this.currentBlock.size = this.reader.readUnsignedInt(4);
    this.parseBlockDescriptors();

    const parsedBlock = this.currentBlock as MapBlock;
    return { ...dataParsedSoFar, mapBlock: parsedBlock };
  }

  private parseFormat(): void {
    const first4Bytes = this.reader.readFixedString(4);
    const hasNameHeader = first4Bytes === "Map\0";
    this.currentBlock.format = hasNameHeader ? 2 : 1;
    if (this.currentBlock.format === 1) this.reader.seek(0);
  }

  private parseVersion(): void {
    const rawVersion = this.reader.readUnsignedInt(2);
    this.currentBlock.version = {
      raw: rawVersion,
      normalized: rawVersion / 100,
    };
  }

  private parseBlockDescriptors(): void {
    const numberOfBlocksIncludingHeader = this.reader.readUnsignedInt(2);
    const readDescriptors: Array<BlockDescriptor> = [];

    // the other blocks starts right after the MapBlock
    let startPosition = this.currentBlock.size!;

    for (let i = 0; i < numberOfBlocksIncludingHeader - 1; i++) {
      const descriptor = this.readBlockDescriptor(startPosition, i);
      readDescriptors.push(descriptor);
      startPosition += descriptor.size;
    }

    this.currentBlock.map = {
      countOfBlocksWithThis: numberOfBlocksIncludingHeader,
      blockDescriptors: readDescriptors,
    };
  }
  private readBlockDescriptor(
    startPosition: number,
    index: number,
  ): BlockDescriptor {
    const name = this.reader.readStringUntilNull();
    const rawVersion = this.reader.readUnsignedInt(2);
    const size = this.reader.readUnsignedInt(4);
    return {
      name,
      version: {
        raw: rawVersion,
        normalized: rawVersion / 100,
      },
      size,
      positionInBinaryFile: startPosition,
      index,
    };
  }
}
