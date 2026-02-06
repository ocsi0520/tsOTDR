import { OtdrReader } from "./OtdrReader";

export class ReaderFactory {
    public createReader(arrayBuffer: ArrayBuffer): OtdrReader {
        const dataView = new DataView(arrayBuffer)
        return new OtdrReader(dataView);
    }
}