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
const fs_1 = __importDefault(require("fs"));
const Jimp = require("jimp");
const util = require("util");
var path = require("path");
const exec = util.promisify(require("child_process").exec);
const videoEncoder = "h264"; // mpeg4 libvpx
var output;
// filterImageFromURL
// helper function to download, filter, and save the filtered images locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
function filterImageFromURL(inputURL, index) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                output = path.basename(inputURL, ".jpg");
                const photo = yield Jimp.read(inputURL);
                console.log(`/tmp/${output}.${index}.jpg`);
                const outpath = `/tmp/${output}.${index}.jpg`;
                yield photo
                    .color([{ apply: "hue", params: [Number(index) * 10] }])
                    .write(__dirname + outpath, (img) => {
                    resolve(__dirname + outpath);
                });
            }
            catch (error) {
                console.log("errors ->" + error);
            }
        }));
    });
}
exports.filterImageFromURL = filterImageFromURL;
// renderVideo
// helper function takes all images that are in tmp and make a video
// uses a command line tool ffmpeg
function renderVideo(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            console.log("Encoding for " + name);
            yield exec(`ffmpeg -start_number 1 -i /app/www/util/tmp/${name}.%d.jpg -vcodec ${videoEncoder} -profile:v baseline -pix_fmt yuv420p -filter:v "setpts=20.5*PTS" /app/src/util/complete/${output}.mp4`);
            resolve(path.join(__dirname, "complete", `${output}.mp4`));
        }));
    });
}
exports.renderVideo = renderVideo;
// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
function deleteLocalFiles(files) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let file of files) {
            fs_1.default.unlinkSync(file);
            console.log("deleting");
        }
    });
}
exports.deleteLocalFiles = deleteLocalFiles;
//# sourceMappingURL=util.js.map