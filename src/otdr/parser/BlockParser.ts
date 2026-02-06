import type { OtdrReader } from "../reader/OtdrReader";
import type { Representation } from "../representation/Representation";

export abstract class BlockParser {
  public abstract parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation>;
  protected reader: OtdrReader;
  constructor(reader: OtdrReader) {
    this.reader = reader;
  }

  protected readName<T extends string>(
    dataParsedSoFar: Partial<Representation>,
    expectedName: T,
  ): T {
    if (dataParsedSoFar.mapBlock?.format !== 2) return expectedName;
    const name = this.reader.readStringUntilNull();
    if (name !== expectedName)
      throw new Error(`Invalid name for ${expectedName}`);
    return expectedName;
  }
}
