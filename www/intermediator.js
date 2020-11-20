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
const path_1 = __importDefault(require("path"));
const worker_threads_1 = require("worker_threads");
const util_1 = require("./util/util");
function startWorking(url) {
    console.log("in function");
    try {
        console.log("got it....");
        const output = path_1.default.basename(url, ".jpg");
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
            worker_threads_1.parentPort.postMessage("done");
        }))
            .catch((e) => {
            // Handle errors here
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.startWorking = startWorking;
//# sourceMappingURL=intermediator.js.map