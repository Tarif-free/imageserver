import { Router } from "express";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";
import { updateAllowedCategories, uploadImages, viewImages } from "../controllers/upload.controller.js";
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
     updateAllowedCategories);     


     /////////// View images
     router.route ("/allImages").get(viewImages);


export default router;

