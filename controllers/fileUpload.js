const File=require("../models/File");
const cloudinary = require("cloudinary").v2;


//localfileupload -> handler function

exports.localFileUpload = async (req,res) => {
    try{
       
        //fetch file from request
        const file = req.files.file;
        console.log("File aagyi jee -> ", file);
         
        //create path where file need to stored on server
        let path =__dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH-> ",path)
        
        //add path to the move function
        file.mv(path,(err)=>{
           console.log(err); 
        });
         
        //create a successful response
        res.json({
            success:true,
            message:'Local File Uploaded Successfully',
        });
    }
    catch(error){
       console.log(error);
    }
}

function isFileTypeSupported(fileType,supportedTypes){
    return supportedTypes.includes(fileType);
}

async function uploadFileToCloudinary(file, folder,quality) {
    const options = {folder};
    console.log("temp file path", file.tempFilePath);

    if(quality) {
        options.quality = quality;
    }

    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);

}

//image upload handler
exports.imageUpload = async (req, res) => {
    try{
        //data fetch
        const { name, tags, email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        //Validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        //file format supported hai
        console.log("Uploading to Codehelp");
        const response = await uploadFileToCloudinary(file, "Codehelp");
        console.log(response);

        // db me entry save krni h
         const fileData = await File.create({
             name,
             tags,
             email,
             imageUrl:response.secure_url,
         });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image Successfully Uploaded',
        })
    }
    catch(error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        });

    }
}
//video uploader ka handler

exports.videoUpload=async (req,res)=>{
try{
    //fetch the data
    const {name,email,tags}=req.body;
    console.log(name,email,tags);

    const file=req.files.videoFile;

    //validation
    const supportedTypes=["mp4","mov"];
    const fileType=file.name.split('.')[1].toLowerCase();
    console.log("File type:", fileType);

    if(!isFileTypeSupported(fileType,supportedTypes)){
        return res.status(400).json({
            success:false,
            message:"file format not supported",
        })
    }
    //file format supported hai
    console.log("uploading to codehelp");
    const response=await uploadFileToCloudinary(file,"Codehelp");
    console.log(response);

    const fileData = await File.create({
        name,
        tags,
        email,
        imageUrl:response.secure_url,
    });

    res.json({
        success:true,
        imageUrl:response.secure_url,
        message:'Video Successfully Uploaded',
    })

}




catch(error){
    console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
}
}

//ImageSize Reducer

exports.imageSizeReducer= async(req,res)=>{
try{
    //data fetch
    const {name,email,tags}=req.body;
    console.log(name,email,tags);

    const file=req.files.imageFile;
    console.log("file is",file);

    //validation
    const supportedTypes=["jpg","jpeg","png"];
    const fileType=file.name.split('.')[1].toLowerCase();
    console.log("file type is:",fileType);

    if(!isFileTypeSupported(fileType,supportedTypes)){
        return res.status(400).json({
            success:false,
            message:"file format not supported",
        })
    }
    //file format supported hai
    console.log("uploading to codehelp")
    const response = await uploadFileToCloudinary(file, "Codehelp", 90);
    console.log(response);

    //db me entry save krni h
    const fileData = await File.create({
        name,
        tags,
        email,
        imageUrl:response.secure_url,
    });

    res.json({
        success:true,
        imageUrl:response.secure_url,
        message:'Image Successfully Uploaded',
    })
}

catch(error){
    console.error(error);
    res.status(400).json({
        success:false,
        message:'Something went wrong',
    })
}
}


            
        

   