import { Router } from "express";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";
import { setAppConfig, uploadImages, viewImagesByApp } from "../controllers/upload.controller.js";
import  upload from "../middlewares/multer.middleware.js";






const router = Router();


//secure route
router.route("/upload")

.post( isUserAuthenticated, 

    upload.array('images', 10),

     uploadImages);

// Route for admin to update allowed categories
router
.post('/update-allowed-categories', isUserAuthenticated,
     setAppConfig);     


     /////////// View images
     router.route ("/allImages").get(viewImagesByApp);


export default router;

