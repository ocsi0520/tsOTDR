import type { KnownBlockName } from "./block-names";

export type BlockDescriptor = {
  name: KnownBlockName | string; // terminated by '\0'
  version: {
    // if the version is 1.2, then the original number from SOR is 120
    raw: number;
    normalized: number; // = raw / 100
  };
  size: number; // unsigned 4 bytes

  positionInBinaryFile: number;
  index: number;
};

export type MapBlock = {
  name: "Map";
  format: 1 | 2;
  version: {
    // if the version is 1.2, then the original number from SOR is 120
    raw: number;
    normalized: number;
  };
  normalizedVersion: number;
  size: number; // nbytes
  map: {
    countOfBlocksWithThis: number;
    blockDescriptors: Array<BlockDescriptor>;
  };
};
