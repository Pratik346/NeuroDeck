const mongoose=require("mongoose");
const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Name is required"],
            trim:true
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:[true,"Password is required"],
            minlength:6
        },
        xpHistory: [
            {
              date: { type: String },   // "2026-04-21"
              xp: { type: Number, default: 0 }
            }
          ],
        //gamification
        xp: { type: Number, default: 0 },
        totalXP: { type: Number, default: 0 }, 
        level: { type: Number, default: 1 },
        streak: { type: Number, default: 0 },
        lastStudyDate: { type: Date, default: null },
        badges: [{ type: String }],
        //analytics
        totalCardsStudied: { type: Number, default: 0 },
    },
    {timestamps:true}
);
module.exports=mongoose.model("User",userSchema);