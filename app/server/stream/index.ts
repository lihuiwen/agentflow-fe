import { renderToPipeableStream } from "react-dom/server";
import { createtWritableStream } from "./renderHelpers";

async function renderToStream(jsx: React.ReactElement): Promise<string> {
  // const bootstrapScript = await getBootstrapScript();

  return new Promise((resolve, reject) => {
    const writableStream = createtWritableStream(resolve, reject);

    // if (bootstrapScript === null) {
    //   return reject("Cannot find bootstrapScripts path");
    // }
    const { pipe } = renderToPipeableStream(jsx, {
      // bootstrapScripts: [
      //   bootstrapScript["client.js"],
      // ],
      onAllReady() {
        pipe(writableStream);
      },
    });
  });
}

export default renderToStream;
