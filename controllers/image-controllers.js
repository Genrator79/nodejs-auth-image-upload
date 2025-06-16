const Image = require("../models/Image")
const {uploadToCloudinary} = require("../helpers/cloudinaryHelpers");
const fs = require("fs")
const cloudinary = require("../config/cloudinary")

const uploadImage = async(req,res)=>{
    try{
        //check if file is missing in the req object

        if(!req.file){
            return res.status(400).json({
                success : false,
                message : "File is required! Please upload an image"
            })
        }

        //upload to cloudinary
        const {url ,publicId} = await uploadToCloudinary(req.file.path);

        //store the url and public id along with the uploaded user id in database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy : req.userInfo.userId,
        })  

        await newlyUploadedImage.save();

        //delete the file from local stroage
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success : true,
            message : "Image uploaded successfully",
            image : newlyUploadedImage
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            messsage : "'Something went wrong! Please try again"
        }) 
    }
}

const fetchImageController = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page-1) * limit;

        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
        const totalImages = await Image.countDocuments();
        const totalPage = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const image = await Image.find().sort(sortObj).limit(limit).skip(skip);

        if(image){
            res.status(200).json({
                success : true,
                currentPage : page,
                totalPage : totalPage,
                totalImages : totalImages,
                data : image
            })
        };
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : "'Something went wrong! Please try again"
        })
    }
}

const deleteImageController =async(req,res) => {
    try{
        const gerCurrentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;
        const image = await Image.findById(gerCurrentIdOfImageToBeDeleted);
        if(!image)
        {
            return res.status(404).json({
                success : false,
                message : "Image not found",
            })
        }
        //check if this image is uploaded by the current user who is trying to delete it

        if(image.uploadedBy.toString() !==userId)
        {
            return res.status(403).json({
                success : false,
                message : "You are not authorised to delete this image as you have not uploaded it"
            })
        }

        //delete this image first from your cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        //delete this image from mongodb database
        await Image.findByIdAndDelete(gerCurrentIdOfImageToBeDeleted);
        
        return res.status(200).json({
            success : true,
            message : "Image delete successfully",
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            messsage : "'Something went wrong! Please try again"
        })
    }
}



module.exports={
    uploadImage,
    fetchImageController,
    deleteImageController,
};