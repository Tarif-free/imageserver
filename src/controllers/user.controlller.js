import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler( async (req, res) => {

    const { username,email,password } = req.body;

if (
    [username,email,password].some((field) => 
        field?.trim() === "")
) {
    throw new ApiError(400,"All fields are required")
} 

const existedUser = await User.findOne({email})

if (existedUser) {
    throw new ApiError(409, "User with email already exists")
}

const user = await User.create({
    username,
    email,
    password,
    role:"User",
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)


if(!createdUser) {
    throw new ApiError(500,"Somthing went wron while registering the user")
}

return res.status(201).json(
new ApiResponse(200, createdUser,"User registered successfully")
)

})

const loginUser = asyncHandler(async (req, res) => { 

})

export {
    registerUser,
    loginUser,
};



