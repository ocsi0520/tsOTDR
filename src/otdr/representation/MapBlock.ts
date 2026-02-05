export type RequiredBlockName = "GenParams" | "SupParams" | "FxdParams";
// keyevent is required if no dataps is present and vica-versa
export type OptionalBlockName = "KeyEvents" | "DataPts" | "LnkParams" | "Cksum";
export type KnownBlockName = RequiredBlockName | OptionalBlockName;

export type BlockDescriptor = {
  name: KnownBlockName | string; // terminated by '\0'
  version: {
    // if the version is 1.2, then the original number from SOR is 120
    raw: number;
    normalized: number; // = raw / 100
  }
  normalizedVersion: number;
  size: number; // 4 bytes

  positionInBinaryFile: number;
  index: number;
};

export type MapBlock = {
  format: 1 | 2;
  version: number;
  // if the version is 1.2, then the original number from SOR is 120
  normalizedVersion: number;
  size: number; // nbytes
  blockDescription: {
    countOfBlocksWithThis: number;
    contentBlockDescription: Array<BlockDescriptor>;
  };
};