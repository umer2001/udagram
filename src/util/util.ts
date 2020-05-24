import fs from 'fs';
import Jimp = require('jimp');
const util = require("util");
var path = require('path');

const exec = util.promisify(require("child_process").exec);

const debug = false;
const videoEncoder = "h264"; // mpeg4 libvpx
var output: string ;

// filterImageFromURL
// helper function to download, filter, and save the filtered images locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        output = path.basename(inputURL, '.jpg');
        console.log(output);
        for( var i: number = 0; i <= 10; i++ ) {
	        const photo = await Jimp.read(inputURL);
            console.log("in the image loop" + i );
            const outpath = '/tmp/filtered.'+ i +'.jpg';
            await photo
            .color([{apply:'hue', params: [i*10]}])
            .write(__dirname+outpath, (img)=>{
                resolve(__dirname+outpath);
            });
        }    
    });
}

// renderVideo
// helper function takes all images that are in tmp and make a video
// uses a command line tool ffmpeg
export async function renderVideo() {
    console.log("Encoding");
    await exec(`ffmpeg -start_number 1 -i src/util/tmp/filtered.%d.jpg -vcodec ${videoEncoder} -profile:v baseline -pix_fmt yuv420p -filter:v "setpts=20.5*PTS" src/util/tmp/${output}.mp4`);
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
        console.log("deleting");
    }
}