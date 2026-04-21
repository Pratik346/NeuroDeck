const express=require("express");
const router=express.Router();
const {registerUser,loginUser,getMe}=require("../controller/authController.js");
const {protect}=require("../middleware/authMiddleware.js");
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/me",protect,getMe);
module.exports=router;