import path from "path";
import { parentPort } from "worker_threads";
import {
  filterImageFromURL,
  deleteLocalFiles,
  renderVideo,
  cronReq,
} from "./util/util";

export function startWorking(url: string) {
  console.log("in function");
  try {
    console.log("got it....");
    const output: string = path.basename(url, ".jpg");
    const promises: Array<Promise<string>> = [];
    for (var i: number = 0; i <= 36; i++) {
      promises.push(filterImageFromURL(url, i));
    }
    Promise.all(promises)
      .then(async (results) => {
        console.log("All done", results);
        await renderVideo(output);
        deleteLocalFiles(results);
        cronReq();
        parentPort.postMessage("done");
      })
      .catch((e) => {
        // Handle errors here
      });
  } catch (error) {
    console.log(error);
  }
}
