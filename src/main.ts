import "./style.css";
import { OtdrConverter } from "./otdr/otdr-converter";
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
    const readerFactory = new ReaderFactory();
    const reader = await readerFactory.createReader(inputFile);
    const parserFactory = new BlockParserFactory(reader);
    const parser = new OdtrParser(parserFactory);
    const outputFile = await new OtdrConverter(parser).convert(inputFile);
    // TODO: handle response
    console.log(outputFile.name);
  } catch (e) {
    const typedError = e as Error;
    alert("an error has occurred: " + typedError.message);
  }
};
