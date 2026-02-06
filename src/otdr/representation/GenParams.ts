import type { AssociateType } from "../../utility/associate-type";

// REF: http://www.ciscopress.com/articles/article.asp?p=170740&seqNum=7
export type FiberType =
  | "G.651 (50um core multimode)"
  | "G.652 (standard SMF)"
  | "G.653 (dispersion-shifted fiber)"
  | "G.654 (1550nm loss-minimzed fiber)"
  | "G.655 (nonzero dispersion-shifted fiber)"
  | "unknown";

export const buildConditionByRaw = {
  BC: "as-built",
  CC: "as-current",
  RC: "as-repaired",
  OT: "other",
} as const;

export type BuildConditionAssociation = AssociateType<typeof buildConditionByRaw>;

export type GenParams = {
  name: "GenParams";
  lang: string; // 2 chars
  cableId: string; // assumption: read until '\0'
  fiberId: string;
  fiberType?: {
    // omitted in V1
    raw: number; // 2 bytes unsigned number
    normalized: FiberType;
  };
  waveLengthInNm: number; // 2 bytes unsigned - nanometer
  location: {
    A: string;
    B: string;
  };
  cableCodeOrFiberType: string; // vary from vendor to vendor
  buildCondition: BuildConditionAssociation['Unified']; // 2 byte characters w/ out terminating '\0'
  // don't know the units of the following 2
  userOffset: number; // signed 4 bytes
  userOffsetDistance?: number; // signed 4 bytes (only in version 2)
  // string might contain \n or \r
  operator: string;
  comments: string;
};
