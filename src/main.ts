import "./style.css";
import { OtdrToXlsxConverter } from "./otdr/otdr-to-xlsx-converter";
import { OdtrParser } from "./otdr/otdr-parser";
import { BlockParserFactory } from "./otdr/parser/BlockParserFactory";
import { ReaderFactory } from "./otdr/reader/ReaderFactory";

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
    const parserFactory = new BlockParserFactory();
    const facadeParser = new OdtrParser(parserFactory);

    const readerFactory = new ReaderFactory();
    const outputFile = await new OtdrToXlsxConverter(
      facadeParser,
      readerFactory,
    ).convert(inputFile);
    // TODO: handle response
    console.log(outputFile.name);
  } catch (e) {
    const typedError = e as Error;
    alert("an error has occurred: " + typedError.message);
  }
};
