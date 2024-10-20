const uuid = require('uuid'), // Used to generate unique identifiers
    fs = require("fs"), // Used to work with the file system
    guid = () => uuid.v4(), // Used to generate a unique identifier
    path = require("path"), // Used to work with file and directory paths
    multer = require("multer"); // Used to handle file uploads

class UploadService {
    constructor() { }

    static getInstance({ pathDest }) {
        
        // Create a new instance of the UploadService
        var picturesStorage = multer.diskStorage({

            // here we define the destination of the files, where they will be stored
            destination: function (req, file, cb) {
                try {
                    // create the directory if it doesn't exist, where the files will be stored
                    fs.mkdirSync(pathDest, { recursive: true });
                } catch (e) {
                    // if there is an error, log it
                    console.log(e);
                }
                // call the callback function with the destination path
                cb(null, pathDest);
            },
            
            // here we define the filename of the files, how they will be named
            filename: function (req, file, cb) {

                // we use guid() to generate a unique identifier for the file
                // that way, we can make sure that the file name is unique
                // and we won't receive an error if user is uploaded twice with the same name
                cb(null, guid() + path.extname(file.originalname));
            },

            // here we define the limits of the files that can be uploaded
            limits: { fieldSize: 25 * 1024 * 1024, fieldNameSize: 1000 },
        });
        
        // return a new instance of multer with the storage configuration
        // we've defined above
        return multer({ storage: picturesStorage });
    }



}

module.exports = UploadService;