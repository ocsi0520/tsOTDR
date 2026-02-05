// REF: http://www.ciscopress.com/articles/article.asp?p=170740&seqNum=7
type FiberType = "G.651 (50um core multimode)" | "G.652 (standard SMF)" | "G.653 (dispersion-shifted fiber)" | "G.654 (1550nm loss-minimzed fiber)" | "G.655 (nonzero dispersion-shifted fiber)" | "unknown"

type BuildCondition = 
| {raw: 'BC', normalized: 'as-built'}
| {raw: 'CC', normalized: 'as-current'}
| {raw: 'RC', normalized: 'as-repaired'}
| {raw: 'OT', normalized: 'other'}
| {raw: string, normalized: 'unknown'}

export type GenParams = {
    name: 'GenParams'
    lang: string; // 2 chars
    cableId: string; // assumption: read until '\0'
    fiberId: string;
    fiberType?: { // omitted in V1
        raw: number // 2 bytes number
        normalized: FiberType;
    }
    waveLengthInNm: number; // 2 bytes - nanometer
    location: {
        A: string;
        B: string;
    }
    cableCodeOrFiberType: string;
    buildCondition: BuildCondition;
    userOffset: number; // signed 4 bytes
    userOffsetDistance: number; // signed 4 bytes
    operator: string;

}