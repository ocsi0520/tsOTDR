import type { Representation } from "../representation/Representation";
import type { SupParams } from "../representation/SupParams";
import { BlockParser } from "./BlockParser";

export class SupParamsBlockParser extends BlockParser {
  public parse(
    dataParsedSoFar: Partial<Representation>,
  ): Partial<Representation> {
    const currentBlock: SupParams = {
      name: this.readName(dataParsedSoFar, "SupParams"),
      supplierName: this.reader.readStringUntilNull(),
      Otdr: {
        name: this.reader.readStringUntilNull(),
        serialNumber: this.reader.readStringUntilNull(),
      },
      module: {
        name: this.reader.readStringUntilNull(),
        serialNumber: this.reader.readStringUntilNull(),
      },
      softwareVersion: this.reader.readStringUntilNull(),
      other: this.reader.readStringUntilNull(),
    };

    return { ...dataParsedSoFar, supParamsBlock: currentBlock };
  }
}
