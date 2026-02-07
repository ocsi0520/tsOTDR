import type { OtdrReader } from "../reader/OtdrReader";
import type { BlockDescriptor } from "../representation/MapBlock";
import type { Representation } from "../representation/Representation";
import { BlockParser } from "./BlockParser";

export class SkippingBlockParser extends BlockParser {
  private blockDescriptor: BlockDescriptor;
  constructor(reader: OtdrReader, blockDescriptor: BlockDescriptor) {
    super(reader);
    this.blockDescriptor = blockDescriptor;
  }

  public parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation> {
    this.reader.seek(
      this.blockDescriptor.positionInBinaryFile + this.blockDescriptor.size,
    );

    return { ...dataParsedSoFar };
  }
}
