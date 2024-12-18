import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/erorr.middleware.js";
import UserRouter from "./routes/user.routes.js" ;
import imageRouter from "./routes/upload.routes.js"

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended:true,limit:"20kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//routes
app.use("/api/v1/users", UserRouter)
app.use("/api/v1/image", imageRouter)





app.use(errorMiddleware);

export {app}