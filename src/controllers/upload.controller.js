import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { Image } from "../models/image.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";







const uploadImages = asyncHandler (async(req, res) => {

    const user = await User.findById(req.user?._id);

    if (user.role !== "Admin") {
        throw new ApiError(400,`You are not allowed with this ${user.role} role`)
    } 

    const images = req.files;

    if (!images || images.length === 0) {
      throw new ApiError(400, "No files uploaded")
    }

    const uploadedImages = [];

    for (const image of images) {

      const result = await uploadOnCloudinary(image.path);

      if (!result || result.error) {

       // console.error('Failed to upload file:', file.originalname);

        throw new ApiError(400,`${error} : No Failed to upload some files uploaded` )
      }

      const imageUrl = result.secure_url;
      uploadedImages.push(imageUrl);
    }

    // Save image links to MongoDB
    const savedImages = await Image.insertMany(uploadedImages.map(url => ({
      url,
      owner: req.user._id  
    })));

    return res
    .status(200).
    json(new ApiResponse(200, savedImages,"Images upload successfully"));
})

const viewImages = asyncHandler( async(req, res) => {
 const images = await Image.find()


//console.log(images.map(image => image.url));

 return res
    .status(200).
    json(new ApiResponse(200, images,"Successfully fetch all images"));
})

export {
    uploadImages,
    viewImages
}











