//app create
const express=require("express");
const app=express();

//port find
require("dotenv").config();
const PORT=process.env.PORT || 3000;

//middleware add krna hai
app.use(express.json());
const fileupload=require("express-fileupload");
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));


//DB se connect krna hai
const db=require("./config/database");
db.connect();

//cloud se connect krna hai
const cloudinary=require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//API mount krna hai
const Upload=require("./routes/FileUpload");
app.use('/api/v1/upload',Upload);

//Activate server
app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`);
})
