import "./style.css";
import { OtdrConverter } from './otdr/otdr-converter';

const convertButton =
  document.querySelector<HTMLButtonElement>("button#convert")!;
const fileInput = document.querySelector<HTMLInputElement>("input[type='file']")!;
convertButton.onclick = async () => {
  if (fileInput.files?.length !== 1) {
    alert('no file was selected');
    return;
  }
  const [file] = fileInput.files;
  try {
    // TODO: handle response
    new OtdrConverter().convert(file);

  } catch (e) {
    const typedError = e as Error;
    alert("an error has occurred: " + typedError.message);
  }
};
