export class OtdrReader {
  private offset: number;
  private view: DataView;
  constructor(dataView: DataView, offset = 0) {
    this.view = dataView;
    this.offset = offset;
  }

  public seek(pos: number) {
    this.offset = pos;
  }
  public rewind() {
    this.offset = 0;
  }

  // TODO: test for utf-8 multiple byte-characters
  public readStringUntilNull(): string {
    const characters: Array<string> = [];
    let lastCharacter: string;

    do {
      lastCharacter = String.fromCharCode(this.getUint8());
      characters.push(lastCharacter);
    } while (lastCharacter !== "\0");

    const stringWithoutEnding0 = characters.slice(0, -1).join("");
    return stringWithoutEnding0;
  }

  // TODO: test for utf-8 multiple byte-characters
  public readFixedString(length: number): string {
    const characters: Array<string> = [];
    for (let i = 0; i < length; i++) {
      characters.push(String.fromCharCode(this.getUint8()));
    }
    return characters.join();
  }

  public getUint8(): number {
    return this.view.getUint8(this.offset++);
  }

  public getUint16(): number {
    const value = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return value;
  }

  public getUint32(): number {
    const value = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return value;
  }

  public getInt8(): number {
    return this.view.getInt8(this.offset++);
  }

  public getInt16(): number {
    const value = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return value;
  }

  public getInt32(): number {
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  // TODO: check
  public getInt(isSigned: boolean, byteSize: 1 | 2 | 4): number {
    const bitSize = (byteSize * 8) as 8 | 16 | 32;
    const methodPrefix = isSigned ? "getInt" : "getUint";
    const methodName = `${methodPrefix}${bitSize}` as const;
    const value = this.view[methodName](bitSize, true);
    this.offset += byteSize;
    return value;
  }
}
