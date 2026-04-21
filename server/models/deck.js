const mongoose=require("mongoose");
const deckSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:[true,"Deck Title is required"],
        trim:true,
    },
    description:{
        type:String,
        trim:true,
        default:""
    },
    totalCards:{
        type:Number,
        default:0,
    },
},
{timestamps:true}
);
module.exports=mongoose.model("Deck",deckSchema);