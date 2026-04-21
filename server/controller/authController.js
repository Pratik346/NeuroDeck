const User=require("../models/user.js");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
};
//Register user
const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        const userexist=await User.findOne({email});
        if(userexist){
            return res.status(400).json({message:"User already exists"});
        }
        //Hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const user=await User.create({
            name,email,password:hashedPassword
        });
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
//Login user
const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await Userser.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const ismatch=await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
const getMe=async(req,res)=>{
    res.json(req.user);
};
module.exports={registerUser,loginUser,getMe};