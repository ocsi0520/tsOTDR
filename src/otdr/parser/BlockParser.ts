import type { Representation } from "../representation/Representation";

export interface BlockParser {
  parse(dataParsedSoFar: Partial<Representation>): Partial<Representation>;
}
