import "./style.css";
import { OtdrToXlsxConverter } from "./otdr/otdr-to-xlsx-converter";
import { OdtrParser } from "./otdr/otdr-parser";
import { BlockParserFactory } from "./otdr/parser/BlockParserFactory";
import { ReaderFactory } from "./otdr/reader/ReaderFactory";
import { XlsxConverter } from "./converter/xlsx-converter/XlsxConverter";
import { HeaderCellDataFactory } from "./converter/xlsx-converter/HeaderCellDataFactory";
import { CellFactory } from "./converter/xlsx-converter/CellFactory";

const convertButton =
  document.querySelector<HTMLButtonElement>("button#convert")!;
const fileInput =
  document.querySelector<HTMLInputElement>("input[type='file']")!;
convertButton.onclick = async () => {
  if (fileInput.files?.length !== 1) {
    alert("no file was selected");
    return;
  }
  const [inputFile] = fileInput.files;
  try {
    // TODO: extract the creation of xlsx converter into another file
    const xlsxConverter = new XlsxConverter(
      new HeaderCellDataFactory(new CellFactory()),
    );
    const parserFactory = new BlockParserFactory();
    const facadeParser = new OdtrParser(parserFactory);

    const readerFactory = new ReaderFactory();
    const outputFile = await new OtdrToXlsxConverter(
      facadeParser,
      readerFactory,
      xlsxConverter,
    ).convert(inputFile);
    downloadFile(outputFile);
  } catch (e) {
    const typedError = e as Error;
    alert("an error has occurred: " + typedError.message);
  }
};

const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name || "download.xlsx"; // fallback name
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url); // clean up
};
