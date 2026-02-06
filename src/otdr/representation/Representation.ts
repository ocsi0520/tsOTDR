import type { GenParams } from "./GenParams";
import type { MapBlock } from "./MapBlock";
import type { SupParams } from "./SupParams";

export type Representation = {
    mapBlock: MapBlock;
    genParamsBlock: GenParams
    supParamsBlock: SupParams
    // TODO: rest of them
};
