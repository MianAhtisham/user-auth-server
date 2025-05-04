import express from "express";
import { getProfile, loginUser, logoutUser, registerUser } from "../controller/userController.js";

const route = express.Router();

route.post("/register", registerUser);  
route.post("/login", loginUser);       
route.get("/profile", getProfile);      
route.post("/logout", logoutUser);      

export default route;
