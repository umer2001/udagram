const path = require('path');
const { workerData, parentPort } = require('worker_threads');
const {startWorking} = require(path.resolve(__dirname, workerData.path));
console.log("///");

startWorking(workerData.url);