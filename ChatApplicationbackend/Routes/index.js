import express from "express";
import { 
    userdata,
    register,
    login,
 } from "../controllers/index.js";
import {authenticate} from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";




const app = express.Router();

app.get("/user",authenticate, userdata);
app.post("/register",upload.single("profile"), register  );
app.post("/login", login);

export default app;