import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import {
  filterImageFromURL,
  deleteLocalFiles,
  renderVideo,
  test,
} from "./util/util";
import fs from "fs";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // filter image --> render video --> delete tmp files endpoint

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const url: string = req.query.image_url;
    if (!url) {
      res.status(400).send({ message: "url is null" });
    }
    try {
      console.log("got it....");
      const output: string = path.basename(url, ".jpg");
      res.send(output);
      const promises: Array<Promise<string>> = [];
      for (var i: number = 0; i <= 5; i++) {
        promises.push(filterImageFromURL(url, i));
      }
      Promise.all(promises)
        .then(async (results) => {
          console.log("All done", results);
          await renderVideo(output);
          deleteLocalFiles(results);
        })
        .catch((e) => {
          // Handle errors here
        });
      // const filteredimage = await filterImageFromURL(url).then(renderVideo);
      // console.log("filteredimage : " + filteredimage);
      //res.status(200).send(filteredimage);
    } catch (error) {
      res.status(422).send("invalid image url");
    }
  });

  //display all in json format
  app.get("/display", async (req: Request, res: Response) => {
    const dirPath = path.join(__dirname, "util/complete");
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        console.log("somthing went wrong -> " + err);
        res.send("somthing went wrong -> " + err);
      } else {
        console.log(files);
        res.send(files);
      }
    });
  });

  // send specific video
  app.get("/display/:name", async (req: Request, res: Response) => {
    const dirPath = path.join(__dirname, "util/complete");
    res
      .status(200)
      .sendFile(`${dirPath}/${req.params.name}`, (e) => console.log(e));
  });

  // testing
  app.get("/test", async (req: Request, res: Response) => {
    test();
    res.status(200).send("testing");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
