"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const util_1 = require("./util/util");
const fs_1 = __importDefault(require("fs"));
(() => __awaiter(this, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
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
    app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send("try GET /filteredimage?image_url={{}}");
    }));
    // filter image --> render video --> delete tmp files endpoint
    app.get("/filteredimage", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const url = req.query.image_url;
        if (!url) {
            res.status(400).send({ message: "url is null" });
        }
        try {
            console.log("got it....");
            const output = path_1.default.basename(url, ".jpg");
            res.send(output);
            const promises = [];
            for (var i = 0; i <= 36; i++) {
                promises.push(util_1.filterImageFromURL(url, i));
            }
            Promise.all(promises)
                .then((results) => __awaiter(this, void 0, void 0, function* () {
                console.log("All done", results);
                yield util_1.renderVideo(output);
                util_1.deleteLocalFiles(results);
                util_1.cronReq();
            }))
                .catch((e) => {
                // Handle errors here
            });
            // const filteredimage = await filterImageFromURL(url).then(renderVideo);
            // console.log("filteredimage : " + filteredimage);
            //res.status(200).send(filteredimage);
        }
        catch (error) {
            res.status(422).send("invalid image url");
        }
    }));
    //display all in json format
    app.get("/display", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const dirPath = "/app/src/util/complete";
        fs_1.default.readdir(dirPath, (err, files) => {
            if (err) {
                console.log("somthing went wrong -> " + err);
                res.send("somthing went wrong -> " + err);
            }
            else {
                console.log(files);
                res.send(files);
            }
        });
    }));
    // send specific video
    app.get("/display/:name", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const dirPath = "/app/src/util/complete";
        res
            .status(200)
            .sendFile(`${dirPath}/${req.params.name}`, (e) => console.log(e));
    }));
    //display all in json format
    app.get("/test", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const url = req.query.image_url;
        if (worker_threads_1.isMainThread) {
            console.log("im main thread");
            console.log("name from main thread : " + url);
            res.send("ok");
            const worker = new worker_threads_1.Worker("./worker.js", {
                workerData: {
                    path: "./intermediator.js",
                    url: url,
                },
            });
            //Listen from worker
            worker.on("message", (msg) => console.log("done : " + msg));
            worker.on("error", (err) => console.log("error on worker : " + err));
            worker.on("exit", (code) => {
                if (code !== 0)
                    new Error(`Worker stopped with exit code ${code}`);
            });
        }
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map