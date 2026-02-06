import type { ByteSize, OtdrReader } from "../reader/OtdrReader";
import type { Representation } from "../representation/Representation";

export type RawWith<OtherKey extends string> = { raw: number } & {
  [Key in OtherKey]: number;
};

export abstract class BlockParser {
  public abstract parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation>;
  protected reader: OtdrReader;
  constructor(reader: OtdrReader) {
    this.reader = reader;
  }

  protected getFormat(
    dataParsedSoFar: Partial<Representation>,
  ): Representation["mapBlock"]["format"] {
    return dataParsedSoFar.mapBlock?.format || 1;
  }

  protected readName<T extends string>(
    dataParsedSoFar: Partial<Representation>,
    expectedName: T,
  ): T {
    if (this.getFormat(dataParsedSoFar) !== 2) return expectedName;
    const name = this.reader.readStringUntilNull();
    if (name !== expectedName)
      throw new Error(`Invalid name for ${expectedName}`);
    return expectedName;
  }

  protected readNormalizableUnsigned<T extends string>(
    byteSize: ByteSize,
    multiplier: number,
    normalizedKey: T,
  ): RawWith<T> {
    const raw = this.reader.readUnsignedInt(byteSize);
    return { raw, [normalizedKey]: raw * multiplier } as RawWith<T>;
  }

  protected readNormalizableSigned<T extends string>(
    byteSize: ByteSize,
    multiplier: number,
    normalizedKey: T,
  ): RawWith<T> {
    const raw = this.reader.readSignedInt(byteSize);
    return { raw, [normalizedKey]: raw * multiplier } as RawWith<T>;
  }
}
