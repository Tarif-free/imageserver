import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOnCloudinary, deleteTempFileIfNeeded} from "../utils/cloudinary.js";
import { Image } from "../models/image.model.js";
import { AdminSettings } from "../models/allowedCategories.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";





// Utility function to delete all uploaded files
const deleteAllTempFiles = (files) => {
  if (files && files.length > 0) {
    files.forEach(file => {
      deleteTempFileIfNeeded(file.path);
    });
  }
};

const uploadImages = asyncHandler (async(req, res) => {
  

    const user = await User.findById(req.user?._id);

    if (user.role !== "Admin") {
      deleteAllTempFiles(req.files);
        throw new ApiError(400,`You are not allowed with this ${user.role} role`)
    } 
    const { category, tags } = req.body;

    //console.log(req.body);
   // console.log(category);
    

   if (!category || !Image.schema.obj.category.enum.includes(category)) {
    
    if (req.files && req.files.length > 0) {
      
      deleteAllTempFiles(req.files);
    }
    throw new ApiError(400, `Valid "category" is required and must be one of: ${Image.schema.obj.category.enum.join(', ')}.`);
  }

    const images = req.files;

    if (!images || images.length === 0) {
      deleteAllTempFiles(req.files);
      throw new ApiError(400, "No files uploaded")
    }

    const uploadedImages = [];

    for (const image of images) {
      try {
        const result = await uploadOnCloudinary(image.path); // Upload image to Cloudinary
  
        if (result && result.secure_url) {
          uploadedImages.push(result.secure_url);  // Save image URL if upload is successful
        } else {
          throw new ApiError(400, "Failed to upload image.");
        }
      } catch (error) {
        // Delete the temp file in case of an upload failure
        deleteAllTempFiles(req.files);
        throw new ApiError(400, `Error during image upload: ${error.message}`);
      }
    }
    // Save image links to MongoDB
    const savedImages = await Image.insertMany(uploadedImages.map(url => ({
      url,
      category,
      tags,
      owner: req.user._id  
    })));

    return res
    .status(200).
    json(new ApiResponse(200, savedImages,"Images upload successfully"));
})


 const updateAllowedCategories = asyncHandler(async (req, res) => {
  const { allowedCategories } = req.body;

  // Validate admin role
  if (req.user.role !== "Admin") {
    throw new ApiError(403, "Access denied. Only admins can update settings.");
  }

  const settings = await AdminSettings.findOneAndUpdate(
    {},
    { allowedCategories },
    { upsert: true, new: true }
  );

  return res.status(200).json(new ApiResponse(200, settings, "Allowed categories updated."));
});



const viewImages = asyncHandler( async(req, res) => {
  const settings = await AdminSettings.findOne();
  if (!settings) {
    throw new ApiError(400, "Admin settings not found.");
  }

  const allowedCategories = settings.allowedCategories;

  // Filter images based on allowed categories
  const images = await Image.find({ category: { $in: allowedCategories } });
 return res
    .status(200).
    json(new ApiResponse(200, images,"Successfully fetch all images"));
})

export {
    uploadImages,
    updateAllowedCategories,
    viewImages
}











