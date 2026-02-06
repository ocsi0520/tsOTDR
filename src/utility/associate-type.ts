export type AssociateType<
  T extends Record<string, unknown>,
  HasUnkown = true,
> = {
  Raw: keyof T;
  Normalized: T[keyof T];
  Unified: HasUnkown extends true
    ?
        | { raw: keyof T; normalized: T[keyof T] }
        | { raw: string; normalized: "unknown" }
    : { raw: keyof T; normalized: T[keyof T] };
};
