type ByteSize = 1 | 2 | 4;
type BitSize = 8 | 16 | 32;

export class OtdrReader {
  private static LITTLE_ENDIAN_MODE = true;
  private offset: number;
  private view: DataView;
  constructor(dataView: DataView, offset = 0) {
    this.view = dataView;
    this.offset = offset;
  }

  public seek(pos: number): void {
    this.offset = pos;
  }

  public getPosition(): number {
    return this.offset;
  }

  // TODO: test for utf-8 multiple byte-characters
  public readStringUntilNull(): string {
    const characters: Array<string> = [];
    let lastCharacter: string;

    do {
      lastCharacter = String.fromCharCode(this.readUnsignedInt(1));
      characters.push(lastCharacter);
    } while (lastCharacter !== "\0");

    const stringWithoutEnding0 = characters.slice(0, -1).join("");
    return stringWithoutEnding0;
  }

  // TODO: test for utf-8 multiple byte-characters
  public readFixedString(length: number): string {
    const characters: Array<string> = [];
    for (let i = 0; i < length; i++) {
      characters.push(String.fromCharCode(this.readUnsignedInt(1)));
    }
    return characters.join("");
  }

  public readUnsignedInt(byteSize: ByteSize): number {
    return this.readInt(false, byteSize);
  }

  public readSignedInt(byteSize: ByteSize): number {
    return this.readInt(true, byteSize);
  }

  // TODO: check
  private readInt(isSigned: boolean, byteSize: ByteSize): number {
    const bitSize = (byteSize * 8) as BitSize;
    const methodPrefix = isSigned ? "getInt" : "getUint";
    const methodName = `${methodPrefix}${bitSize}` as const;
    const value = this.view[methodName](this.offset, OtdrReader.LITTLE_ENDIAN_MODE);
    this.offset += byteSize;
    return value;
  }
}
