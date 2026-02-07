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
    const checksumAlertMsg =
      cksum.checksumFromFile === cksum.calculatedChecksum
        ? "Checksums match"
        : `Checksum mismatch: from file ${cksum.checksumFromFile}, calculated: ${cksum.calculatedChecksum}`;

    alert(checksumAlertMsg);
    return { ...dataParsedSoFar, CksumBlock: cksum };
  }

  private crc16CcittFalse(uint8Array: Array<number>): number {
    let crc = 0xffff;

    for (let b of uint8Array) {
      crc ^= b << 8;
      for (let i = 0; i < 8; i++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        crc &= 0xffff;
      }
    }
    return crc;
  }
  private calculateChecksum(): number {
    const fileSize = this.reader.getFileSizeInBytes();
    const fileSizeWithoutChecksum = fileSize - 2;

    this.reader.seek(0);
    const wholeFileExceptChecksum: Array<number> = [];
    for (let i = 0; i < fileSizeWithoutChecksum; i++)
      wholeFileExceptChecksum.push(this.reader.readUnsignedInt(1));

    const withArray = this.crc16CcittFalse(wholeFileExceptChecksum);
    return withArray;
  }
}
