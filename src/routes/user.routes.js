import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controlller.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";






const router = Router();



router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//secure route
router.route("/logout").post(isUserAuthenticated, logoutUser)


export default router

