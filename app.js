const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');
const compressImages = require("compress-images");
const formidable = require("express-formidable");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp-uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', upload.array('multi-files'), (req, res) => {
    compressImg();
    res.redirect('/');
});

app.listen(3000);

function compressImg() {

    const testFolder = './temp-uploads/';


    fs.readdir(testFolder, (err, files) => {
        files.forEach(image => {
            console.log(image);
            console.log(image.name);
            const filePath = "temp-uploads/" + image;
            const compressedFilePath = "uploads/";
            const compression = 60;

            compressImages(filePath, compressedFilePath, { compress_force: false, statistic: true, autoupdate: true }, false,
                { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                { svg: { engine: "svgo", command: "--multipass" } },
                { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
                async function (error, completed, statistic) {
                    console.log("-------------");
                    console.log(error)
                    console.log(completed)
                    console.log(statistic)
                    console.log("-------------");
                }
            );
        });
    });

    // if (image.size > 0) {

    //     if (image.type == "image/png" || image.type == "image/jpeg") {
    //         fileSystem.readFile(image.path, function (error, data) {
    //             if (error) throw error

    // const filePath = "temp-uploads/" + (new Date().getTime()) + "-" + image.name;
    // const compressedFilePath = "uploads/";
    // const compression = 60;

    // fileSystem.writeFile(filePath, data, async function (error) {
    // if (error) throw error;

    // compressImages(filePath, compressedFilePath, { compress_force: false, statistic: true, autoupdate: true }, false,
    //     { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
    //     { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
    //     { svg: { engine: "svgo", command: "--multipass" } },
    //     { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    //     async function (error, completed, statistic) {
    //         console.log("-------------");
    //         console.log(error)
    //         console.log(completed)
    //         console.log(statistic)
    //         console.log("-------------");

    //         fileSystem.unlink(filePath, function (error) {
    //             if (error) throw error
    //         });
    //     }
    // );

    //                 result.send("File has been compressed and saved.")
    //             })

    //             fileSystem.unlink(image.path, function (error) {
    //                 if (error) throw error
    //             })
    //         })
    //     } else {
    //         result.send("Please select an image")
    //     }
    // } else {
    //     result.send("Please select an image")
    // }
}