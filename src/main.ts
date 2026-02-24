import "./style.css";
import { OtdrToXlsxConverter } from "./otdr/otdr-to-xlsx-converter";
import { ReaderFactory } from "./otdr/reader/ReaderFactory";
import { XlsxConverterFactory } from "./converter/xlsx-converter/XlsxConverterFactory";
import { OtdrParserFactory } from "./otdr/OtdrParserFactory";

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
    const outputFile = await new OtdrToXlsxConverter(
      new OtdrParserFactory().createParser(),
      new ReaderFactory(),
      new XlsxConverterFactory().createXlsxConverter(),
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
