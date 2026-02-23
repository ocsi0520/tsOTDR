import type { Representation } from "../../otdr/representation/Representation";

export class XlsxConverter {
  public convertRepresentation(_representation: Representation): File {
    // options: - https://sheetjs.com/ (no styling)
    //          - https://www.npmjs.com/package/write-excel-file (minimatch - https://gitlab.com/catamphetamine/write-excel-file/-/issues/106)
    //          - https://www.npmjs.com/package/exceljs (minimatch - https://github.com/exceljs/exceljs/issues/3024)
    throw new Error("xlsx file creation is not implemented yet");
  }
}
