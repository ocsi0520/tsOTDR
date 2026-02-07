import type { Cksum } from "./Cksum";
import type { DataPts } from "./DataPts";
import type { FxdParams } from "./FxdParams";
import type { GenParams } from "./GenParams";
import type { KeyEventBlock } from "./KeyEvents";
import type { MapBlock } from "./MapBlock";
import type { SupParams } from "./SupParams";

export type Representation = {
  mapBlock: MapBlock;
  genParamsBlock: GenParams;
  supParamsBlock: SupParams;
  fxdParamsBlock: FxdParams;
  keyEventBlock: KeyEventBlock;
  dataPtsBlock: DataPts;
  CksumBlock: Cksum;
};
