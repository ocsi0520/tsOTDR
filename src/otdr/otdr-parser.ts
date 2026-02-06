import type { Representation } from "./representation/Representation";


// facade parser, let's have a factory based on the name, which produces a specific parser
// specific parser parses a part of the representation
// the first anyway must be map block
export class OdtrParser {
    public parse(_arrayBuffer: ArrayBuffer): Representation {
        throw new Error('not implemented yet');
    }
}