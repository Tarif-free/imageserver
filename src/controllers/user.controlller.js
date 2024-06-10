import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefereshTokens } from "../utils/genarateToken.js";

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

});

const loginUser = asyncHandler(async (req, res) => { 
    const {email,password} = req.body
    
    if(!email){
        throw new ApiError(400,"email is required")
    }

  const user = await User.findOne({email})

   if (!user){
    throw new ApiError(400,"User dose not exist")
   }

  const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid) {
    throw new ApiError(400,"Invalid password")
   }

  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

 

 const loggedIn = await User.findById(user._id).select("-password -refreshToken")

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
}

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json (
    new ApiResponse(
        200,
        {
            user: loggedIn, accessToken ,refreshToken 
        },
        "User loggedin successfully."
    )
)

});

const logoutUser = asyncHandler( async (req, res) => {
 await  User.findByIdAndUpdate(
    req.user._id,
     {
        $unset: {
            refreshToken:1
        }
     },
     {
        new: true
     }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200,{},"User logged Out")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser
};



