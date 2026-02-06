import "./style.css";
import { OtdrConverter } from './otdr/otdr-converter';
import { OdtrParser } from "./otdr/otdr-parser";

const convertButton =
  document.querySelector<HTMLButtonElement>("button#convert")!;
const fileInput = document.querySelector<HTMLInputElement>("input[type='file']")!;
convertButton.onclick = async () => {
  if (fileInput.files?.length !== 1) {
    alert('no file was selected');
    return;
  }
  const [inputFile] = fileInput.files;
  try {
    const outputFile = await new OtdrConverter(new OdtrParser()).convert(inputFile);
    // TODO: handle response
    console.log(outputFile.name);
  } catch (e) {
    const typedError = e as Error;
    alert("an error has occurred: " + typedError.message);
  }
};
