const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs"); 


// Express Module
const app = express();

app.use(cors()); // Cross Origin Resource Sharing
//app.use(cors({origin: "http://localhost:3000", credentials: true})); // Cross Origin Resource Sharing
app.use(fileUpload()); // File system upload middleware, not database upload
app.use(express.static(__dirname + "/public")); // Static Files
app.use(express.json()); // Middlewares



app.post("/upload", (request, response) => {

    let imageFile = request.files.file;

    console.log(imageFile);
    
    // mv method is given by express-fileupload package
    imageFile.mv(`./public/images/${imageFile.name}`, uploadError => {

        if(uploadError) return response.status(500).send("Something went wrong");

        return response.status(201).send("upload successful");

    });

});


app.post("/update-upload", (request, response) => {

    const newImageFile = request.files.file;
    const imageFileToReplace = request.body.imageFilename;

    // First, need to remove the previous file from file system
    fs.unlink(`./public/images/${imageFileToReplace}`, unlinkError => {
                    
        if(unlinkError) return response.status(500).send("Something went wrong");

        // Now upload the new image file
        newImageFile.mv(`./public/images/${newImageFile.name}`, uploadError => {

            if(uploadError) return response.status(500).send("Something went wrong");

            return response.status(201).send("Image replaced");
            
        });
        
    });            
})



// Port & Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));









