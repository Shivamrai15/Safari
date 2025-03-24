# Streaming Service Documentation

This document explains the streaming service module of the application. The module takes an audio file, converts it into an HLS stream using FFmpeg, uploads the generated HLS folder to ImageKit, and finally cleans up temporary files. Below, you'll find a detailed explanation of each section of the code.


## 1. Imports and Dependencies

The code begins by importing required modules and libraries:

- **fs**: Node.js file system module used to work with files and directories.
- **path**: Helps in constructing file paths.
- **ImageKit**: Manages uploading and processing media files.
- **exec**: Executes shell commands (used here to run FFmpeg).
- **uuidv4**: Generates unique IDs, useful for creating unique temporary folders.

```javascript
const fs = require("fs");
const path = require("path");
const ImageKit = require("imagekit");
const { exec } = require("child_process");
const { v4: uuidv4 } = require('uuid');
```


## 2. ImageKit Initialization

Here, the ImageKit instance is configured with credentials from environment variables. This instance is used later to upload files.

```javascript
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
```


## 3. HLS converstion
Below function converts an input audio file to HLS (HTTP Live Streaming) format using FFmpeg.

```javascript
async function convertToHLS(inputPath, outputDir) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const outputFilePath = path.join(outputDir, "playlist.m3u8");
        const command = `ffmpeg -i "${inputPath}" -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls "${outputFilePath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error converting to HLS: ${stderr}`);
            } else {
                resolve();
            }
        });
    });
}
```


Steps in this function:

- **Directory Check**: It verifies if the output directory exists; if not, it creates it.

- **Construct Command**: Builds an FFmpeg command to generate HLS segments and a master playlist (playlist.m3u8).

- **Execute Command**: Runs the command using exec and handles errors appropriately.

## 4. Upload folder to Imagekit.io

Below function uploads the files in a folder to ImageKit and retrieves the URL of the generated .m3u8 playlist file.

```javascript
async function uploadFolderToImageKit(folderPath, folderName) {
    const files = fs.readdirSync(folderPath);
    
    if (files.length <= 3) {
        throw new Error("Not enough files in the folder to upload.");
    }

    const uploadPromises = files.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const fileName = path.basename(filePath);
    
        try {
            const uploadResponse = await imagekit.upload({
                file: fs.readFileSync(filePath),
                fileName,
                folder: folderName,
                useUniqueFileName: false,
            });
            return { file, success: true, error: null };
        } catch (error) {
            console.error(`Error uploading file ${fileName}:`, error);
            return { file, success: false, error };
        }
    });
  
    const results = await Promise.all(uploadPromises);
    const failedUploads = results.filter((result) => !result.success);
    if (failedUploads.length > 0) {
        console.error(
            `Failed to upload the following files:`,
            failedUploads.map((result) => result.file)
        );
        throw new Error("Some files failed to upload.");
    }

    const m3u8File = files.find((file) => file.endsWith(".m3u8"));
    if (m3u8File) {
        return `${imagekit.options.urlEndpoint}${folderName}/${m3u8File}`;
    } else {
        throw new Error("No .m3u8 file found in the folder.");
    }
}
```

- **Key Points**:

    - **Directory Read**: Lists all files within the folder.

    - **Minimum Files Check**: Ensures there are enough files to process (e.g., more than just the playlist file).

    - **File Upload**: Iterates over each file, reads it, and uploads to ImageKit.

    - **Error Handling**: Collects errors if any file fails to upload.

    - **Return Value**: Searches for the .m3u8 file among the uploads and returns its URL.

- **Purpose**: Uploads the streaming files and provides the final streaming URL.


## 5. Delete Folder Recursively
Below function deletes a folder and all its contents recursively.

```javascript
function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const currentPath = path.join(folderPath, file);
    
            try {
                if (fs.lstatSync(currentPath).isDirectory()) {
                    deleteFolderRecursive(currentPath);
                } else {
                    fs.unlinkSync(currentPath);
                }
            } catch (err) {
                console.error(`Error deleting file or folder: ${currentPath}`, err);
            }
        });
        try {
            fs.rmdirSync(folderPath);
        } catch (err) {
            console.error(`Error deleting folder: ${folderPath}`, err);
        }
    }
}
```

- **What it does**:
  - **File and Folder Deletion**: Iterates over all items in a folder and deletes them, handling directories recursively.

  - **Error Handling**: Logs any errors encountered during the deletion process.

- **Purpose**: Cleans up temporary files and directories after processing is complete.

## 6. main Function
The main function orchestrates the complete workflow: converting the audio file, uploading the HLS files, and cleaning up.

```javascript
async function main(audioFilePath) { 
    const hlsFolderPath = path.join(__dirname, uuidv4());
    if (!fs.existsSync(hlsFolderPath)) fs.mkdirSync(hlsFolderPath);

    await convertToHLS(audioFilePath, hlsFolderPath); 
    const m3u8Url = await uploadFolderToImageKit(hlsFolderPath, uuidv4()); 
    console.log(m3u8Url);
    fs.unlinkSync(audioFilePath); 
    deleteFolderRecursive(hlsFolderPath);
}
```