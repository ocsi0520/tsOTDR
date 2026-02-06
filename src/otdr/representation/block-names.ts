export const requiredBlockNames = [
  "GenParams",
  "SupParams",
  "FxdParams",
] as const;
export type RequiredBlockName = (typeof requiredBlockNames)[number];

// keyevent is required if no dataps is present and vica-versa
export const optionalBlockName = [
  "KeyEvents",
  "DataPts",
  "LnkParams",
  "Cksum",
] as const;
export type OptionalBlockName = (typeof optionalBlockName)[number];

export const knownBlockNames = [
  ...requiredBlockNames,
  ...optionalBlockName,
  "Map",
] as const;
export type KnownBlockName = (typeof knownBlockNames)[number];
