import type { Cksum } from "../representation/Cksum";
import type { Representation } from "../representation/Representation";
import { BlockParser } from "./BlockParser";

export class CksumBlockParser extends BlockParser {
  public parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation> {
    const cksum: Cksum = {
      name: this.readName(dataParsedSoFar, "Cksum"),
      checksumFromFile: this.reader.readUnsignedInt(2),
      calculatedChecksum: this.calculateChecksum(),
    };
    return { ...dataParsedSoFar, CksumBlock: cksum };
  }
  private calculateChecksum(): number {
    throw new Error("not implemented calculateChecksum");
  }
}
