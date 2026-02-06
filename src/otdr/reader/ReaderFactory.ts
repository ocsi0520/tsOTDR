import { OtdrReader } from "./OtdrReader";

export class ReaderFactory {
    public async createReader(file: File): Promise<OtdrReader> {
        const dataView = new DataView(await file.arrayBuffer())
        return new OtdrReader(dataView);
    }
}